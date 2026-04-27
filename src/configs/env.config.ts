const required = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required env variable: ${key}`);
    return value;
};

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 2567),
    MONGO_URI: required("MONGO_URI"),
    JWT_SECRET: process.env.JWT_SECRET ?? "changeme",
    SESSION_SECRET: process.env.SESSION_SECRET ?? "changeme",
} as const;
