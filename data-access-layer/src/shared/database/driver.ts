import type { DB } from "./types.ts";

import { Kysely, ParseJSONResultsPlugin, PostgresDialect } from "kysely";
import { Pool } from "pg";

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: import.meta.env.DATABASE_URL,
		max: 10,
	}),
});

export type DBInstance = Kysely<DB>;

export const kyselyDriver = new Kysely<DB>({
	dialect,
	plugins: [new ParseJSONResultsPlugin()],
});
