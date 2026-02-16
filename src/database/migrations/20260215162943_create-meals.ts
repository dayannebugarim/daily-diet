import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("meal", (table) => {
		table.uuid("id").primary();
		table.string("name").notNullable();
		table.string("description").nullable();
		table.boolean("is_on_diet").notNullable();
		table.timestamp("date_time").notNullable();
		table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
		table.uuid("user_id").notNullable();
		table.foreign("user_id").references("id").inTable("user").onDelete("CASCADE");
	});
}


export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("meal");
}

