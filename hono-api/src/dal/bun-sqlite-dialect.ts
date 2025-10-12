import type { Database } from "bun:sqlite";
import type { DB } from "../database-types";

import {
	CompiledQuery,
	type DatabaseConnection,
	type DatabaseIntrospector,
	type Dialect,
	type DialectAdapter,
	type Driver,
	type Kysely,
	type QueryCompiler,
	type QueryResult,
	SqliteAdapter,
	SqliteIntrospector,
	SqliteQueryCompiler,
} from "kysely";

/**
 * Config for the SQLite dialect.
 */
interface BunSqliteDialectConfig {
	/**
	 * An sqlite Database instance or a function that returns one.
	 */
	database: Database;

	/**
	 * Called once when the first query is executed.
	 */
	onCreateConnection?: (connection: DatabaseConnection) => Promise<void>;
}

class BunSqliteDriver implements Driver {
	readonly #config: BunSqliteDialectConfig;
	readonly #connectionMutex = new ConnectionMutex();

	#db?: Database;
	#connection?: DatabaseConnection;

	constructor(config: BunSqliteDialectConfig) {
		this.#config = { ...config };
	}

	async init(): Promise<void> {
		this.#db = this.#config.database;

		this.#connection = new BunSqliteConnection(this.#db);

		if (this.#config.onCreateConnection) {
			await this.#config.onCreateConnection(this.#connection);
		}
	}

	async acquireConnection(): Promise<DatabaseConnection> {
		// SQLite only has one single connection. We use a mutex here to wait
		// until the single connection has been released.
		await this.#connectionMutex.lock();
		return this.#connection!;
	}

	async beginTransaction(connection: DatabaseConnection): Promise<void> {
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}

	async commitTransaction(connection: DatabaseConnection): Promise<void> {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}

	async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}

	async releaseConnection(): Promise<void> {
		this.#connectionMutex.unlock();
	}

	async destroy(): Promise<void> {
		this.#db?.close();
	}
}

class BunSqliteConnection implements DatabaseConnection {
	readonly #db: Database;

	constructor(db: Database) {
		this.#db = db;
	}

	executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);

		if (stmt.columnNames.length > 0) {
			return Promise.resolve({
				rows: stmt.all(parameters as any) as O[],
			});
		}

		const results = stmt.run(parameters as any);

		return Promise.resolve({
			insertId: BigInt(results.lastInsertRowid),
			numAffectedRows: BigInt(results.changes),
			rows: [],
		});
	}

	async *streamQuery<R>(
		compiledQuery: CompiledQuery,
	): AsyncIterableIterator<QueryResult<R>> {
		const { sql, parameters } = compiledQuery;
		const stmt = this.#db.prepare(sql);

		if (!("iterator" in stmt)) {
			throw new Error(
				"bun:sqlite supports streaming in 1.1.31 or above. Please upgrade to use streaming.",
			);
		}

		for await (const row of stmt.iterate(parameters as any)) {
			yield { rows: [row as R] };
		}
	}
}

class ConnectionMutex {
	#promise?: Promise<void> | undefined;
	#resolve?: (() => void) | undefined;

	async lock(): Promise<void> {
		while (this.#promise) {
			await this.#promise;
		}

		this.#promise = new Promise((resolve) => {
			this.#resolve = resolve;
		});
	}

	unlock(): void {
		const resolve = this.#resolve;

		this.#promise = undefined;
		this.#resolve = undefined;

		resolve?.();
	}
}

export class BunSqliteDialect implements Dialect {
	readonly #config: BunSqliteDialectConfig;

	constructor(config: BunSqliteDialectConfig) {
		this.#config = { ...config };
	}

	createDriver(): Driver {
		return new BunSqliteDriver(this.#config);
	}

	createQueryCompiler(): QueryCompiler {
		return new SqliteQueryCompiler();
	}

	createAdapter(): DialectAdapter {
		return new SqliteAdapter();
	}

	createIntrospector(db: Kysely<DB>): DatabaseIntrospector {
		return new SqliteIntrospector(db);
	}
}
