import fastify from "fastify";
import fastifyJWT from "@fastify/jwt";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { env } from "@/config/env.js";
import { userRoutes } from "@/routes/user/user.routes.js";
import { authRoutes } from "./routes/auth/auth.routes.js";

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
