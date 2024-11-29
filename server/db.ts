import { config } from "dotenv";
import { Pool } from "pg";
config();

// export const pool = new Pool({
// 	connectionString: `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.DBPORT}/${process.env.DATABASE}`,
// });

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
