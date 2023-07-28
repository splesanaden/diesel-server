import express from "express";
import ensureAuthenticated from "../utils/ensureAuthenticated.js";

const router = express.Router();
// import * as model from "../data/models.js";
// console.log(model);
import {
  Weapon,
  Armor,
  Inventory,
  Mech,
  Hangar,
  Squadron,
  Player,
} from "../data/models.js";

// Equip items on mech
router.post("/inventory/equip", ensureAuthenticated, async (req, res) => {
  const { mechId, slot, itemId, type } = req.body; // type is 'Weapon' or 'Armor'

  const mech = await Mech.findOne({ where: { id: mechId } });

  // If the slot is already occupied
  if (mech["slot" + slot]) {
    // Create an inventory item for the currently equipped item
    const inventoryItem = {
      playerId: req.user.id,
    };
    inventoryItem[`${type.toLowerCase()}Id`] = mech["slot" + slot];

    await Inventory.create(inventoryItem);
  }

  // Equip the new item
  mech["slot" + slot] = itemId;
  await mech.save();

  // Remove the new item from inventory
  await Inventory.destroy({
    where: { playerId: req.user.id, [`${type.toLowerCase()}Id`]: itemId },
  });

  res.json({ message: "Item equipped" });
});

// Move mechs to and from hangar/squadron
router.post("/hangar/move-mech", ensureAuthenticated, async (req, res) => {
  const { mechId, location } = req.body; // location is 'Hangar' or 'Squadron'

  const fromModel = location === "Hangar" ? Squadron : Hangar;
  const toModel = location === "Hangar" ? Hangar : Squadron;

  await fromModel.destroy({ where: { playerId: req.user.id, mechId } });
  await toModel.create({ playerId: req.user.id, mechId });

  res.json({ message: `Mech moved to ${location}` });
});

export default router;
