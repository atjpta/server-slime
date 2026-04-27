import { z } from "zod";

export const RegisterSchema = z.object({
    email: z.email().default("admin@gmail.com"),
    password: z.string().min(6).max(64).default("123456"),
});

export const LoginSchema = z.object({
    email: z.email().default("admin@gmail.com"),
    password: z.string().min(1).default("123456"),
});
