import mongoose from "mongoose";
import { env } from "@/configs/env.config.js";

export async function connectMongoDB() {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log(`[MongoDB] Connected: ${env.MONGO_URI}`);
    } catch (err) {
        console.error("[MongoDB] Connection failed:", err);
        process.exit(1);
    }
}
