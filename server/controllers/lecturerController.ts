import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "../db";
import { Entity, LecturerType } from "../exports/exports";

export const getStudentList = async (req: Request, res: Response): Promise<any> => {
	const { courseCode } = req.params;

	try {
		const splitCode = courseCode.split("-");
		if (splitCode.length < 3) {
			return res.status(400).json({ error: "Invalid course code format." });
		}

		const newCourseCode = `${splitCode[0].toUpperCase()}-${splitCode[1].toUpperCase()}`;
		const groupid = splitCode[splitCode.length - 1].toUpperCase();

		const sql: QueryResult<Entity> = await pool.query(
			`SELECT * FROM STUDENTLIST WHERE COURSECODE = $1 AND GROUPID = $2`,
			[newCourseCode, groupid]
		);

		if (sql.rowCount === 0) {
			return res
				.status(404)
				.json({ message: "No students found for the given course code and group ID." });
		}

		res.status(200).json(sql.rows);
	} catch (error) {
		console.error("🚀 ~ getStudentList ~ error:", error);
		res.status(500).json({ error: "An unexpected error occurred." });
	}
};

export const registerCourse = async (req: Request, res: Response) => {
	const { fullname, coursecode, coursename, lat, long, time, groupid } = req.body;

	const randomID = uuid();

	const check: QueryResult<LecturerType> = await pool.query(
		`SELECT  ID, COURSENAME, COURSECODE, FULLNAME, GROUPID FROM LECTURERS WHERE FULLNAME = $1 AND COURSENAME = $2 AND GROUPID = $3 AND COURSECODE = $4`,
		[
			fullname.toUpperCase(),
			coursename.toUpperCase(),
			groupid.toUpperCase(),
			coursecode.toUpperCase(),
		]
	);

	if (check.rowCount === 1) {
		setTimeout(() => {
			res.status(403).json("Double Entry Detected.");
		}, 3000);
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
				`SELECT  ID, COURSENAME, COURSECODE, FULLNAME, GROUPID FROM LECTURERS WHERE FULLNAME = $1 AND COURSENAME = $2 AND GROUPID = $3 AND COURSECODE = $4`,
				[
					fullname.toUpperCase(),
					coursename.toUpperCase(),
					groupid.toUpperCase(),
					coursecode.toUpperCase(),
				]
			);

			res.status(200).json(sql.rows[0]);
		} catch (error) {
			console.log("🚀 ~ registerCourse ~ error:", error);
			res.status(403).json(error);
		}
	}
};

export const getDetails = async (req: Request, res: Response): Promise<any> => {
	const { data, lecturerLatitude, lecturerLongitude } = req.body;
	const { fullname, coursecode, coursename, groupid } = data;

	try {
		const sql = await pool.query(
			`SELECT ID, COURSECODE, COURSENAME, FULLNAME, GROUPID, LAT, LONG 
				FROM LECTURERS 
				WHERE UPPER(COURSECODE) = UPPER($1) 
				  AND UPPER(COURSENAME) = UPPER($2) 
				  AND UPPER(FULLNAME) = UPPER($3) 
				  AND UPPER(GROUPID) = UPPER($4)`,
			[coursecode, coursename, fullname, groupid]
		);

		if (sql.rowCount === 0) {
			return res.status(404).json({ error: "Lecturer not found." });
		}

		const lecturer = sql.rows[0];

		if (lecturer.lat === lecturerLatitude && lecturer.long === lecturerLongitude) {
			return res.status(200).json(lecturer);
		}

		// Update lecturer's location if different
		await pool.query(
			`UPDATE LECTURERS 
				SET LAT = $1, LONG = $2 
				WHERE UPPER(COURSECODE) = UPPER($3) 
				  AND UPPER(COURSENAME) = UPPER($4) 
				  AND UPPER(FULLNAME) = UPPER($5) 
				  AND UPPER(GROUPID) = UPPER($6)`,
			[lecturerLatitude, lecturerLongitude, coursecode, coursename, fullname, groupid]
		);

		// Return the updated record
		const updatedRecord = await pool.query(
			`SELECT ID, COURSECODE, COURSENAME, FULLNAME, GROUPID, LAT, LONG 
				FROM LECTURERS 
				WHERE UPPER(COURSECODE) = UPPER($1) 
				  AND UPPER(COURSENAME) = UPPER($2) 
				  AND UPPER(FULLNAME) = UPPER($3) 
				  AND UPPER(GROUPID) = UPPER($4)`,
			[coursecode, coursename, fullname, groupid]
		);

		res.status(200).json(updatedRecord.rows[0]);
	} catch (error) {
		console.error("🚀 ~ Error in getDetails:", error);
		res.status(500).json({ error: "An unexpected error occurred." });
	}
};

export const getLecturersLocation = async (req: Request, res: Response): Promise<void> => {
	const { id } = req.params;

	try {
		const sql = await pool.query(`SELECT LONG, LAT FROM LECTURERS WHERE ID = $1`, [id]);

		res.status(200).json(sql.rows[0]);
	} catch (error) {
		console.log("🚀 ~ getLecturerLocation ~ error:", error);
		res.status(404).json(error);
	}
};
