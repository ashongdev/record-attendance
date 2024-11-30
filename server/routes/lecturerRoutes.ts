import { Router } from "express";
import {
	getDetails,
	getLecturersLocation,
	getStudentList,
	registerCourse,
} from "../controllers/lecturerController";

export const router = Router();

router.get("/lec/:courseCode", getStudentList);

router.get("/lec/location/:id", getLecturersLocation);

router.post("/lec/get-details", getDetails);

router.post("/register-course", registerCourse);

export default router;
