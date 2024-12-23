import { Router } from "express";
import {
	authenticate,
	getDetails,
	getStudents,
	getStudentsHistory,
	registerCourse,
	updateLastChecked,
} from "../controllers/lecturerController";

export const router = Router();

router.get("/lec/auth/:key", authenticate);

router.post("/lec/get-students", getStudents);

router.get("/lec/get-history/:studentId", getStudentsHistory);

router.post("/lec/last-checked", updateLastChecked);

router.post("/lec/get-details", getDetails);

router.post("/register-course", registerCourse);

export default router;
