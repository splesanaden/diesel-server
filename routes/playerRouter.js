import express from "express";
import bcrypt from "bcrypt";
import { Player } from "../data/models.js";
import jwt from "jsonwebtoken";
import ensureAuthenticated from "../utils/ensureAuthenticated.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Register a new player
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  const existingPlayer = await Player.findOne({ where: { name } });
  if (existingPlayer) {
    return res.status(400).json({ error: "Player already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newPlayer = await Player.create({
    name: name,
    password: hashedPassword,
  });
  const token = jwt.sign({ id: newPlayer.id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  res.status(201).json({
    message: "Player created successfully",
    player: {
      token: token,
      id: newPlayer.id,
      name: newPlayer.name,
      cash: newPlayer.cash,
      diamonds: newPlayer.diamonds,
    },
  });
});

// Player login
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const player = await Player.findOne({ where: { name } });
  if (!player) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const validPassword = await bcrypt.compare(password, player.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid username or password" });
  }
  //update date_last_played
  player.date_last_played = Date.now();
  await player.save();

  const token = jwt.sign({ id: player.id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  res.json({
    message: "Logged in successfully",
    player: {
      token: token,
      id: player.id,
      name: player.name,
      cash: player.cash,
      diamonds: player.diamonds,
    },
  });
});

// log out
router.post("/logout", ensureAuthenticated, async (req, res) => {
  res.json({ message: "Logged out successfully", player: null });
});

router.put("/update", ensureAuthenticated, async (req, res) => {
  const { name, password } = req.body;

  if (!name && !password) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const player = await Player.findByPk(req.userId);
  if (!player) {
    return res.status(404).json({ error: "Player not found" });
  }

  if (name) {
    player.name = name;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    player.password = hashedPassword;
  }

  await player.save();

  res.json({ message: "Player updated successfully" });
});

export default router;
