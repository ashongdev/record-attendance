import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "../db";
import { Entity } from "../exports/exports";

export const checkIn = async (req: Request, res: Response) => {
	const { fullname, indexnumber, groupid, coursecode, last_checked } = req.body;

	try {
		const validCourseCode = await pool.query(
			`SELECT COURSECODE FROM LECTURERS WHERE COURSECODE = $1 AND GROUPID = $2`,
			[coursecode.toUpperCase(), groupid.toUpperCase()]
		);

		if (validCourseCode.rowCount === 1) {
			const check: QueryResult<Entity> = await pool.query(
				`SELECT * FROM STUDENTS WHERE FULLNAME = $1 AND INDEXNUMBER = $2 AND GROUPID = $3 AND COURSECODE = $4`,
				[
					fullname.toUpperCase(),
					indexnumber,
					groupid.toUpperCase(),
					coursecode.toUpperCase(),
				]
			);

			if (check.rowCount === 1) {
				res.status(403).json("Double Entry Detected.");
			} else {
				const randomID = uuid();

				await pool.query(`INSERT INTO STUDENTS VALUES ($1, $2, $3, $4, $5, $6)`, [
					randomID,
					fullname.toUpperCase(),
					coursecode.toUpperCase(),
					last_checked,
					groupid.toUpperCase(),
					indexnumber,
				]);

				res.status(200).json({ msg: "Student data recorded." });
			}
		} else {
			res.status(403).json("Not registered");
		}
	} catch (error) {
		console.log("🚀 ~ checkIn ~ error:", error);
		res.status(403).json(error);
	}
};
