import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "../db";
import { Entity, LecturerType } from "../exports/exports";

export const getStudentList = async (req: Request, res: Response) => {
	const { courseCode } = req.params;
	const splitCode = courseCode.split("-");
	const newCourseCode = splitCode[0].toUpperCase() + "-" + splitCode[1];
	const groupid = splitCode[splitCode.length - 1];

	try {
		const sql: QueryResult<Entity> = await pool.query(
			`SELECT * FROM STUDENTLIST WHERE COURSECODE = $1 AND GROUPID = $2`,
			[newCourseCode.toUpperCase(), groupid.toUpperCase()]
		);

		res.status(200).json(sql.rows);
	} catch (error) {
		res.status(404).json(error);
		console.log("🚀 ~ app.get ~ error:", error);
	}
};

export const registerCourse = async (req: Request, res: Response) => {
	const { fullname, coursecode, coursename, lat, long, time, groupid } = req.body;

	const randomID = uuid();

	const check: QueryResult<LecturerType> = await pool.query(
		`SELECT * FROM LECTURERS WHERE FULLNAME = $1 AND COURSENAME = $2 AND GROUPID = $3 AND COURSECODE = $4`,
		[
			fullname.toUpperCase(),
			coursename.toUpperCase(),
			groupid.toUpperCase(),
			coursecode.toUpperCase(),
		]
	);

	if (check.rowCount === 1) {
		res.status(403).json("Double Entry Detected.");
	} else {
		try {
			await pool.query(`INSERT INTO LECTURERS VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
				randomID,
				coursecode.toUpperCase(),
				fullname.toUpperCase(),
				groupid.toUpperCase(),
				lat,
				long,
				time,
				coursename.toUpperCase(),
			]);

			const sql: QueryResult<LecturerType> = await pool.query(
				`SELECT LONG, LAT, COURSENAME, COURSECODE, FULLNAME, GROUPID FROM LECTURERS WHERE COURSECODE = $1 `,
				[coursecode]
			);

			res.status(200).json(sql.rows[0]);
		} catch (error) {
			console.log("🚀 ~ registerCourse ~ error:", error);
			res.status(403).json(error);
		}
	}
};
