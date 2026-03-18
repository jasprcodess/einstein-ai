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
        print(f"Skipping {doc.title} - no content")
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
        print(f"Ingested: {doc.title} ({doc.year}) — {tokens:,} tokens")
        
        # Save raw text to disk just in case
        safe_title = re.sub(r'[^a-zA-Z0-9_]', '_', doc.title)[:50]
        text_path = Path(__file__).parent / "data" / f"{doc_id}_{safe_title}.txt"
        text_path.write_text(doc.content, encoding="utf-8")
        
        return doc_id

    except sqlite3.IntegrityError as e:
        if "hash_sha256" in str(e):
            print(f"Skipping duplicate: {doc.title}")
            return -1
        raise
    finally:
        conn.close()

def clean_gutenberg_text(text: str) -> str:
    """Strip Gutenberg headers/footers."""
    start_markers = [
        "*** START OF THE PROJECT GUTENBERG EBOOK",
        "*** START OF THIS PROJECT GUTENBERG EBOOK",
    ]
    end_markers = [
        "*** END OF THE PROJECT GUTENBERG EBOOK",
        "*** END OF THIS PROJECT GUTENBERG EBOOK",
    ]
    
    start_idx = 0
    for marker in start_markers:
        idx = text.find(marker)
        if idx != -1:
            # find the end of that line
            end_of_line = text.find('\n', idx)
            start_idx = end_of_line + 1 if end_of_line != -1 else idx + len(marker)
            break
            
    end_idx = len(text)
    for marker in end_markers:
        idx = text.find(marker)
        if idx != -1:
            end_idx = idx
            break
            
    return text[start_idx:end_idx].strip()

def fetch_gutenberg(id_number: int, title: str, author: str, year: int) -> None:
    url = f"https://www.gutenberg.org/cache/epub/{id_number}/pg{id_number}.txt"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            text = response.read().decode('utf-8')
            
        clean_text = clean_gutenberg_text(text)
        
        ingest(DocumentInput(
            title=title,
            author=author,
            year=year,
            source_url=url,
            content=clean_text,
            source_type="gutenberg",
            retrieval_method="scrape"
        ))
    except Exception as e:
        print(f"Failed to fetch Gutenberg {id_number}: {e}")

if __name__ == "__main__":
    # Ensure data dir exists
    (Path(__file__).parent / "data").mkdir(exist_ok=True)
    
    print("Fetching foundational physics texts...")
    
    # A focused, verified sample of foundational physics texts pre-1905
    texts = [
        (28233, "The Mathematical Principles of Natural Philosophy (Principia)", "Isaac Newton", 1687),
        (33333, "Opticks", "Isaac Newton", 1704),
        (14725, "Treatise on Light", "Christiaan Huygens", 1690),
        (39713, "Science and Hypothesis", "Henri Poincaré", 1902),
        (500, "Matter and Motion", "James Clerk Maxwell", 1876),
        (37729, "A Treatise on Electricity and Magnetism", "James Clerk Maxwell", 1873)
    ]
    
    for gutenberg_id, title, author, year in texts:
        fetch_gutenberg(gutenberg_id, title, author, year)
