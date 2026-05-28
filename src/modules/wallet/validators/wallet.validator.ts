import { CurrencyCode, TransactionSource, TransactionType } from "@/modules/wallet/enums/wallet.enum.js";
import { z } from "zod";

export const AdjustBalanceSchema = z.object({
    code: z.enum(Object.values(CurrencyCode) as [string, ...string[]]),
    type: z.enum(Object.values(TransactionType) as [string, ...string[]]),
    amount: z.number().positive(),
    source: z.enum(Object.values(TransactionSource) as [string, ...string[]]),
    description: z.string().optional(),
});

export const GetTransactionsSchema = z.object({
    code: z.enum(Object.values(CurrencyCode) as [string, ...string[]]).optional(),
    limit: z.coerce.number().int().positive().max(100).default(50),
});
