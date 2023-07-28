import express from "express";
import { Player, Inventory, Weapon, Armor } from "../data/models.js";
import ensureAuthenticated from "../utils/ensureAuthenticated.js";
import Sequelize from "sequelize";

const router = express.Router();
const Op = Sequelize.Op;

// Get the current shop
router.get("/", ensureAuthenticated, async (req, res) => {
  // Combine weapon and armor tables
  const weapons = await Weapon.findAll();
  const armors = await Armor.findAll();
  const items = [...weapons, ...armors];

  // Randomly select 5 items
  const shopItems = [];
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * items.length);
    shopItems.push(items[randomIndex]);
    items.splice(randomIndex, 1); // Remove selected item from the array
  }

  res.json(shopItems);
});

// Buy an item
router.post("/buy", ensureAuthenticated, async (req, res) => {
  const { itemId, itemType } = req.body; // itemType is 'Weapon' or 'Armor'

  const item = await (itemType === "Weapon" ? Weapon : Armor).findOne({
    where: { id: itemId },
  });

  const player = await Player.findOne({ where: { id: req.user.id } });

  if (player.gold < item.purchasePrice) {
    return res.status(400).json({ error: "Not enough gold" });
  }

  player.gold -= item.purchasePrice;
  await player.save();

  await Inventory.create({
    playerId: req.user.id,
    [`${itemType.toLowerCase()}Id`]: itemId,
  });

  res.json({ message: "Item purchased successfully" });
});

// Sell an item
router.post("/sell", ensureAuthenticated, async (req, res) => {
  const { itemId, itemType } = req.body; // itemType is 'Weapon' or 'Armor'

  const item = await (itemType === "Weapon" ? Weapon : Armor).findOne({
    where: { id: itemId },
  });

  const player = await Player.findOne({ where: { id: req.user.id } });

  player.gold += item.purchasePrice;
  await player.save();

  await Inventory.destroy({
    where: { playerId: req.user.id, [`${itemType.toLowerCase()}Id`]: itemId },
  });

  res.json({ message: "Item sold successfully" });
});

export default router;
