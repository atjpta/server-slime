import "@colyseus/tools/loadenv";
import { connectMongoDB, RunSeed } from "@/configs/mongo.config.js";
import { SkillSeed } from "@/modules/skills/seeds/skill.seed.js";

await connectMongoDB();
await RunSeed([SkillSeed]);
process.exit(0);
