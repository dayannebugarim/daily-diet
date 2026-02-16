import type { FastifyInstance } from "fastify";
import { db } from "@/config/database.js";
import { CreateUserDto, CreateUserSchema } from "./dto/create-user.js";
import bcrypt from "bcrypt";
import { isAuthenticated } from "@/middlewares/is-authenticated.js";

export async function userRoutes(app: FastifyInstance) {
	app.addHook("preHandler", async (request, reply) => {
		await isAuthenticated(request, reply);
	});

	app.get("/", async (_, reply) => {
		try {
			const users = await db("user").select("*");
			return reply.send(users);
		} catch (error: unknown) {
			return reply.status(500).send({ error: "Failed to fetch users: " + (error as Error).message });
		}
	});

	app.post("/", { schema: { body: CreateUserSchema } }, async (request, reply) => {
		try {
			const { name, email, password } = request.body as CreateUserDto;

			const passwordHash = await bcrypt.hash(password, 12);
		
			const user = await db("user").insert({
				id: crypto.randomUUID(),
				name: name,
				email: email,
				password: passwordHash
			});

			return reply.status(201).send(user);
		} catch (error: unknown) {
			return reply.status(500).send({ error: "Failed to create user: " + (error as Error).message });
		}
	});
}
