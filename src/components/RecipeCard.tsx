type Props = {
  recipe: any;
  onClick: () => void;
};

export default function RecipeCard({ recipe, onClick }: Props) {
  return (
    <div className="recipeCard" onClick={onClick}>

      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
      />

      <h3>{recipe.strMeal}</h3>

    </div>
  );
}