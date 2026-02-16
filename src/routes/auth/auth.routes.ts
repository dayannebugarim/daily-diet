import { FastifyInstance } from "fastify";
import { LoginDto, LoginSchema } from "./dto/login.js";
import { db } from "@/config/database.js";
import bcrypt from "bcrypt";

export async function authRoutes(app: FastifyInstance) {
	app.post("/", { schema: { body: LoginSchema } }, async (request, reply) => {
		try {
			const { email, password } = request.body as LoginDto;
			const user = await db("user").where({ email }).first();
            
			if (!user) {
				return reply.status(401).send({ error: "Invalid email or password." });
			}

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return reply.status(401).send({ error: "Invalid email or password." });
			}

			const token = app.jwt.sign({ 
				userId: user.id, 
				name: user.name, 
				email: user.email 
			});
			return reply.send({ token });
		} catch (error: unknown) {
			return reply.status(500).send({ error: "Failed to login: " + (error as Error).message });
		}
	});
}