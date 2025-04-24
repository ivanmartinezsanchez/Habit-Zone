import { Request, Response } from "express";
import * as habitModel from "../models/habitModel";

interface AuthRequest extends Request {
  userId?: number;
}

export const createHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ error: "Título requerido" });
    return;
  }

  try {
    const newHabit = await habitModel.createHabit(req.userId!, title);
    res.status(201).json({ habit: newHabit }); 
  } catch (err) {
    res.status(500).json({ error: "Error al crear hábito" });
  }
};

export const getHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const habits = await habitModel.getHabitsByUser(req.userId!);
    res.status(200).json(habits);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener hábitos" });
  }
};

export const updateHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    await habitModel.updateHabit(Number(id), req.userId!, title);
    res.status(200).json({ message: "Hábito actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar hábito" });
  }
};

export const deleteHabit = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await habitModel.deleteHabit(Number(id), req.userId!);
    res.status(200).json({ message: "Hábito eliminado" });
  } catch (err) {
    console.error("❌ Error en deleteHabit controller:", err);
    res.status(500).json({ error: "Error al eliminar hábito" });
  }
};


