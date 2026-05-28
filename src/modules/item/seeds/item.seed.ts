import { EquipmentSlot, ItemCode, ItemRarity, ItemType } from "@/modules/item/enums/item.enum.js";
import { ItemModel } from "@/modules/item/models/item.model.js";

const items = [
    // ── WEAPON ATTACK ───────────────────────────────────────────────────
    {
        code: ItemCode.SWORD_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 100,
        metadata: { slot: EquipmentSlot.ATTACK, baseStats: { attack: 10 } },
    },
    {
        code: ItemCode.SWORD_002,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 500,
        metadata: { slot: EquipmentSlot.ATTACK, baseStats: { attack: 15 } },
    },
    {
        code: ItemCode.HERO_BLADE_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 2000,
        metadata: { slot: EquipmentSlot.ATTACK, baseStats: { attack: 20 } },
    },
    {
        code: ItemCode.DIVINE_SWORD_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 10000,
        metadata: { slot: EquipmentSlot.ATTACK, baseStats: { attack: 25 } },
    },

    // ── WEAPON MAGIC ────────────────────────────────────────────────────
    {
        code: ItemCode.MAGIC_STAFF_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 100,
        metadata: { slot: EquipmentSlot.MAGIC, baseStats: { magic: 10 } },
    },
    {
        code: ItemCode.MAGIC_STAFF_002,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 500,
        metadata: { slot: EquipmentSlot.MAGIC, baseStats: { magic: 15 } },
    },
    {
        code: ItemCode.ARCANE_STAFF_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 2000,
        metadata: { slot: EquipmentSlot.MAGIC, baseStats: { magic: 20 } },
    },
    {
        code: ItemCode.DIVINE_STAFF_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 10000,
        metadata: { slot: EquipmentSlot.MAGIC, baseStats: { magic: 25 } },
    },

    // ── WEAPON SHIELD ───────────────────────────────────────────────────
    {
        code: ItemCode.WOODEN_SHIELD_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 100,
        metadata: { slot: EquipmentSlot.SHIELD, baseStats: { hp: 100, defense: 1 } },
    },
    {
        code: ItemCode.IRON_SHIELD_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 500,
        metadata: { slot: EquipmentSlot.SHIELD, baseStats: { hp: 150, defense: 2 } },
    },
    {
        code: ItemCode.GUARDIAN_SHIELD_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 2000,
        metadata: { slot: EquipmentSlot.SHIELD, baseStats: { hp: 200, defense: 3 } },
    },
    {
        code: ItemCode.DIVINE_SHIELD_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 10000,
        metadata: { slot: EquipmentSlot.SHIELD, baseStats: { hp: 250, defense: 4 } },
    },

    // ── HELMET ──────────────────────────────────────────────────────────
    {
        code: ItemCode.IRON_HELMET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 80,
        metadata: { slot: EquipmentSlot.HELMET, baseStats: { hp: 100, defense: 1 } },
    },
    {
        code: ItemCode.MAGE_HAT_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 400,
        metadata: { slot: EquipmentSlot.HELMET, baseStats: { hp: 150, defense: 2 } },
    },
    {
        code: ItemCode.GUARDIAN_HELM_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 1800,
        metadata: { slot: EquipmentSlot.HELMET, baseStats: { hp: 200, defense: 3 } },
    },
    {
        code: ItemCode.DIVINE_CROWN_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 9000,
        metadata: {
            slot: EquipmentSlot.HELMET,
            baseStats: { hp: 250, defense: 4 },
        },
    },

    // ── ARMOR ───────────────────────────────────────────────────────────
    {
        code: ItemCode.LEATHER_ARMOR_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 120,
        metadata: { slot: EquipmentSlot.ARMOR, baseStats: { hp: 100, defense: 1 } },
    },
    {
        code: ItemCode.PLATE_ARMOR_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 600,
        metadata: { slot: EquipmentSlot.ARMOR, baseStats: { hp: 150, defense: 2 } },
    },
    {
        code: ItemCode.GUARDIAN_ARMOR_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 2500,
        metadata: { slot: EquipmentSlot.ARMOR, baseStats: { hp: 200, defense: 3 } },
    },
    {
        code: ItemCode.DIVINE_ROBE_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 12000,
        metadata: {
            slot: EquipmentSlot.ARMOR,
            baseStats: { hp: 250, defense: 4 },
        },
    },

    // ── BOOTS ───────────────────────────────────────────────────────────
    {
        code: ItemCode.LEATHER_BOOTS_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 80,
        metadata: { slot: EquipmentSlot.BOOTS, baseStats: { hp: 100, defense: 1 } },
    },
    {
        code: ItemCode.SWIFT_BOOTS_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 400,
        metadata: {
            slot: EquipmentSlot.BOOTS,
            baseStats: { attack: 15, magic: 15, hp: 100, defense: 20 },
        },
    },
    {
        code: ItemCode.GUARDIAN_BOOTS_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 1800,
        metadata: {
            slot: EquipmentSlot.BOOTS,
            baseStats: { attack: 30, magic: 30, hp: 200, defense: 40 },
        },
    },
    {
        code: ItemCode.DIVINE_BOOTS_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 8000,
        metadata: {
            slot: EquipmentSlot.BOOTS,
            baseStats: { attack: 60, magic: 60, hp: 400, defense: 80 },
        },
    },

    // ── GLOVE ───────────────────────────────────────────────────────────
    {
        code: ItemCode.LEATHER_GLOVE_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 70,
        metadata: { slot: EquipmentSlot.GLOVE, baseStats: { attack: 8, hp: 30, defense: 8 } },
    },
    {
        code: ItemCode.BATTLE_GLOVE_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 380,
        metadata: {
            slot: EquipmentSlot.GLOVE,
            baseStats: { attack: 25, magic: 10, hp: 80, defense: 18 },
        },
    },
    {
        code: ItemCode.GUARDIAN_GLOVE_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 1600,
        metadata: {
            slot: EquipmentSlot.GLOVE,
            baseStats: { attack: 50, magic: 20, hp: 180, defense: 35 },
        },
    },
    {
        code: ItemCode.DIVINE_GLOVE_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 7500,
        metadata: {
            slot: EquipmentSlot.GLOVE,
            baseStats: { attack: 100, magic: 50, hp: 350, defense: 70 },
        },
    },

    // ── RING ────────────────────────────────────────────────────────────
    {
        code: ItemCode.IRON_RING_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 60,
        metadata: { slot: EquipmentSlot.RING, baseStats: { attack: 10, defense: 5 } },
    },
    {
        code: ItemCode.POWER_RING_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 350,
        metadata: { slot: EquipmentSlot.RING, baseStats: { attack: 30, magic: 10, defense: 10 } },
    },
    {
        code: ItemCode.ARCANE_RING_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 1500,
        metadata: {
            slot: EquipmentSlot.RING,
            baseStats: { attack: 20, magic: 80, hp: 50, defense: 20 },
        },
    },
    {
        code: ItemCode.DIVINE_RING_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 7000,
        metadata: {
            slot: EquipmentSlot.RING,
            baseStats: { attack: 100, magic: 150, hp: 200, defense: 50 },
        },
    },

    // ── AMULET ──────────────────────────────────────────────────────────
    {
        code: ItemCode.BONE_AMULET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 60,
        metadata: { slot: EquipmentSlot.AMULET, baseStats: { magic: 10, hp: 30, defense: 5 } },
    },
    {
        code: ItemCode.MAGIC_AMULET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 350,
        metadata: {
            slot: EquipmentSlot.AMULET,
            baseStats: { attack: 10, magic: 40, hp: 80, defense: 10 },
        },
    },
    {
        code: ItemCode.GUARDIAN_AMULET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 1500,
        metadata: {
            slot: EquipmentSlot.AMULET,
            baseStats: { attack: 20, magic: 80, hp: 150, defense: 30 },
        },
    },
    {
        code: ItemCode.DIVINE_AMULET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 7000,
        metadata: {
            slot: EquipmentSlot.AMULET,
            baseStats: { attack: 80, magic: 180, hp: 300, defense: 60 },
        },
    },

    // ── EARRING ─────────────────────────────────────────────────────────
    {
        code: ItemCode.BONE_EARRING_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 60,
        metadata: { slot: EquipmentSlot.EARRING, baseStats: { magic: 8, hp: 20 } },
    },
    {
        code: ItemCode.SILVER_EARRING_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 350,
        metadata: { slot: EquipmentSlot.EARRING, baseStats: { magic: 25, hp: 60, defense: 8 } },
    },
    {
        code: ItemCode.ARCANE_EARRING_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 1500,
        metadata: { slot: EquipmentSlot.EARRING, baseStats: { attack: 15, magic: 60, hp: 120 } },
    },
    {
        code: ItemCode.DIVINE_EARRING_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 7000,
        metadata: { slot: EquipmentSlot.EARRING, baseStats: { attack: 50, magic: 150, hp: 250, defense: 40 } },
    },

    // ── BRACELET ─────────────────────────────────────────────────────────
    {
        code: ItemCode.IRON_BRACELET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.COMMON,
        stackable: false,
        sellPrice: 60,
        metadata: { slot: EquipmentSlot.BRACELET, baseStats: { attack: 8, defense: 5 } },
    },
    {
        code: ItemCode.POWER_BRACELET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.RARE,
        stackable: false,
        sellPrice: 350,
        metadata: { slot: EquipmentSlot.BRACELET, baseStats: { attack: 25, magic: 10, defense: 15 } },
    },
    {
        code: ItemCode.GUARDIAN_BRACELET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.EPIC,
        stackable: false,
        sellPrice: 1500,
        metadata: { slot: EquipmentSlot.BRACELET, baseStats: { attack: 50, magic: 30, hp: 100, defense: 30 } },
    },
    {
        code: ItemCode.DIVINE_BRACELET_001,
        type: ItemType.EQUIPMENT,
        rarity: ItemRarity.LEGENDARY,
        stackable: false,
        sellPrice: 7000,
        metadata: { slot: EquipmentSlot.BRACELET, baseStats: { attack: 120, magic: 80, hp: 200, defense: 60 } },
    },

    // ── MATERIAL ────────────────────────────────────────────────────────
    {
        code: ItemCode.IRON_ORE_001,
        type: ItemType.MATERIAL,
        rarity: ItemRarity.COMMON,
        stackable: true,
        sellPrice: 10,
        metadata: {},
    },
    {
        code: ItemCode.MAGIC_CRYSTAL_001,
        type: ItemType.MATERIAL,
        rarity: ItemRarity.RARE,
        stackable: true,
        sellPrice: 80,
        metadata: {},
    },
    {
        code: ItemCode.DRAGON_SCALE_001,
        type: ItemType.MATERIAL,
        rarity: ItemRarity.EPIC,
        stackable: true,
        sellPrice: 500,
        metadata: {},
    },
];

export const ItemSeed = async () => {
    await ItemModel.bulkWrite(
        items.map((item) => ({
            updateOne: {
                filter: { code: item.code },
                update: { $set: item },
                upsert: true,
            },
        }))
    );
};
