import { app } from "@/app.ts";
import { env } from "./config/env.ts";

/**
 * Run the server!
 */
app.listen({ port: env.PORT }).then(() => {
	console.log(`HTTP server running on http://localhost:${env.PORT}`);
});