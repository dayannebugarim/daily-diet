import { z } from "zod";

const CreateUserSchema = z.object({
	name: z.string().min(3).max(100),
	email: z.string().nonempty(),
	password: z.string().min(6)
});

type CreateUserDto = z.infer<typeof CreateUserSchema>;

export { CreateUserSchema, CreateUserDto };