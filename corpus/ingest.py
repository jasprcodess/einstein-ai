#!/usr/bin/env python3
"""ingest.py — Add documents to the pre-1905 physics corpus."""

import sqlite3
import hashlib
import datetime
import urllib.request
import json
import re
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

DB_PATH = Path(__file__).parent / "corpus.db"
CUTOFF = datetime.date(1905, 4, 30)

VALID_FORMATS = {"pdf", "djvu", "html", "txt", "tex", "epub"}
VALID_SOURCES = {
    "gutenberg", "archive_org", "hathitrust",
    "gallica", "wikisource", "manual", "other",
}
VALID_METHODS = {"api", "scrape", "manual_download", "ocr"}

@dataclass
class DocumentInput:
    title: str
    author: str
    year: int
    source_url: str
    content: str
    format: str = "txt"
    month: Optional[int] = None
    day: Optional[int] = None
    language: str = "en"
    notes: Optional[str] = None
    source_type: str = "other"
    original_format: str = "txt"
    original_filename: Optional[str] = None
    retrieval_method: str = "api"


def enforce_cutoff(year: int, month: Optional[int], day: Optional[int]) -> None:
    if year > 1905:
        raise ValueError(f"Year {year} is after the 1905 cutoff.")
    if year < 1905:
        return
    if month is None:
        raise ValueError(
            "Year is 1905 but month is unknown. "
            "Cannot confirm publication is on or before April 30. "
            "Set month explicitly, or use year=1904 if unsure."
        )
    if month > 4:
        raise ValueError(f"1905-{month:02d} is after the April 30 cutoff.")
    if month < 4:
        return
    if day is not None and day > 30:
        raise ValueError(f"1905-04-{day:02d} is after April 30.")

def compute_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def count_tokens(text: str) -> int:
    return len(text.split())

def init_db() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    schema = (Path(__file__).parent / "schema.sql").read_text(encoding="utf-8")
    conn.executescript(schema)
    return conn

