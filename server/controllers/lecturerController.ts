import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "../db";
import { LecturerType } from "../exports/exports";

export const registerCourse = async (req: Request, res: Response) => {
	const { fullname, coursecode, coursename, last_checked, groupid } = req.body;

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
		res.status(403).json("Double Entry Detected.");
	} else {
		try {
			await pool.query(`INSERT INTO LECTURERS VALUES ($1, $2, $3, $4, $5, $6)`, [
				randomID,
				coursecode.toUpperCase(),
				fullname.toUpperCase(),
				groupid.toUpperCase(),
				last_checked,
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
			`SELECT ID, COURSECODE, COURSENAME, FULLNAME, GROUPID
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

		// if (lecturer.lat === lecturerLatitude && lecturer.long === lecturerLongitude) {
		return res.status(200).json(lecturer);
	} catch (error) {
		console.error("🚀 ~ Error in getDetails:", error);
		res.status(500).json({ error: "An unexpected error occurred." });
	}
};

export const updateLastChecked = async (req: Request, res: Response): Promise<void> => {
	const { groupid, coursecode, date, studentId } = req.body;

	try {
		await pool.query(
			`UPDATE LECTURERS SET LAST_CHECKED = $1 WHERE GROUPID = $2 AND COURSECODE = $3`,
			[date, groupid, coursecode]
		);
		const isChecked = await pool.query(`SELECT CHECKED FROM STUDENTS WHERE INDEXNUMBER = $1`, [
			studentId,
		]);
		const students = await pool.query(
			`SELECT * FROM STUDENTS WHERE COURSECODE = $1 AND GROUPID = $2 ORDER BY FULLNAME`,
			[coursecode, groupid]
		);

		if (isChecked.rowCount === 1) {
			await pool.query(
				`UPDATE STUDENTS SET LAST_CHECKED = $1, CHECKED = ${
					isChecked.rows[0].checked === "false" ? "true" : "false"
				} WHERE INDEXNUMBER = $2`,
				[date, studentId]
			);
		} else {
			res.status(404).json({
				msg: "The student you are trying to mark is not present in the system.",
			});
		}

		res.status(200).json(students.rows);
	} catch (error) {
		console.log("🚀 ~ getLecturerLocation ~ error:", error);
		res.status(404).json(error);
	}
};

export const getStudents = async (req: Request, res: Response): Promise<void> => {
	const { groupid, coursecode } = req.body;

	try {
		const sql = await pool.query(
			`SELECT * FROM STUDENTS WHERE GROUPID = $1 AND COURSECODE = $2 ORDER BY FULLNAME`,
			[groupid, coursecode]
		);

		res.status(200).json(sql.rows);
	} catch (error) {
		console.log("🚀 ~ getLecturerLocation ~ error:", error);
		res.status(404).json(error);
	}
};

export const authenticate = async (req: Request, res: Response): Promise<void> => {
	const { key } = req.params;

	const id = key.split("-")[0];
	const coursename = key.split("-")[1] + "-" + key.split("-")[2];

	try {
		const isAuthorized = await pool.query(
			`SELECT * FROM AUTHID WHERE ID = $1 AND UPPER(COURSECODE) = UPPER($2)`,
			[id, coursename]
		);
		if (isAuthorized.rowCount === 1) {
			res.status(200).json({ msg: "Request authorized" });
		} else {
			res.status(400).json({
				msg: "Request not authorized. Please see your faculty head to get the auth key for your course.",
			});
		}
	} catch (error) {
		console.log("🚀 ~ authenticate ~ error:", error);
		res.status(404).json(error);
	}
};
