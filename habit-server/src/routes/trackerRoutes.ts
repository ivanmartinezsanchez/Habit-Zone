import express from "express";
import * as trackerController from "../controllers/trackerController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.use(verifyToken);

router.post("/", trackerController.markHabit);
router.get("/habit/:habitId", trackerController.getByHabit);
router.get("/date/:date", trackerController.getByDate);

export default router;
