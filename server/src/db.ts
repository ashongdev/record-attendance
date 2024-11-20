import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

// export const pool = new Pool({
// 	host: process.env.HOST,
// 	database: process.env.DATABASE,
// 	port: Number(process.env.DBPORT),
// 	user: process.env.DB_USER,
// 	password: process.env.PASSWORD,
// });
