// eslint-disable-next-line
import { Knex } from "knex";

declare module "knex/types/tables" {
    export interface Tables {
        user: {
            id: string;
            name: string;
            email: string;
            password: string;
            created_at: string;
        }

        meal: {
            id: string;
            user_id: string;
            name: string;
            description?: string;
            is_on_diet: boolean;
            date_time: string;
            created_at: string;
            user_id: Knex.Types.StringifiedColumnType<"user", "id">;
        }
    }
}