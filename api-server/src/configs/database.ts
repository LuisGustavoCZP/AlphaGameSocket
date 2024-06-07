import { PoolConfig } from "pg";

import {
	DB_HOST,
	DB_PORT,
	DB_DATABASE,
	DB_USERNAME,
	DB_PASSWORD,
} from "./envs";

export const database : PoolConfig = {
	host: DB_HOST,
	port: DB_PORT ? Number(DB_PORT) : 5432,
	database: DB_DATABASE,
	user: DB_USERNAME,
	password: DB_PASSWORD,
};

// default database;