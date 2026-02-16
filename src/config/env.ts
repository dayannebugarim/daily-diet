import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
	config({ path: ".env.test" });
} else {
	config();
}

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().nonempty(),
	JWT_SECRET: z.string().nonempty(),
}); 

export const env = envSchema.parse(process.env);