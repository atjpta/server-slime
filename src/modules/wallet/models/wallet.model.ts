import { CurrencyCode } from "@/modules/wallet/enums/wallet.enum.js";
import { Player } from "@/modules/player/models/player.model.js";
import mongoose, { Document, Schema } from "mongoose";

export interface IWallet extends Document {
    player: Player;
    code: CurrencyCode;
    balance: number;
    totalEarned: number;
    totalSpent: number;
    updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>(
    {
        player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
        code: { type: String, required: true, enum: Object.values(CurrencyCode) },
        balance: { type: Number, required: true, default: 0, min: 0 },
        totalEarned: { type: Number, required: true, default: 0 },
        totalSpent: { type: Number, required: true, default: 0 },
    },
    { timestamps: { createdAt: false, updatedAt: true } }
);

WalletSchema.index({ player: 1, code: 1 }, { unique: true });

export const WalletModel = mongoose.model<IWallet>("Wallet", WalletSchema, "wallets");
