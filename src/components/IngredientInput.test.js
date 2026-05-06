import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IngredientInput from "./IngredientInput";

// 👉 FORCE TEST DATA (IMPORTANT FIX)
jest.mock("../data/ingredients", () => ({
  ALL_INGREDIENTS: ["tomato", "onion", "garlic", "cheese", "chicken"],
}));

describe("IngredientInput integration flow", () => {
  let setIngredients;
  let onSearch;
  let onBack;
  let ingredients;

  beforeEach(() => {
    ingredients = [];

    setIngredients = jest.fn((newValue) => {
      ingredients = newValue;
    });

    onSearch = jest.fn();
    onBack = jest.fn();
  });

  test("full user flow: type → select suggestion → add → remove → search", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        onSearch={onSearch}
        onBack={onBack}
      />
    );

    // use stable mocked data
    const suggestion = "tomato";
    const query = "tom";

    const input = screen.getByPlaceholderText("Type an ingredient...");
    await user.type(input, query);

    // suggestion MUST appear now
    expect(screen.getByText(suggestion)).toBeInTheDocument();

    // click suggestion
    await user.click(screen.getByText(suggestion));

    expect(setIngredients).toHaveBeenCalled();

    // simulate parent update
    rerender(
      <IngredientInput
        ingredients={[suggestion]}
        setIngredients={setIngredients}
        onSearch={onSearch}
        onBack={onBack}
      />
    );

    expect(screen.getByText(suggestion)).toBeInTheDocument();

    // remove ingredient
    await user.click(screen.getByText("X"));

    expect(setIngredients).toHaveBeenCalled();

    // search
    await user.click(
      screen.getByRole("button", { name: /find recipes/i })
    );

    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});