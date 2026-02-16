import { app } from "@/app.js";
import { env } from "./config/env.js";

/**
 * Run the server!
 */
app.listen({ port: env.PORT }).then(() => {
	console.log(`HTTP server running on http://localhost:${env.PORT}`);
});