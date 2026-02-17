import z from "zod";

const UpdateMealSchema = z.object({
	name: z.string().min(3).max(100).optional(),
	description: z.string().optional(),
	date: z.coerce.date().optional(),
	isOnDiet: z.boolean().optional()
});

type UpdateMealDto = z.infer<typeof UpdateMealSchema>;

export { UpdateMealSchema, UpdateMealDto };