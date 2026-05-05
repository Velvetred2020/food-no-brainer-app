import { useState } from "react";
import { ALL_INGREDIENTS } from "../data/ingredients";

type Props = {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  onSearch: () => void;
  onBack: () => void;
};

export default function IngredientInput({
  ingredients,
  setIngredients,
  onSearch,
  onBack,
}: Props) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const normalize = (value: string) =>
    value.toLowerCase().trim().replace(/\s+/g, " ");

  const handleInput = (value: string) => {
    setInput(value);

    const clean = normalize(value);

    if (!clean) {
      setSuggestions([]);
      return;
    }

    const filtered = ALL_INGREDIENTS.filter((item) =>
      item.toLowerCase().startsWith(clean)
    );

    setSuggestions(filtered.slice(0, 6));
  };

  const addIngredient = (value: string) => {
    const clean = normalize(value);

    const realMatch = ALL_INGREDIENTS.find(
      (i) => i.toLowerCase() === clean
    );

    if (!realMatch) return;
    if (ingredients.includes(realMatch)) return;

    setIngredients([...ingredients, realMatch]);
    setInput("");
    setSuggestions([]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="page animate-page">
      <div className="ingredientCardContainer responsiveCard">

        <button className="backButton" onClick={onBack}>
          ← Back
        </button>

        <h2 className="darkText">
          What’s in your fridge?
        </h2>

        <div className="inputWrapper">
          <input
            className="ingredientInput"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Type an ingredient..."
          />

          {suggestions.length > 0 && (
            <div className="suggestionBox">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="suggestion suggestionItem"
                  onClick={() => addIngredient(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pillContainer">
          {ingredients.map((item, i) => (
            <div key={i} className="pill">
              {item}
              <span
                className="pillRemove"
                onClick={() => removeIngredient(i)}
              >
                X
              </span>
            </div>
          ))}
        </div>

        <button className="findButton" onClick={onSearch}>
          Find recipes 🍽️
        </button>

      </div>
    </div>
  );
}