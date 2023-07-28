import express from "express";
import { Player, Mech, Squadron, Hangar } from "../data/models.js";
import ensureAuthenticated from "../utils/ensureAuthenticated.js";

const router = express.Router();

// Get the current hangar
router.get("/", ensureAuthenticated, async (req, res) => {
  const hangar = await Hangar.findAll({ where: { playerId: req.user.id } });

  res.json(hangar);
});

// Add a mech to the hangar
router.post("/add", ensureAuthenticated, async (req, res) => {
  const { mechId } = req.body;

  const squadron = await Squadron.findOne({ where: { mechId: mechId } });

  if (!squadron) {
    return res.status(400).json({ error: "Mech not found in squadron" });
  }

  await Hangar.create({ playerId: req.user.id, mechId: mechId });
  await Squadron.destroy({ where: { mechId: mechId } });

  res.json({ message: "Mech moved to hangar" });
});

// Remove a mech from the hangar
router.post("/remove", ensureAuthenticated, async (req, res) => {
  const { mechId } = req.body;

  const hangar = await Hangar.findOne({ where: { mechId: mechId } });

  if (!hangar) {
    return res.status(400).json({ error: "Mech not found in hangar" });
  }

  await Squadron.create({ playerId: req.user.id, mechId: mechId });
  await Hangar.destroy({ where: { mechId: mechId } });

  res.json({ message: "Mech moved to squadron" });
});

export default router;
