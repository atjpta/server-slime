import { CurrencyCode, TransactionSource, TransactionType } from "@/modules/wallet/enums/wallet.enum.js";
import { CurrencyTransactionModel } from "@/modules/wallet/models/currency-transaction.model.js";
import { Types } from "mongoose";

export interface CreateTransactionDto {
    playerId: string;
    code: CurrencyCode;
    type: TransactionType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    source: TransactionSource;
    description?: string;
}

export class CurrencyTransactionService {
    async create(dto: CreateTransactionDto) {
        return CurrencyTransactionModel.create({
            player: new Types.ObjectId(dto.playerId),
            code: dto.code,
            type: dto.type,
            amount: dto.amount,
            balanceBefore: dto.balanceBefore,
            balanceAfter: dto.balanceAfter,
            source: dto.source,
            description: dto.description,
        });
    }

    async getByPlayerId(playerId: string, code?: CurrencyCode, limit = 50) {
        const filter: Record<string, unknown> = { player: playerId };
        if (code) filter.code = code;
        return CurrencyTransactionModel.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    }
}

export const currencyTransactionService = new CurrencyTransactionService();
