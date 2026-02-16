import { FastifyReply, FastifyRequest } from "fastify";

export const isAuthenticated = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		await request.jwtVerify();
		// eslint-disable-next-line
	} catch (err) {
		reply.status(401).send({
			error: "Unauthorized",
		});
	}
};
