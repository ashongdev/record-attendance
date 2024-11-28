import { Router } from "express";
import { getStudentList, registerCourse } from "../controllers/lecturerController";

export const router = Router();

router.get("/lec/:courseCode", getStudentList);

router.post("/register-course", registerCourse);

export default router;
