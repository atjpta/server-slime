import { UserStatus } from "@/modules/auth/enums/user.enum.js";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.Active },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
