import "@colyseus/tools/loadenv";
import { connectMongoDB, RunSeed } from "@/configs/mongo.config.js";
import { SkillSeed } from "@/modules/skills/seeds/skill.seed.js";
import { PlayerRankProfileSeed } from "@/modules/ranking/seeds/player-rank-profile.seed.js";
import { RankLadderSeed } from "@/modules/ranking/seeds/rank-ladder.seed.js";
import { RankTierConfigSeed } from "@/modules/ranking/seeds/rank-tier-config.seed.js";
import { BattleItemSeed } from "@/modules/item/seeds/battle-item.seed.js";
import { MasterDataSeed } from "@/modules/master-data/seeds/master-data.seed.js";

// import dns from "dns";
// dns.setServers(["1.1.1.1"]);

await connectMongoDB();
await RunSeed([
    SkillSeed,
    RankTierConfigSeed,
    RankLadderSeed,
    PlayerRankProfileSeed,
    BattleItemSeed,
    MasterDataSeed,
]);
process.exit(0);
