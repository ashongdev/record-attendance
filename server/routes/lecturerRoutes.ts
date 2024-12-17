import { Router } from "express";
import {
	getDetails,
	getStudents,
	registerCourse,
	updateLastChecked,
} from "../controllers/lecturerController";

export const router = Router();

router.post("/lec/get-students", getStudents);

router.post("/lec/last-checked", updateLastChecked);

router.post("/lec/get-details", getDetails);

router.post("/register-course", registerCourse);

export default router;
