type Props = {
  recipe: any;
  onBack: () => void;
};

export default function RecipeDetail({ recipe, onBack }: Props) {
  const getIngredients = () => {
    const list: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ing = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ing && ing.trim()) {
        list.push(`${ing} - ${measure}`);
      }
    }

    return list;
  };

  const fakeTime = Math.floor(Math.random() * 30) + 20;

  return (
    <div className="recipePage">

      {/* HEADER BUTTON */}
      <button className="floatingBack" onClick={onBack}>
        ← Back
      </button>

      {/*  IMAGE */}
      <div className="recipeImg">
        <img src={recipe.strMealThumb} alt={recipe.strMeal} />

        <div className="recipeOverlay">
          <h1>{recipe.strMeal}</h1>
        </div>
      </div>

      {/* META INFO */}
      <div className="metaRow">
        <div>⏱ {fakeTime} min</div>
        <div>🍽 1 serving</div>
        <div>🔥 calories (soon)</div>
      </div>

      {/* INGREDIENTS */}
      <div className="section">
        <h3>Ingredients</h3>
        <div className="ingredientsGrid">
          {getIngredients().map((i, idx) => (
            <div key={idx} className="ingredientCard">
              {i}
            </div>
          ))}
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="section">
        <h3>How to cook</h3>
        <p className="instructions">
          {recipe.strInstructions}
        </p>
      </div>

    </div>
  );
}