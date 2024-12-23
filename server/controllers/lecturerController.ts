import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "../db";
import { LecturerType } from "../exports/exports";

const registerCourse = async (req: Request, res: Response) => {
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

const getDetails = async (req: Request, res: Response): Promise<any> => {
	const { data } = req.body;

	if (!data) {
		res.status(500).json({ error: "An unexpected error occurred." });
	}

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

const updateLastChecked = async (data: any, io: any): Promise<void> => {
	try {
		if (!data) {
			throw new Error("No data provided for this operation");
		}

		const { groupid, coursecode, date, studentId } = data;
		const randomID = uuid();

		const isStudentChecked = await pool.query(
			`SELECT * FROM ATTENDANCE WHERE STUDENT_ID = $1 AND GROUPID = $2 AND COURSECODE = $3 AND DATE(MARKED_AT) = DATE($4)`,
			[studentId, groupid, coursecode, new Date()]
		);

		if (isStudentChecked.rowCount) {
			for (let index = 0; index <= isStudentChecked.rowCount; index++) {
				const currentRow = isStudentChecked.rows[index];

				const isSameDay =
					currentRow.marked_at.toDateString() === new Date(date).toDateString();

				if (isSameDay) {
					const selectIsPresent = await pool.query(
						`SELECT IS_PRESENT FROM ATTENDANCE WHERE STUDENT_ID = $1 AND DATE(MARKED_AT) = DATE($2) AND GROUPID = $3 AND COURSECODE = $4`,
						[studentId, date, groupid, coursecode]
					);

					// Check if is_present is true in the attendance table
					if (selectIsPresent.rows[0].is_present) {
						// Delete student record is true (setting it to false)
						await pool.query(
							`DELETE FROM ATTENDANCE WHERE STUDENT_ID = $1 AND DATE(MARKED_AT) = DATE($2) AND GROUPID = $3 AND COURSECODE = $4 AND IS_PRESENT = $5`,
							[studentId, date, groupid, coursecode, true]
						);

						// Update checked in students table to false
						await pool.query(
							`UPDATE STUDENTS SET LAST_CHECKED = $1, CHECKED = $2 WHERE INDEXNUMBER = $3 AND GROUPID = $4 AND COURSECODE = $5 AND CHECKED = $6 RETURNING CHECKED`,
							[date, false, studentId, groupid, coursecode, true]
						);
					} else {
						// If is_present if false

						// Update is_present in the attendance table: set is_present to true
						await pool.query(
							`UPDATE ATTENDANCE SET IS_PRESENT = $1 WHERE STUDENT_ID = $2 AND DATE(MARKED_AT) = DATE($3) AND GROUPID = $4 AND COURSECODE = $5 RETURNING IS_PRESENT`,
							[true, studentId, date, groupid, coursecode]
						);

						// Update checked in the students table: set checked to true
						await pool.query(
							`UPDATE STUDENTS SET LAST_CHECKED = $1, CHECKED = $2 WHERE INDEXNUMBER = $3 AND GROUPID = $4 AND COURSECODE = $5 RETURNING CHECKED`,
							[date, true, studentId, groupid, coursecode]
						);
					}
				} else {
					// If its not the same day, insert a new record into the table
					await pool.query(
						`INSERT INTO ATTENDANCE (ID, STUDENT_ID, IS_PRESENT, GROUPID, COURSECODE) VALUES ($1, $2, $3, $4, $5)`,
						[randomID, studentId, true, groupid.toUpperCase(), coursecode.toUpperCase()]
					);

					// Update checked in students table to false
					await pool.query(
						`UPDATE STUDENTS SET LAST_CHECKED = $1, CHECKED = $2 WHERE INDEXNUMBER = $3 AND GROUPID = $4 AND COURSECODE = $5 RETURNING CHECKED`,
						[date, true, studentId, groupid, coursecode]
					);
				}
			}

			return;
		} else {
			await pool.query(
				`INSERT INTO ATTENDANCE (ID, STUDENT_ID, IS_PRESENT, GROUPID, COURSECODE) VALUES ($1, $2, $3, $4, $5)`,
				[randomID, studentId, true, groupid.toUpperCase(), coursecode.toUpperCase()]
			);

			await pool.query(
				`UPDATE STUDENTS SET LAST_CHECKED = $1, CHECKED = $2 WHERE INDEXNUMBER = $3 AND GROUPID = $4 AND COURSECODE = $5 RETURNING CHECKED`,
				[date, true, studentId, groupid, coursecode]
			);
		}
	} catch (error) {
		console.log("🚀 ~ updateLastChecked ~ error:", error);

		io.emit("updateLastChecked", error);

		return;
	}
};

const getStudents = async (req: Request, res: Response): Promise<void> => {
	const { groupid, coursecode } = req.body;

	try {
		const sql = await pool.query(
			`SELECT * FROM STUDENTS WHERE GROUPID = $1 AND COURSECODE = $2 ORDER BY FULLNAME`,
			[groupid, coursecode]
		);

		res.status(200).json(sql.rows);

		return;
	} catch (error) {
		console.log("🚀 ~ getStudents ~ error:", error);
		res.status(404).json(error);
	}
};

const getStudentsHistory = async (req: Request, res: Response): Promise<void> => {
	const { studentId } = req.params;

	try {
		const sql = await pool.query(
			`SELECT STUDENT_ID, IS_PRESENT, MARKED_AT FROM ATTENDANCE
			WHERE STUDENT_ID  IN (
				SELECT INDEXNUMBER FROM STUDENTS WHERE INDEXNUMBER = $1
			)`,
			[studentId]
		);
		const rows = sql.rows;
		const filteredRows = rows.filter((row) => row.is_present === true);

		if (sql.rowCount) {
			const name = await pool.query(`SELECT FULLNAME FROM STUDENTS WHERE INDEXNUMBER = $1`, [
				studentId,
			]);

			res.status(200).json({ noOfTimes: filteredRows.length, name: name.rows[0].fullname });
		}

		return;
	} catch (error) {
		console.log("🚀 ~ getStudents ~ error:", error);
		res.status(404).json(error);
	}
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
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

export {
	authenticate,
	getDetails,
	getStudents,
	getStudentsHistory,
	registerCourse,
	updateLastChecked,
};
