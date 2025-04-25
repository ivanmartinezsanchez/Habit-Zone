import { Request, Response } from "express";
import * as trackerModel from "../models/trackerModel";

interface AuthRequest extends Request {
  userId?: number;
}

export const markHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  const { habitId, date } = req.body;

  const finalDate = date || new Date().toISOString().split("T")[0];

  try {
    await trackerModel.markHabit(habitId, finalDate);
    res.status(200).json({ message: "✅ Hábito marcado como completado" });
  } catch (err) {
    res.status(500).json({ error: "❌ Error al registrar el hábito" });
  }
};

export const getByHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  const { habitId } = req.params;

  try {
    const data = await trackerModel.getTrackingByHabit(Number(habitId));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ Error al obtener historial del hábito" });
  }
};

export const getByDate = async (req: AuthRequest, res: Response): Promise<void> => {
  const { date } = req.params;

  try {
    const data = await trackerModel.getTrackingByDate(req.userId!, date);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "❌ Error al obtener hábitos del día" });
  }
};
