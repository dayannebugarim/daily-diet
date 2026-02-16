import knex, { Knex } from "knex";
import { env } from "./env.js";

export const config: Knex.Config = {
	client: "sqlite3",
	connection: {
		filename: env.DATABASE_URL
	},
	useNullAsDefault: true,
	migrations: {
		extension: "ts",
		directory: "./src/database/migrations"
	}
};

export const db = knex(config);