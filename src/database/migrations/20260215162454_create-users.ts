import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("user", (table) => {
		table.uuid("id").primary();
		table.string("name").notNullable();
		table.string("email").notNullable().unique();
		table.string("password").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("user");
}

