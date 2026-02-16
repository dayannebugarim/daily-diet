import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app.ts";
import request from "supertest";
import { execSync } from "node:child_process";

describe("User Routes", () => {
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

	it("should be able to create a new user", async () => {
		const userData = {
			name: "John Doe",
			email: "john.doe@example.com",
			password: "password123"
		};

		const createUserResponse = await request(app.server)
			.post("/user")
			.send(userData);

		expect(createUserResponse.statusCode).toEqual(201);
	});

	it("should be able to list all users", async () => {
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

		const { token } = authResponse.body;

		const listUsersResponse = await request(app.server)
			.get("/user")
			.set("Authorization", `Bearer ${token}`);

		expect(listUsersResponse.body).toEqual([
			expect.objectContaining({
				name: userData.name,
				email: userData.email
			})
		]);
		expect(listUsersResponse.statusCode).toEqual(200);
	});
});