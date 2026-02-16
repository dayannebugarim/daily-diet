import z from "zod";

const LoginSchema = z.object({
	email: z.string().nonempty(),
	password: z.string().min(6)
});

type LoginDto = z.infer<typeof LoginSchema>;

export { LoginSchema, LoginDto };