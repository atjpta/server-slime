import { CurrencyCode, TransactionSource, TransactionType } from "@/modules/wallet/enums/wallet.enum.js";
import { Player } from "@/modules/player/models/player.model.js";
import mongoose, { Document, Schema } from "mongoose";

export interface ICurrencyTransaction extends Document {
    player: Player;
    code: CurrencyCode;
    type: TransactionType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    source: TransactionSource;
    description?: string;
    createdAt: Date;
}

const CurrencyTransactionSchema = new Schema<ICurrencyTransaction>(
    {
        player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
        code: { type: String, required: true, enum: Object.values(CurrencyCode) },
        type: { type: String, required: true, enum: Object.values(TransactionType) },
        amount: { type: Number, required: true },
        balanceBefore: { type: Number, required: true },
        balanceAfter: { type: Number, required: true },
        source: { type: String, required: true, enum: Object.values(TransactionSource) },
        description: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

CurrencyTransactionSchema.index({ player: 1, code: 1 });
CurrencyTransactionSchema.index({ createdAt: -1 });

export const CurrencyTransactionModel = mongoose.model<ICurrencyTransaction>(
    "CurrencyTransaction",
    CurrencyTransactionSchema,
    "currency_transactions"
);
