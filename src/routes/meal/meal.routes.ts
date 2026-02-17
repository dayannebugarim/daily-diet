import { db } from "@/config/database.ts";
import { isAuthenticated } from "@/middlewares/is-authenticated.ts";
import { FastifyInstance } from "fastify";
import { CreateMealDto, CreateMealSchema } from "./dto/create-meal.ts";
import { UpdateMealDto, UpdateMealSchema } from "./dto/update-meal.ts";
import { calculateBestStreak } from "./utils/calculate-best-streak.ts";

export async function mealRoutes(app: FastifyInstance) {
	app.addHook("preHandler", async (request, reply) => {
		isAuthenticated(request, reply);
	});

	// Deve ser possível registrar uma refeição feita (As refeições devem ser relacionadas a um usuário);
	app.post("/", { schema: CreateMealSchema }, async (request, reply) => {
		const { name, description, date, isOnDiet } = request.body as CreateMealDto;

		const [meal] =await db("meal")
			.insert({
				id: crypto.randomUUID(),
				user_id: request.user.userId,
				name,
				description,
				date_time: date,
				is_on_diet: isOnDiet
			}).returning("*");
        
		return reply.status(201).send({
			id: meal.id,
			name: meal.name,
			description: meal.description,
			date: meal.date_time,
			isOnDiet: Boolean(meal.is_on_diet),
			createdAt: meal.created_at,
			userId: meal.user_id
		});
	});

	// Deve ser possível listar todas as refeições de um usuário;
	app.get("/", async (request, reply) => {
		const meals = await db("meal")
			.where({ user_id: request.user.userId })
			.select("*");
        
		const formattedMeals = meals.map(meal => ({
			id: meal.id,
			name: meal.name,
			description: meal.description,
			date: meal.date_time,
			isOnDiet: Boolean(meal.is_on_diet),
			createdAt: meal.created_at,
			userId: meal.user_id
		}));
		
		return reply.send(formattedMeals);
	});

	// Deve ser possível visualizar uma única refeição;
	app.get("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };
        
		const meal = await db("meal")
			.where({ id, user_id: request.user.userId })
			.first();

		if (!meal) {
			return reply.status(404).send({ message: "Meal not found" });
		}

		return reply.send({
			id: meal.id,
			name: meal.name,
			description: meal.description,
			date: meal.date_time,
			isOnDiet: Boolean(meal.is_on_diet),
			createdAt: meal.created_at,
			userId: meal.user_id
		});
	});

	// Deve ser possível apagar uma refeição;
	app.delete("/:id", async (request, reply) => {
		const { id } = request.params as { id: string };

		const meal = await db("meal")
			.where({ id, user_id: request.user.userId })
			.first();
            
		if (!meal) {
			return reply.status(404).send({ message: "Meal not found" });
		}

		await db("meal")
			.where({ id, user_id: request.user.userId })
			.delete();

		return reply.send({ message: "Meal deleted successfully" });
	});
    
	// Deve ser possível editar uma refeição, podendo alterar nome, descrição, data e hora e se está dentro ou fora da dieta;
	app.patch("/:id", { schema: UpdateMealSchema }, async (request, reply) => {
		const { id } = request.params as { id: string };
		const { name, description, date, isOnDiet } = request.body as UpdateMealDto;

		const meal = await db("meal")
			.where({ id, user_id: request.user.userId })
			.first();

		if (!meal) {
			return reply.status(404).send({ message: "Meal not found" });
		}

		const [updatedMeal] = await db("meal")
			.where({ id, user_id: request.user.userId })
			.update({
				name: name ?? meal.name,
				description: description ?? meal.description,
				date_time: date ?? meal.date_time,
				is_on_diet: isOnDiet ?? meal.is_on_diet
			})
			.returning("*");

		return reply.send({
			id: updatedMeal.id,
			name: updatedMeal.name,
			description: updatedMeal.description,
			date: updatedMeal.date_time,
			isOnDiet: Boolean(updatedMeal.is_on_diet),
			createdAt: updatedMeal.created_at,
			userId: updatedMeal.user_id
		});
	});

	/*
    Deve ser possível recuperar as métricas de um usuário:
        - Quantidade total de refeições registradas
        - Quantidade total de refeições dentro da dieta
        - Quantidade total de refeições fora da dieta
        - Melhor sequência de refeições dentro da dieta
    */
	app.get("/metrics", async (request, reply) => {
		const meals = await db("meal").where({ user_id: request.user.userId }).select("*");
		const totalMeals = meals.length;
		const mealsOnDiet = meals.filter(meal => meal.is_on_diet).length;
		const mealsOffDiet = totalMeals - mealsOnDiet;
		const bestStreak = calculateBestStreak(meals);
        
		return reply.send({
			totalMeals,
			mealsOnDiet,
			mealsOffDiet,
			bestStreak
		});
	});
}
