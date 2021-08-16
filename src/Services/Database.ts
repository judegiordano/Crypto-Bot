import path from "path";
import { Connection, createConnection, getConnection, ConnectionOptions } from "typeorm";

import { Config } from "./Config";

export class Database {

	private static readonly Connector = {
		type: Config.Db.DB_TYPE,
		url: Config.Db.DB_HOST,
		synchronize: Config.Db.DB_SYNC,
		useUnifiedTopology: true,
		logging: Config.Db.DB_LOGGING,
		useNewUrlParser: true,
		entities: [path.join(__dirname, "../Models/**/*.{ts,js}")],
		ssl: true,
		cache: true
	} as ConnectionOptions;

	public static async Connect(): Promise<void> {

		let connection: Connection | undefined;
		try {
			connection = getConnection();
		} catch (e) {
			console.error(`no existing connection found: ${e}`);
		}

		try {
			if (connection) {
				if (!connection.isConnected)
					await connection.connect();
			} else
				await createConnection(Database.Connector);
			console.log("successfully connected to database");
		} catch (e) {
			throw new Error(`error connecting to database: ${e}`);
		}
	}

	public static GetStatus(): Connection {
		const connection = getConnection();
		return connection;
	}

	public static async Close(): Promise<void> {
		try {
			const conn = getConnection();
			await conn.close();
		} catch (e) {
			throw new Error(e);
		}
	}
}