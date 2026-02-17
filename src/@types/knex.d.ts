import "knex";

export interface User {
	id: string;
	name: string;
	email: string;
	password: string;
	created_at: string;
}

export interface Meal {
	id: string;
	user_id: string;
	name: string;
	description?: string;
	is_on_diet: boolean;
	date_time: string;
	created_at: string;
}

declare module "knex/types/tables" {
	interface Tables {
		user: User;
		meal: Meal;
	}
}