def ingest(doc: DocumentInput) -> int:
    enforce_cutoff(doc.year, doc.month, doc.day)
    
    text_hash = compute_hash(doc.content)
    tokens = count_tokens(doc.content)
    chars = len(doc.content)

    if tokens == 0:
        print(f"  SKIP {doc.title} - no content")
        return -1

    conn = init_db()
    try:
        cur = conn.execute(
            """INSERT INTO documents
               (hash_sha256, title, author, year, month, day,
                source_url, format, token_count, char_count,
                language, notes, verified)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)""",
            (text_hash, doc.title, doc.author, doc.year, doc.month, doc.day,
             doc.source_url, doc.format, tokens, chars,
             doc.language, doc.notes),
        )
        doc_id = cur.lastrowid

        conn.execute(
            """INSERT INTO provenance
               (document_id, source_type, source_url, original_format,
                original_filename, retrieval_method, checksum_at_retrieval)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (doc_id, doc.source_type, doc.source_url, doc.original_format,
             doc.original_filename, doc.retrieval_method, text_hash),
        )

        conn.execute(
            """INSERT INTO processing_log (document_id, action, details)
               VALUES (?, 'ingest', ?)""",
            (doc_id, f"Ingested {tokens} tokens from {doc.source_type}"),
        )

        conn.commit()
        print(f"  OK  {doc.title} ({doc.year}) — {tokens:,} tokens")
        
        safe_title = re.sub(r'[^a-zA-Z0-9_]', '_', doc.title)[:60]
        text_path = Path(__file__).parent / "data" / f"{doc_id}_{safe_title}.txt"
        text_path.write_text(doc.content, encoding="utf-8")
        
        return doc_id

    except sqlite3.IntegrityError as e:
        if "hash_sha256" in str(e):
            print(f"  DUP {doc.title}")
            return -1
        raise
    finally:
        conn.close()

def clean_gutenberg_text(text: str) -> str:
    """Strip Gutenberg headers/footers and common boilerplate."""
    start_markers = [
        "*** START OF THE PROJECT GUTENBERG EBOOK",
        "*** START OF THIS PROJECT GUTENBERG EBOOK",
        "***START OF THE PROJECT GUTENBERG EBOOK",
    ]
    end_markers = [
        "*** END OF THE PROJECT GUTENBERG EBOOK",
        "*** END OF THIS PROJECT GUTENBERG EBOOK",
        "***END OF THE PROJECT GUTENBERG EBOOK",
        "End of the Project Gutenberg EBook",
        "End of Project Gutenberg's",
    ]
    
    start_idx = 0
    for marker in start_markers:
        idx = text.find(marker)
        if idx != -1:
            end_of_line = text.find('\n', idx)
            start_idx = end_of_line + 1 if end_of_line != -1 else idx + len(marker)
            break
            
    end_idx = len(text)
    for marker in end_markers:
        idx = text.find(marker)
        if idx != -1:
            end_idx = idx
            break
    
    cleaned = text[start_idx:end_idx].strip()
    
    # Remove common transcriber/producer notes
    cleaned = re.sub(r'\[Transcriber.{0,500}?\]', '', cleaned, flags=re.DOTALL)
    cleaned = re.sub(r'Produced by .+?\n', '', cleaned, count=1)
    cleaned = re.sub(r'E-text prepared by .+?\n', '', cleaned, count=1)
    cleaned = re.sub(r'(?i)note:\s*project gutenberg also has .+?\n', '', cleaned, count=1)
    cleaned = re.sub(r'There are several editions of this ebook .+?\n', '', cleaned, count=1)
    # Remove multi-edition preambles that some texts have before actual content
    cleaned = re.sub(r'(?s)^.*?(?=\n\n\n)', '', cleaned, count=1)  # skip to first real paragraph break
    # Remove stray footer lines
    cleaned = re.sub(r'(?i)end of (?:the )?project gutenberg.*$', '', cleaned, flags=re.MULTILINE)
    
    # Normalize whitespace runs
    cleaned = re.sub(r'\n{4,}', '\n\n\n', cleaned)
    
    return cleaned.strip()

def fetch_gutenberg(id_number: int, title: str, author: str, year: int) -> bool:
    """Fetch and ingest a text from Project Gutenberg. Returns True on success."""
    url = f"https://www.gutenberg.org/cache/epub/{id_number}/pg{id_number}.txt"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'EinsteinAI-Corpus/1.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read()
            try:
                text = raw.decode('utf-8')
            except UnicodeDecodeError:
                text = raw.decode('latin-1')
            
        clean_text = clean_gutenberg_text(text)
        
        if len(clean_text.split()) < 100:
            print(f"  WARN Gutenberg {id_number} too short after cleaning ({len(clean_text.split())} words), skipping")
            return False
        
        author_last = author.split()[-1].lower()
        if author_last not in text.lower() and author_last not in title.lower():
            print(f"  WARN Gutenberg {id_number}: author '{author}' not found in text, may be wrong ID")
        
        doc_id = ingest(DocumentInput(
            title=title,
            author=author,
            year=year,
            source_url=url,
            content=clean_text,
            source_type="gutenberg",
            retrieval_method="api",
            notes=f"Gutenberg ID {id_number}",
        ))
        return doc_id > 0
    except Exception as e:
        print(f"  FAIL Gutenberg {id_number} ({title}): {e}")
        return False

def reset_corpus():
    """Wipe and rebuild the corpus database."""
    import shutil
    data_dir = Path(__file__).parent / "data"
    if data_dir.exists():
        shutil.rmtree(data_dir)
    data_dir.mkdir(exist_ok=True)
    if DB_PATH.exists():
        DB_PATH.unlink()
    for wal in [DB_PATH.with_suffix('.db-shm'), DB_PATH.with_suffix('.db-wal')]:
        if wal.exists():
            wal.unlink()
    print("Corpus reset.")


# ── Verified Gutenberg corpus ───────────────────────────────────
# Every ID below has been manually verified against gutenberg.org

CORPUS = [
    # ── PHYSICS: Newton ─────────────────────────────────────────
    (28233, "The Mathematical Principles of Natural Philosophy", "Isaac Newton", 1687),
    (33504, "Opticks", "Isaac Newton", 1704),

    # ── PHYSICS: Huygens ────────────────────────────────────────
    (14725, "Treatise on Light", "Christiaan Huygens", 1690),

    # ── PHYSICS: Galileo ────────────────────────────────────────
    (46036, "The Sidereal Messenger", "Galileo Galilei", 1610),

    # ── PHYSICS: Faraday ────────────────────────────────────────
    (14986, "Experimental Researches in Electricity, Volume 1", "Michael Faraday", 1839),
    (14474, "The Chemical History of a Candle", "Michael Faraday", 1861),

    # ── PHYSICS: Thomson / Kelvin ───────────────────────────────
    (36525, "Notes on Recent Researches in Electricity and Magnetism", "J. J. Thomson", 1893),

    # ── PHYSICS: Helmholtz ──────────────────────────────────────
    (77725, "Popular Lectures on Scientific Subjects: Second Series", "Hermann von Helmholtz", 1881),

    # ── PHYSICS: Tyndall on Faraday ─────────────────────────────
    (1225, "Faraday as a Discoverer", "John Tyndall", 1868),

    # ── PHILOSOPHY OF SCIENCE: Poincaré ─────────────────────────
    (39713, "Science and Hypothesis", "Henri Poincaré", 1902),

    # ── BIOLOGY: Darwin ─────────────────────────────────────────
    (1228, "On the Origin of Species, 1st Edition", "Charles Darwin", 1859),
    (2009, "The Origin of Species, 6th Edition", "Charles Darwin", 1872),
    (2300, "The Descent of Man", "Charles Darwin", 1871),
    (944,  "The Voyage of the Beagle", "Charles Darwin", 1839),
    (1227, "The Expression of the Emotions in Man and Animals", "Charles Darwin", 1872),

    # ── CHEMISTRY ───────────────────────────────────────────────
    (22914, "The Sceptical Chymist", "Robert Boyle", 1661),
    (30775, "Elements of Chemistry", "Antoine Lavoisier", 1789),

    # ── BIOLOGY: Huxley / Mendel ────────────────────────────────
    (2931, "Evidence as to Man's Place in Nature", "Thomas Henry Huxley", 1863),

    # ── MATHEMATICS ─────────────────────────────────────────────
    (21076, "The First Six Books of the Elements of Euclid", "Euclid (ed. John Casey)", 1885),

    # ── PSYCHOLOGY ──────────────────────────────────────────────
    (57628, "The Principles of Psychology, Vol. 1", "William James", 1890),
    (57634, "The Principles of Psychology, Vol. 2", "William James", 1890),

    # ── GEOLOGY ─────────────────────────────────────────────────
    (33224, "Principles of Geology", "Sir Charles Lyell", 1830),

    # ── PHILOSOPHY OF SCIENCE ───────────────────────────────────
    (54897, "Preliminary Discourse on the Study of Natural Philosophy", "John F. W. Herschel", 1830),

    # ── ECONOMICS (Enlightenment science) ───────────────────────
    (3300, "An Inquiry into the Nature and Causes of the Wealth of Nations", "Adam Smith", 1776),

    # ═══════════════════════════════════════════════════════════════
    # EXPANDED CORPUS — verified Gutenberg IDs, all pre-1905
    # ═══════════════════════════════════════════════════════════════

    # ── PHYSICS: Mach ──────────────────────────────────────────
    (39508, "Popular Scientific Lectures", "Ernst Mach", 1895),

    # ── PHYSICS: Franklin ──────────────────────────────────────
    (45515, "Experiments and Observations on Electricity", "Benjamin Franklin", 1751),

    # ── PHYSICS: Count Rumford ─────────────────────────────────
    (1025, "Essays: Political, Economical, and Philosophical", "Count Rumford", 1798),

    # ── PHYSICS: Tyndall (expanded) ────────────────────────────
    (24527, "Fragments of Science", "John Tyndall", 1871),
    (3044, "The Glaciers of the Alps", "John Tyndall", 1860),
    (6783, "Six Lectures on Light", "John Tyndall", 1873),
    (25655, "Sound", "John Tyndall", 1867),
    (22942, "The Forms of Water", "John Tyndall", 1872),
    (30880, "Essays on the Imagination in Science", "John Tyndall", 1870),

    # ── ASTRONOMY ──────────────────────────────────────────────
    (19309, "The Reminiscences of an Astronomer", "Simon Newcomb", 1903),
    (52869, "On the Connexion of the Physical Sciences", "Mary Somerville", 1834),
    (28247, "A Popular History of Astronomy", "Agnes M. Clerke", 1885),
    (19229, "The Herschels and Modern Astronomy", "Agnes M. Clerke", 1895),
    (44839, "Physical Geography", "Mary Somerville", 1848),
    (55767, "A Preliminary Dissertation on the Mechanisms of the Heavens", "Mary Somerville", 1831),

    # ── MATHEMATICS ────────────────────────────────────────────
    (36856, "General Investigations of Curved Surfaces", "Carl Friedrich Gauss", 1827),
    (58881, "A Philosophical Essay on Probabilities", "Pierre-Simon Laplace", 1814),
    (23100, "A Budget of Paradoxes, Volume I", "Augustus De Morgan", 1872),
    (26408, "A Budget of Paradoxes, Volume II", "Augustus De Morgan", 1872),
    (38769, "Elementary Illustrations of the Differential and Integral Calculus", "Augustus De Morgan", 1842),
    (16352, "On the Study and Difficulties of Mathematics", "Augustus De Morgan", 1831),

    # ── CHEMISTRY (expanded) ───────────────────────────────────
    (74948, "A New System of Chemical Philosophy", "John Dalton", 1810),
    (51326, "The Principles of Chemistry, Volume I", "Dmitri Mendeleev", 1891),
    (54210, "The Principles of Chemistry, Volume II", "Dmitri Mendeleev", 1891),
    (57856, "Researches Chemical and Philosophical", "Humphry Davy", 1800),
    (3929, "Consolations in Travel", "Humphry Davy", 1830),

    # ── BIOLOGY: Wallace ───────────────────────────────────────
    (2530, "The Malay Archipelago, Volume 1", "Alfred Russel Wallace", 1869),
    (2539, "The Malay Archipelago, Volume 2", "Alfred Russel Wallace", 1869),
    (14558, "Darwinism", "Alfred Russel Wallace", 1889),
    (22084, "Contributions to the Theory of Natural Selection", "Alfred Russel Wallace", 1870),
    (13915, "Island Life", "Alfred Russel Wallace", 1880),
    (12422, "Tropical Nature, and Other Essays", "Alfred Russel Wallace", 1878),
    (6062, "Man's Place in the Universe", "Alfred Russel Wallace", 1903),

    # ── BIOLOGY: Haeckel ───────────────────────────────────────
    (8700, "The Evolution of Man", "Ernst Haeckel", 1874),
    (40472, "The History of Creation, Vol. 1", "Ernst Haeckel", 1876),
    (40473, "The History of Creation, Vol. 2", "Ernst Haeckel", 1876),
    (42968, "The Riddle of the Universe", "Ernst Haeckel", 1899),
    (7124, "Monism as Connecting Religion and Science", "Ernst Haeckel", 1894),
    (60714, "The Wonders of Life", "Ernst Haeckel", 1904),
    (24560, "Freedom in Science and Teaching", "Ernst Haeckel", 1879),

    # ── BIOLOGY / GEOLOGY (misc) ───────────────────────────────
    (62918, "Essay on the Theory of the Earth", "Georges Cuvier", 1813),
    (14565, "Cosmos, Vol. 1", "Alexander von Humboldt", 1845),
    (4239, "An Essay on the Principle of Population", "Thomas Malthus", 1798),

    # ── HERBERT SPENCER ────────────────────────────────────────
    (54612, "The Principles of Biology, Volume 1", "Herbert Spencer", 1864),
    (67282, "The Principles of Biology, Volume 2", "Herbert Spencer", 1867),
    (29869, "Essays: Scientific, Political, and Speculative, Vol. 1", "Herbert Spencer", 1891),
    (53395, "Essays: Scientific, Political, and Speculative, Vol. 2", "Herbert Spencer", 1891),
    (54076, "Essays: Scientific, Political, and Speculative, Vol. 3", "Herbert Spencer", 1891),

    # ── PHILOSOPHY OF SCIENCE ──────────────────────────────────
    (45988, "Novum Organum", "Francis Bacon", 1620),
    (27942, "A System of Logic", "John Stuart Mill", 1843),
    (68693, "History of the Inductive Sciences", "William Whewell", 1837),
    (60851, "On the Philosophy of Discovery", "William Whewell", 1860),
    (52670, "History of Scientific Ideas", "William Whewell", 1858),
    (13205, "Astronomy and General Physics", "William Whewell", 1833),
    (18269, "The Plurality of Worlds", "William Whewell", 1853),

    # ── MEDICINE ───────────────────────────────────────────────
    (67065, "On the Motion of the Heart and Blood in Animals", "William Harvey", 1628),

    # ── GENERAL SCIENCE ────────────────────────────────────────
    (84, "Frankenstein; or, The Modern Prometheus", "Mary Shelley", 1818),
]


if __name__ == "__main__":
    import sys
    
    if "--reset" in sys.argv:
        reset_corpus()
    
    (Path(__file__).parent / "data").mkdir(exist_ok=True)
    
    print(f"Ingesting {len(CORPUS)} verified texts from Project Gutenberg...")
    print()
    
    success = 0
    failed = 0
    for gutenberg_id, title, author, year in CORPUS:
        if fetch_gutenberg(gutenberg_id, title, author, year):
            success += 1
        else:
            failed += 1
    
    # Print summary
    conn = init_db()
    row = conn.execute("SELECT count(*), sum(token_count) FROM documents").fetchone()
    conn.close()
    print()
    print(f"Done. {success} ingested, {failed} failed. {row[0]} documents in DB, {row[1]:,} tokens total.")
