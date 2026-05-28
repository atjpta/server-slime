import { PlayerModel } from "@/modules/player/models/player.model.js";
import { walletService } from "@/modules/wallet/services/wallet.service.js";

export const WalletSeed = async () => {
    const players = await PlayerModel.find({}, { _id: 1 }).lean();
    if (!players.length) return;
    await Promise.all(players.map((p) => walletService.initPlayerWallets(p._id.toString())));
};
