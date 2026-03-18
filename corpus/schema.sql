CREATE TABLE IF NOT EXISTS documents (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    hash_sha256   TEXT    NOT NULL UNIQUE,
    title         TEXT    NOT NULL,
    author        TEXT    NOT NULL,
    year          INTEGER NOT NULL CHECK(year <= 1905),
    month         INTEGER CHECK(month IS NULL OR (month >= 1 AND month <= 12)),
    day           INTEGER CHECK(day IS NULL OR (day >= 1 AND day <= 31)),
    source_url    TEXT,
    format        TEXT    NOT NULL CHECK(format IN ('pdf','djvu','html','txt','tex','epub')),
    token_count   INTEGER NOT NULL CHECK(token_count > 0),
    char_count    INTEGER NOT NULL,
    language      TEXT    DEFAULT 'en',
    verified      INTEGER DEFAULT 0 CHECK(verified IN (0, 1)),
    notes         TEXT,
    created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE IF NOT EXISTS provenance (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id   INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    source_type   TEXT    NOT NULL CHECK(source_type IN (
                      'gutenberg','archive_org','hathitrust','gallica',
                      'wikisource','manual','other'
                  )),
    source_url    TEXT    NOT NULL,
    retrieved_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    original_format TEXT  NOT NULL,
    original_filename TEXT,
    retrieval_method TEXT  CHECK(retrieval_method IN ('api','scrape','manual_download','ocr')),
    checksum_at_retrieval TEXT,
    notes         TEXT
);

CREATE TABLE IF NOT EXISTS processing_log (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id   INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    action        TEXT    NOT NULL,
    details       TEXT,
    performed_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_documents_year    ON documents(year);
CREATE INDEX IF NOT EXISTS idx_documents_author  ON documents(author);
CREATE INDEX IF NOT EXISTS idx_documents_format  ON documents(format);
CREATE INDEX IF NOT EXISTS idx_documents_verified ON documents(verified);
CREATE INDEX IF NOT EXISTS idx_provenance_doc    ON provenance(document_id);
CREATE INDEX IF NOT EXISTS idx_provenance_source ON provenance(source_type);
