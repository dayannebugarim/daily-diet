import fastify from "fastify";
import fastifyJWT from "@fastify/jwt";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "@/config/env.ts";
import { userRoutes } from "@/routes/user/user.routes.ts";
import { authRoutes } from "./routes/auth/auth.routes.ts";
import { mealRoutes } from "./routes/meal/meal.routes.ts";

export const app = fastify({
	logger: true
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifyJWT, {
	secret: env.JWT_SECRET,
});

app.register(authRoutes, { prefix: "/auth" });
app.register(userRoutes, { prefix: "/user" });
app.register(mealRoutes, { prefix: "/meal" });
