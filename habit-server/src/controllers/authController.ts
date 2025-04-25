import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByUsername, createUser } from "../models/userModel";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const existing = await findUserByUsername(username);
    if (existing) {
      res.status(400).json({ error: "🚫 Usuario ya existe" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await createUser(username, hashed);

    res.status(201).json({ message: "✅ Usuario registrado correctamente" });
  } catch (err) {
    console.error('❌ Error en register:', err); 
    res.status(500).json({ error: "❌ Error en el servidor" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      res.status(404).json({ error: "❗Usuario no encontrado" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "❌ Credenciales incorrectas" });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error('❌ Error en login:', err); // 👈 AÑADE ESTA LÍNEA
    res.status(500).json({ error: "❌ Error al iniciar sesión" });
  }
};
