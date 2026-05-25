import { MasterDataKey } from "@/modules/master-data/enums/master-data.enum.js";
import { z } from "zod";

export const MasterDataKeySchema = z.object({
    key: z.enum(Object.values(MasterDataKey) as [string, ...string[]]),
});

const BattleConfigValueSchema = z.object({
    maxWave: z.number().int().positive(),
    turnsPerWave: z.number().int().positive(),
    maxItemSlots: z.number().int().positive(),
    selectItemOfferCount: z.number().int().positive(),
    selectionTimeMs: z.number().int().positive(),
    selectionTimeOutMs: z.number().int().positive(),
    selectionItemTimeMs: z.number().int().positive(),
    selectionItemTimeOutMs: z.number().int().positive(),
    waveAnimationMs: z.number().int().positive(),
    executingDoneTimeoutMs: z.number().int().positive(),
    endedDelayMs: z.number().int().positive(),
    botWaitS: z.number().int().positive(),
    reconnectionS: z.number().int().positive(),
});

const MasterDataValueSchema = BattleConfigValueSchema;

export const CreateMasterDataSchema = z.object({
    key: z.enum(Object.values(MasterDataKey) as [string, ...string[]]),
    value: MasterDataValueSchema,
    note: z.string().optional(),
});

export const UpdateMasterDataSchema = z.object({
    value: MasterDataValueSchema,
    note: z.string().optional(),
});
