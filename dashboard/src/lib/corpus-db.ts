import Database from "better-sqlite3";
import path from "node:path";

const DB_PATH = path.resolve(process.cwd(), "..", "corpus", "corpus.db");

type StatsRow = {
  total_documents: number;
  total_tokens: number;
  earliest_year: number | null;
  latest_year: number | null;
};

type SourceRow = {
  id: number;
  title: string;
  author: string;
  year: number;
  token_count: number;
};

type YearRow = {
  year: number;
  count: number;
};

type AuthorRow = {
  author: string;
  count: number;
  tokens: number;
};

function getDb() {
  return new Database(DB_PATH, { readonly: true, fileMustExist: true });
}

export function getCorpusStats() {
  const db = getDb();
  try {
    const row = db
      .prepare(
        `SELECT
          COUNT(*) AS total_documents,
          COALESCE(SUM(token_count), 0) AS total_tokens,
          MIN(year) AS earliest_year,
          MAX(year) AS latest_year
        FROM documents`
      )
      .get() as StatsRow;

    return {
      totalDocuments: row.total_documents,
      totalTokens: row.total_tokens,
      earliestYear: row.earliest_year,
      latestYear: row.latest_year,
    };
  } finally {
    db.close();
  }
}

export function getCorpusSources() {
  const db = getDb();
  try {
    return db
      .prepare(
        `SELECT id, title, author, year, token_count
         FROM documents
         ORDER BY year ASC, author ASC, title ASC`
      )
      .all() as SourceRow[];
  } finally {
    db.close();
  }
}

export function getCorpusYearBuckets() {
  const db = getDb();
  try {
    return db
      .prepare(
        `SELECT year, COUNT(*) AS count
         FROM documents
         GROUP BY year
         ORDER BY year ASC`
      )
      .all() as YearRow[];
  } finally {
    db.close();
  }
}

export function getCorpusAuthors() {
  const db = getDb();
  try {
    return db
      .prepare(
        `SELECT author, COUNT(*) AS count, COALESCE(SUM(token_count), 0) AS tokens
         FROM documents
         GROUP BY author
         ORDER BY count DESC, tokens DESC, author ASC`
      )
      .all() as AuthorRow[];
  } finally {
    db.close();
  }
}
