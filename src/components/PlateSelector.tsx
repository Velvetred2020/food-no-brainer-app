  import { useEffect, useState } from "react";

  import PlateScreen from "./PlateScreen";
  import MealSelector from "./MealSelector";
  import IngredientInput from "./IngredientInput";
  import RecipeCard from "./RecipeCard";
  import RecipeDetail from "./RecipeDetail";
  import DarkModeToggle from "./DarkModeToggle";

  import { loadIngredients } from "../data/ingredients";

  import "./PlateSelector.css";

  type ViewState =
    | "plate"
    | "splitting"
    | "meal"
    | "ingredients"
    | "results"
    | "recipe";

  function PlateSelector() {
    const [view, setView] = useState<ViewState>("plate");

    const [ingredients, setIngredients] = useState<string[]>([]);
    const [recipes, setRecipes] = useState<any[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<any>(null);

    const [ingredientsReady, setIngredientsReady] = useState(false);

    useEffect(() => {
      const init = async () => {
        await loadIngredients();
        setIngredientsReady(true);
      };
      init();
    }, []);

    const handlePlateClick = () => {
      setView("splitting");
      setTimeout(() => setView("meal"), 400);
    };

    const normalize = (str: string) => str.toLowerCase().trim();

    const getRecipeIngredients = (recipe: any): string[] => {
      const list: string[] = [];

      for (let i = 1; i <= 20; i++) {
        const ing = recipe[`strIngredient${i}`];
        if (ing) list.push(normalize(ing));
      }

      return list;
    };

    const recipeHasAllIngredients = (recipe: any, required: string[]) => {
      const recipeIngredients = getRecipeIngredients(recipe);

      return required.every((req) =>
        recipeIngredients.includes(normalize(req))
      );
    };

    const fetchRecipes = async () => {
      try {
        if (!ingredientsReady || ingredients.length === 0) return;

        const responses = await Promise.all(
          ingredients.map((ing) =>
            fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
            ).then((res) => res.json())
          )
        );

        const allMealsArrays = responses.map((r) => r.meals || []);

        const intersection = allMealsArrays.reduce((acc, meals) => {
          if (!acc) return meals;

          return acc.filter((a: any) =>
            meals.some((b: any) => b.idMeal === a.idMeal)
          );
        }, null as any);

        const candidateMeals = intersection || [];

        const fullRecipes = await Promise.all(
          candidateMeals.map((meal: any) =>
            fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            ).then((res) => res.json())
          )
        );

        const detailedRecipes = fullRecipes
          .map((r) => r.meals?.[0])
          .filter(Boolean);

        const finalRecipes = detailedRecipes.filter((recipe) =>
          recipeHasAllIngredients(recipe, ingredients)
        );

        setRecipes(finalRecipes);
        setView("results");
      } catch (err) {
        console.log(err);
      }
    };

    const fetchRecipeDetails = async (id: string) => {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );

      const data = await res.json();

      setSelectedRecipe(data.meals[0]);
      setView("recipe");
    };

    return (
      <div className="container">
        <DarkModeToggle />

        {(view === "plate" || view === "splitting") && (
          <div className="centerStage">
            {view === "plate" && (
              <PlateScreen mode="plate" onClick={handlePlateClick} />
            )}
            {view === "splitting" && <PlateScreen mode="splitting" />}
          </div>
        )}

        {view !== "plate" && view !== "splitting" && (
          <div className="page animate-page">
            {view === "meal" && (
              <MealSelector onSelect={() => setView("ingredients")} />
            )}

            {view === "ingredients" && (
              <IngredientInput
                ingredients={ingredients}
                setIngredients={setIngredients}
                onSearch={fetchRecipes}
                onBack={() => setView("meal")}
              />
            )}

            {view === "results" && (
              <div className="resultsContainer">
                <button
                  className="backButton"
                  onClick={() => setView("ingredients")}
                >
                  ← Back
                </button>

                <h2>Recipes found</h2>

                <div className="recipeGrid">
                  {recipes.map((recipe: any) => (
                    <RecipeCard
                      key={recipe.idMeal}
                      recipe={recipe}
                      onClick={() => fetchRecipeDetails(recipe.idMeal)}
                    />
                  ))}
                </div>
              </div>
            )}

            {view === "recipe" && selectedRecipe && (
              <RecipeDetail
                recipe={selectedRecipe}
                onBack={() => setView("results")}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  export default PlateSelector;