
import "fastify";
import "@fastify/jwt";

declare module "@fastify/jwt" {
	interface FastifyJWT {
		user: {
			userId: string;
			name: string;
			email: string;
		};
	}
}
