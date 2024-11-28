import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { pool } from "./db";
import { CorsCallback } from "./exports/exports";
import lecturerRoutes from "./routes/lecturerRoutes";
import studentRoutes from "./routes/studentRoutes";
config();

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://record-attendance.vercel.app"];

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

app.use(lecturerRoutes);
app.use(studentRoutes);

const PORT = process.env.PORT || 4002;

pool.connect()
	.then((client) => {
		app.listen(PORT, () => {
			console.log("Connected to the database successfully and Listening to PORT ", PORT);
		});

		client.release();
	})
	.catch((err) => {
		console.error("Error connecting to the database:", err);
	});
