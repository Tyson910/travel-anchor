import type { DB } from "./types.ts";

import { Kysely, ParseJSONResultsPlugin } from "kysely";

import { BunSqliteDialect } from "./bun-sqlite-dialect";
import { Database } from "bun:sqlite";

const dbPath = import.meta.env.DATABASE_URL;

const sqliteDB = new Database(dbPath, {
	readonly: true,
	create: false,
});

const dialect = new BunSqliteDialect({
	database: sqliteDB,
});

export { NoResultError } from "kysely";
export type DBInstance = Kysely<DB>;

export const kyselyDriver = new Kysely<DB>({
	dialect,
	plugins: [new ParseJSONResultsPlugin()],
});
