import { User, UserModel } from "@/modules/auth/models/user.model.js";
import { env } from "@/configs/env.config.js";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export class AuthService {
    async register(email: string, password: string) {
        const exist = await UserModel.findOne({ email }).lean();
        if (exist) {
            return;
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ email, password: hashed });
        return { id: user.id, email: user.email };
    }

    async login(email: string, password: string) {
        const user = await UserModel.findOne({ email }).select("+password").lean();
        if (!user) {
            return;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return;
        }

        const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
            expiresIn: "30d",
        });
        return { token };
    }

    async getProfile(userId: Types.ObjectId) {
        return UserModel.findById(userId).lean();
    }

    verifyToken(token: string) {
        return jwt.verify(token, env.JWT_SECRET) as { userId: Types.ObjectId } & JwtPayload;
    }
}

export const authService = new AuthService();
