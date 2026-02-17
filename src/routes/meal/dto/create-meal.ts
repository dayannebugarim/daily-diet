import z from "zod";

const CreateMealSchema = z.object({
	name: z.string().min(3).max(100),
	description: z.string().optional(),
	date: z.coerce.date(),
	isOnDiet: z.boolean()
});

type CreateMealDto = z.infer<typeof CreateMealSchema>;

export { CreateMealSchema, CreateMealDto };