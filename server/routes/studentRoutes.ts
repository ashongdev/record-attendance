import { Router } from "express";
import { checkIn } from "../controllers/studentController";

export const router = Router();

router.post("/check-in", checkIn);

export default router;
