import cors from "cors";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "./db";
config();

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://record-attendance.vercel.app"];

export type CorsCallback = (error: Error | null, success: boolean) => void;
const corsOptions = {
	origin: function (origin: string | undefined, callback: CorsCallback) {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"), false);
		}
	},
	methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	optionsSuccessStatus: 200,
	credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

export type SignInType = {
	courseCode: string | null;
	name: string | null;
};

function handleErrors(err: any) {
	const error = {};

	if (err.message.includes('violates unique constraint "lecturers_pkey"')) {
		return "An entry with the same course code already exists. Please use a unique value and try again.";
	}

	if (err.message.includes(' violates unique constraint "studentlist_pkey"')) {
		return "An entry with the same index number already exists. Please use a unique value and try again.";
	}

	if (err.message.includes('violates unique constraint "unq_name"')) {
		return "An entry with the same course title already exists. Please use a unique value and try again.";
	}
}

app.get("/std/:courseCode", async (req: Request, res: Response) => {
	const { courseCode } = req.params;
	const splitCode = courseCode.split("-");
	const newCourseCode = splitCode[0].toUpperCase() + "-" + splitCode[1];
	const groupid = splitCode[splitCode.length - 1];

	try {
		const sql = await pool.query(
			`SELECT * FROM STUDENTLIST WHERE COURSECODE = $1 AND GROUPID = $2`,
			[newCourseCode.toUpperCase(), groupid.toUpperCase()]
		);

		res.status(200).json(sql.rows);
	} catch (error) {
		console.log("🚀 ~ app.get ~ error:", error);
	}
});

app.get("/lec/:courseCode", async (req: Request, res: Response) => {
	const { courseCode } = req.params;
	const splitCode = courseCode.split("-");
	const newCourseCode = splitCode[0].toUpperCase() + "-" + splitCode[1];
	const groupid = splitCode[splitCode.length - 1];

	try {
		const sql = await pool.query(
			`SELECT LAT, LONG FROM LECTURERS WHERE COURSECODE = $1 AND GROUPID = $2`,
			[newCourseCode.toUpperCase(), groupid.toUpperCase()]
		);

		res.status(200).json(sql.rows[0]);
	} catch (error) {
		console.log("🚀 ~ app.get ~ error:", error);
	}
});

app.post("/sign-in", async (req: Request, res: Response) => {
	const { fullname, coursecode, coursename, lat, long, time, groupid } = req.body;

	const randomID = uuid();

	await pool.query(`INSERT INTO KEYS VALUES ($1, $2, $3)`, [
		randomID,
		coursecode.toUpperCase(),
		new Date(),
	]);

	const check = await pool.query(
		`SELECT * FROM LECTURERS WHERE FULLNAME = $1 AND COURSENAME = $2 AND GROUPID = $3 AND COURSECODE = $4`,
		[
			fullname.toUpperCase(),
			coursename.toUpperCase(),
			groupid.toUpperCase(),
			coursecode.toUpperCase(),
		]
	);

	if (check.rowCount === 1) {
		res.status(403).json("An entry with the same details exists. Please try again.");
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
			const sql: QueryResult<SignInType> = await pool.query(
				`SELECT * FROM LECTURERS WHERE COURSECODE = $1 `,
				[coursecode]
			);

			res.status(200).json(sql.rows[0]);
		} catch (error) {
			const errors = handleErrors(error);
			console.log(error);
			res.status(403).json(errors);
		}
	}
});

app.post("/save-user", async (req: Request, res: Response) => {
	const { fullname, indexnumber, groupid, coursecode, lat, long, time } = req.body;

	try {
		const validCourseID = await pool.query(
			`SELECT COURSECODE FROM LECTURERS WHERE COURSECODE = $1 AND GROUPID = $2`,
			[coursecode.toUpperCase(), groupid.toUpperCase()]
		);

		if (validCourseID.rowCount === 1) {
			const check = await pool.query(
				`SELECT * FROM STUDENTLIST WHERE FULLNAME = $1 AND INDEXNUMBER = $2 AND GROUPID = $3 AND COURSECODE = $4`,
				[
					fullname.toUpperCase(),
					indexnumber,
					groupid.toUpperCase(),
					coursecode.toUpperCase(),
				]
			);

			if (check.rowCount === 1) {
				res.status(403).json("An entry with the same details exists. Please try again.");
			} else {
				const randomID = uuid();

				await pool.query(
					`INSERT INTO STUDENTLIST VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
					[
						randomID,
						fullname.toUpperCase(),
						coursecode.toUpperCase(),
						lat,
						long,
						time,
						groupid.toUpperCase(),
						indexnumber,
					]
				);

				res.status(200).json({ msg: "Student checked in." });
			}
		} else {
			res.status(403).json(
				"Invalid course code or group id entered. You have either entered a wrong code/ID or it has not been registered by your lecturer."
			);
		}
	} catch (error) {
		const errors = handleErrors(error);
		console.log("🚀 ~ app.post ~ errors:", error);
		res.status(403).json(errors);
	}
});
// fixme: handle errors properly
// todo; Add foreign key to student table. Add id's to both tables

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
	console.log("Listening to PORT ", PORT);
});
