import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app.ts";
import request from "supertest";
import { execSync } from "node:child_process";

const userData = {
	name: "John Doe",
	email: "john.doe@example.com",
	password: "password123"
};

const mealsData = [
	{
		name: "Grilled Chicken Salad",
		description: "A healthy salad with grilled chicken, mixed greens, and vinaigrette dressing.",
		date: new Date().toISOString(),
		isOnDiet: true
	},
	{
		name: "Cheeseburger",
		description: "A juicy cheeseburger with lettuce, tomato, and cheese.",
		date: new Date().toISOString(),
		isOnDiet: false
	},
	{
		name: "Steamed Vegetables",
		description: "A mix of steamed broccoli, carrots, and cauliflower.",
		date: new Date().toISOString(),
		isOnDiet: true
	},
];

describe("Meal Routes", () => {
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

	it("should be able to create a new meal", async () => {
		await request(app.server)
			.post("/user")
			.send(userData);
            
		const authResponse = await request(app.server)
			.post("/auth")
			.send(userData);

		const { token } = authResponse.body;
        
		const createMealResponse = await request(app.server)
			.post("/meal")
			.set("Authorization", `Bearer ${token}`)
			.send(mealsData[0]);

		expect(createMealResponse.statusCode).toEqual(201);
	});

	it("should be able to list all meals of a user", async () => {
		await request(app.server)
			.post("/user")
			.send(userData);

		const authResponse = await request(app.server)
			.post("/auth")
			.send(userData);

		const { token } = authResponse.body;

		for (const meal of mealsData) {
			await request(app.server)
				.post("/meal")
				.set("Authorization", `Bearer ${token}`)
				.send(meal);
		}

		const listMealsResponse = await request(app.server)
			.get("/meal")
			.set("Authorization", `Bearer ${token}`);

		expect(listMealsResponse.statusCode).toEqual(200);
		expect(listMealsResponse.body.length).toEqual(mealsData.length);
	});

	it("should be able to retrieve user metrics", async () => {
		await request(app.server)
			.post("/user")
			.send(userData);

		const authResponse = await request(app.server)
			.post("/auth")
			.send(userData);

		const { token } = authResponse.body;

		for (const meal of mealsData) {
			await request(app.server)
				.post("/meal")
				.set("Authorization", `Bearer ${token}`)
				.send(meal);
		}

		const metricsResponse = await request(app.server)
			.get("/meal/metrics")
			.set("Authorization", `Bearer ${token}`);

		expect(metricsResponse.statusCode).toEqual(200);
		expect(metricsResponse.body).toEqual({
			totalMeals: 3,
			mealsOnDiet: 2,
			mealsOffDiet: 1,
			bestStreak: 1
		});
	});

	it("should be able to delete a meal", async () => {
		await request(app.server)
			.post("/user")
			.send(userData);

		const authResponse = await request(app.server)
			.post("/auth")
			.send(userData);
            
		const { token } = authResponse.body;

		const createMealResponse = await request(app.server)
			.post("/meal")
			.set("Authorization", `Bearer ${token}`)
			.send(mealsData[0]);
            
		const mealId = createMealResponse.body.id;
		const deleteMealResponse = await request(app.server)
			.delete(`/meal/${mealId}`)
			.set("Authorization", `Bearer ${token}`);
            
		expect(deleteMealResponse.statusCode).toEqual(200);
		expect(deleteMealResponse.body).toEqual({ message: "Meal deleted successfully" });
	});

	it("should be able to update a meal", async () => {
		await request(app.server)
			.post("/user")
			.send(userData);
            
		const authResponse = await request(app.server)
			.post("/auth")
			.send(userData);

		const { token } = authResponse.body;

		const createMealResponse = await request(app.server)
			.post("/meal")
			.set("Authorization", `Bearer ${token}`)
			.send(mealsData[0]);
            
		const mealId = createMealResponse.body.id;
		const updateMealResponse = await request(app.server)
			.patch(`/meal/${mealId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({ name: "Updated Meal Name" });
            
		expect(updateMealResponse.statusCode).toEqual(200);
		expect(updateMealResponse.body).toEqual(expect.objectContaining({
			id: mealId,
			name: "Updated Meal Name",
			description: mealsData[0].description,
			date: mealsData[0].date,
			isOnDiet: mealsData[0].isOnDiet,
			userId: expect.any(String),
			createdAt: expect.any(String)
		})
		);
	});
});