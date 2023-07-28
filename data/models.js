import { Sequelize, DataTypes, Model } from "sequelize";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Initialize a connection instance
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  // logging: false,
});

// Define the Company model
class Company extends Model {}

Company.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ideology: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Company",
  }
);

// Define the Weapon model
class Weapon extends Model {}

Weapon.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    criticalHit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Companies", // 'companies' refers to table name
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Weapon",
  }
);

// Define the Armor model
class Armor extends Model {}

Armor.init(
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    evasion: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    criticalHit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Companies", // 'companies' refers to table name
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Armor",
  }
);

// Define Inventory model
// Define the Inventory model
class Inventory extends Model {}

Inventory.init(
  {
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weaponId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    armorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Inventory",
  }
);

// Define the Mech model
class Mech extends Model {}

Mech.init(
  {
    attack: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    criticalHit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    accuracy: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1,
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    evasion: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 1.05,
    },
    health: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    equipment: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
  },
  {
    sequelize,
    modelName: "Mech",
  }
);

// Define the Hangar model
class Hangar extends Model {}

Hangar.init(
  {
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mechId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Hangar",
  }
);

// Define the Squadron model
class Squadron extends Model {}

Squadron.init(
  {
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mechId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Squadron",
  }
);

// Define the Player model
class Player extends Model {}

Player.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cash: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1000,
    },
    date_created: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    date_last_played: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize,
    modelName: "Player",
  }
);

async function init() {
  // Create the tables in the database

  let companies = JSON.parse(fs.readFileSync("data/Companies.json"));

  companies = companies.map((company) => {
    return {
      id: uuidv4(),
      name: company.name,
      specialization: company.specialization,
      origin: company.origin,
      ideology: company.ideology,
      weapons: company.weapons,
      armor: company.armor,
    };
  });
  // Get all weapons and armor
  let companies_reduced = companies.map((company) => {
    return {
      id: company.id,
      name: company.name,
      specialization: company.specialization,
      origin: company.origin,
      ideology: company.ideology,
    };
  });

  const weapons = companies
    .map((company) => {
      return company.weapons.map((weapon) => {
        return {
          name: weapon.name,
          attack: weapon.attack,
          criticalHit: weapon.criticalHit,
          accuracy: weapon.accuracy,
          price: weapon.price,
          companyId: company.id,
        };
      });
    })
    .flat();
  const armor = companies
    .map((company) => {
      return company.armor.map((armor) => {
        return {
          name: armor.name,
          attack: armor.attack,
          defense: armor.defense,
          evasion: armor.evasion,
          criticalHit: armor.criticalHit,
          accuracy: armor.accuracy,
          price: armor.price,
          companyId: company.id,
        };
      });
    })
    .flat();

  try {
    await sequelize.sync({ force: true });

    await Company.bulkCreate(companies_reduced);
    await Weapon.bulkCreate(weapons);
    await Armor.bulkCreate(armor);
  } catch (error) {
    console.log(error);
  }
}
// sequelize.sync({ alter: true });
init();

export { Company, Weapon, Armor, Inventory, Mech, Hangar, Squadron, Player };
