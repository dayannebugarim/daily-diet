import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	JWT_SECRET: z.string().nonempty(),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().nonempty()
}); 

export const env = envSchema.parse(process.env);