import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    NEXT_PUBLIC_API_URL: z.string().url(),
    MONGODB_URI: z.string().min(16, "MONGODB_URI is required"),
    MONGODB_DB: z.string().min(5, "MONGODB_DB is required"),
    OPENAI_API_KEY: z.string().min(10, "OPENAI_API_KEY is required"),
    GOOGLE_CLIENT_ID: z.string().min(10, "GOOGLE_CLIENT_ID is required"),
    GOOGLE_CLIENT_SECRET: z.string().min(10, "GOOGLE_CLIENT_SECRET is required"),
    CLERK_SECRET_KEY: z.string().min(10, "CLERK_SECRET_KEY is required"),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(10, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("❌ Invalid environment variables!", parsedEnv.error.format());
    throw new Error("❌ Missing or invalid environment variables. Check your .env file.");
}

export const env = parsedEnv.data;