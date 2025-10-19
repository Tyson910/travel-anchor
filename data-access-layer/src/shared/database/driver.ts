import type { DB } from "./types.ts";

import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from "kysely";
import pg from "pg";

// Parse numeric types as numbers
pg.types.setTypeParser(1700, (val) => parseFloat(val));

const dialect = new PostgresDialect({
	pool: new pg.Pool({
		connectionString: process.env.DATABASE_URL,
		max: 10,
	}),
});

export type DBInstance = Kysely<DB>;

export const kyselyDriver = new Kysely<DB>({
	dialect,
	plugins: [new ParseJSONResultsPlugin()],
});
