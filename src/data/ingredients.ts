export let ALL_INGREDIENTS: string[] = [];

const CACHE_KEY = "ingredients_cache";
const CACHE_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

type CachedData = {
  data: string[];
  timestamp: number;
};

export const loadIngredients = async (): Promise<string[]> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);

    if (cached) {
      const parsed: CachedData = JSON.parse(cached);

      const isValid =
        Date.now() - parsed.timestamp < CACHE_DURATION;

      if (isValid) {
        ALL_INGREDIENTS = parsed.data;
        return ALL_INGREDIENTS;
      }
    }

    // API CALL
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );

    const data = await res.json();

    // SORTED INGREDIENT LIST
    const ingredients = (data.meals || [])
      .map((item: any) =>
        item.strIngredient?.toLowerCase().trim()
      )
      .filter(Boolean)
      .sort();

    ALL_INGREDIENTS = ingredients;

    const cachePayload: CachedData = {
      data: ingredients,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));

    return ALL_INGREDIENTS;
  } catch (err) {
    console.error("Error loading ingredients:", err);
    return [];
  }
};