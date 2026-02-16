import type { FastifyInstance } from "fastify";
import { db } from "@/config/database.ts";
import { CreateUserDto, CreateUserSchema } from "./dto/create-user.ts";
import bcrypt from "bcrypt";
import { isAuthenticated } from "@/middlewares/is-authenticated.ts";

export async function userRoutes(app: FastifyInstance) {
	app.get("/", { preHandler: [isAuthenticated] }, async (_, reply) => {
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
