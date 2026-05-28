import { CurrencyCode, TransactionType } from "@/modules/wallet/enums/wallet.enum.js";
import { WalletModel } from "@/modules/wallet/models/wallet.model.js";
import { currencyTransactionService } from "@/modules/wallet/services/currency-transaction.service.js";
import { AdjustBalanceDto } from "@/modules/wallet/types/wallet.type.js";
import { Types } from "mongoose";

export class WalletService {
    async getByPlayerId(playerId: string) {
        return WalletModel.find({ player: playerId }).lean();
    }

    async initPlayerWallets(playerId: string): Promise<void> {
        const player = new Types.ObjectId(playerId);
        const defaults: { code: CurrencyCode; balance: number }[] = [
            { code: CurrencyCode.GOLD, balance: 1000 },
            { code: CurrencyCode.GEM, balance: 0 },
            { code: CurrencyCode.DUST, balance: 0 },
        ];
        await WalletModel.bulkWrite(
            defaults.map(({ code, balance }) => ({
                updateOne: {
                    filter: { player, code },
                    update: {
                        $setOnInsert: { player, code, balance, totalEarned: 0, totalSpent: 0 },
                    } as never,
                    upsert: true,
                },
            }))
        );
    }

    async adjustBalance(dto: AdjustBalanceDto) {
        const { playerId, code, type, amount, source, description } = dto;

        const wallet = await WalletModel.findOne({ player: playerId, code });

        const balanceBefore = wallet.balance;
        let balanceAfter: number;

        if (
            type === TransactionType.EARN ||
            type === TransactionType.REFUND ||
            type === TransactionType.REWARD
        ) {
            balanceAfter = balanceBefore + amount;
            wallet.totalEarned += amount;
        } else if (type === TransactionType.SPEND) {
            if (balanceBefore < amount) throw new Error("Insufficient balance");
            balanceAfter = balanceBefore - amount;
            wallet.totalSpent += amount;
        } else {
            // ADMIN: can be positive or negative
            balanceAfter = balanceBefore + amount;
            if (amount > 0) wallet.totalEarned += amount;
            else wallet.totalSpent += Math.abs(amount);
        }

        wallet.balance = balanceAfter;
        await wallet.save();

        await currencyTransactionService.create({ playerId, code, type, amount, balanceBefore, balanceAfter, source, description });

        return wallet.toObject();
    }


}

export const walletService = new WalletService();
