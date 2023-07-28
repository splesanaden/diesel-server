import express from "express";
import { Player, Mech, Squadron } from "../data/models.js";
import ensureAuthenticated from "../utils/ensureAuthenticated.js";

const router = express.Router();

// Get the current squadron
router.get("/", ensureAuthenticated, async (req, res) => {
  const squadron = await Squadron.findAll({ where: { playerId: req.user.id } });

  res.json(squadron);
});

// Add a mech to the squadron
router.post("/add", ensureAuthenticated, async (req, res) => {
  const { mechId } = req.body;

  const currentSquadron = await Squadron.findAll({
    where: { playerId: req.user.id },
  });

  if (currentSquadron.length >= 3) {
    return res.status(400).json({ error: "Squadron is already full" });
  }

  await Squadron.create({ playerId: req.user.id, mechId: mechId });

  res.json({ message: "Mech added to squadron" });
});

export default router;
