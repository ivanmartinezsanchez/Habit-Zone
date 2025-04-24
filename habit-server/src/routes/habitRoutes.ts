import express from "express";
import * as habitController from "../controllers/habitController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.use(verifyToken); // todas las rutas requieren token

router.post("/", habitController.createHabit);
router.get("/", habitController.getHabits);
router.put("/:id", habitController.updateHabit);
router.delete("/:id", habitController.deleteHabit);

export default router;

