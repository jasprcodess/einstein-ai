import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

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

function withDb<T>(fn: (db: InstanceType<typeof Database>) => T): T {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error("Corpus database not found");
  }
  const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  try {
    return fn(db);
  } finally {
    db.close();
  }
}

export function getCorpusStats() {
  return withDb((db) => {
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
  });
}

export function getCorpusSources() {
  return withDb((db) =>
    db
      .prepare(
        `SELECT id, title, author, year, token_count
         FROM documents
         ORDER BY token_count DESC`
      )
      .all() as SourceRow[]
  );
}

export function getCorpusYearBuckets() {
  return withDb((db) =>
    db
      .prepare(
        `SELECT year, COUNT(*) AS count
         FROM documents
         GROUP BY year
         ORDER BY year ASC`
      )
      .all() as YearRow[]
  );
}

export function getCorpusAuthors() {
  return withDb((db) =>
    db
      .prepare(
        `SELECT author, COUNT(*) AS count, COALESCE(SUM(token_count), 0) AS tokens
         FROM documents
         GROUP BY author
         ORDER BY tokens DESC, count DESC`
      )
      .all() as AuthorRow[]
  );
}

/** Get all data in a single DB connection (used by /api/corpus). */
export function getCorpusAll() {
  return withDb((db) => {
    const stats = db.prepare(
      `SELECT COUNT(*) AS total_documents, COALESCE(SUM(token_count), 0) AS total_tokens,
              MIN(year) AS earliest_year, MAX(year) AS latest_year FROM documents`
    ).get() as StatsRow;

    const sources = db.prepare(
      `SELECT id, title, author, year, token_count FROM documents ORDER BY token_count DESC`
    ).all() as SourceRow[];

    const years = db.prepare(
      `SELECT year, COUNT(*) AS count FROM documents GROUP BY year ORDER BY year ASC`
    ).all() as YearRow[];

    const authors = db.prepare(
      `SELECT author, COUNT(*) AS count, COALESCE(SUM(token_count), 0) AS tokens
       FROM documents GROUP BY author ORDER BY tokens DESC, count DESC`
    ).all() as AuthorRow[];

    return {
      stats: {
        totalDocuments: stats.total_documents,
        totalTokens: stats.total_tokens,
        earliestYear: stats.earliest_year,
        latestYear: stats.latest_year,
      },
      sources,
      years,
      authors,
    };
  });
}
