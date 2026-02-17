import type { Meal } from "@/@types/knex.ts";

const calculateBestStreak = (meals: Meal[]) => {
	let maxStreak = 0;
	let currentStreak = 0;

	const sortedMeals = meals.sort((a, b) => 
		new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
	);

	for (const meal of sortedMeals) {
		if (meal.is_on_diet) {
			currentStreak++;
			maxStreak = Math.max(maxStreak, currentStreak);
		} else {
			currentStreak = 0;
		}
	}

	return maxStreak;
};

export { calculateBestStreak };