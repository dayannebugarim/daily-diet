import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app.ts";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Auth Routes", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(async () => {
		execSync("npm run knex migrate:rollback --all");
		execSync("npm run knex migrate:latest");
	});

	it("should be able to authenticate a user", async () => {
		const userData = {
			name: "John Doe",
			email: "john.doe@example.com",
			password: "password123"
		};

		await request(app.server)
			.post("/user")
			.send(userData);

		const authResponse = await request(app.server)
			.post("/auth")
			.send(userData);

		expect(authResponse.body).toEqual(expect.objectContaining({
			token: expect.any(String)
		}));
	});
});