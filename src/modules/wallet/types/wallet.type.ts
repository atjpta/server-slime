import { CurrencyCode, TransactionSource, TransactionType } from "@/modules/wallet/enums/wallet.enum.js";

export interface AdjustBalanceDto {
    playerId: string;
    code: CurrencyCode;
    type: TransactionType;
    amount: number;
    source: TransactionSource;
    description?: string;
}
