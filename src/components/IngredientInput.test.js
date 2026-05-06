import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IngredientInput from "./IngredientInput";
import { ALL_INGREDIENTS } from "../data/ingredients";

describe("IngredientInput", () => {
  let ingredients;
  let setIngredients;
  let onSearch;
  let onBack;

  beforeEach(() => {
    ingredients = [];
    setIngredients = jest.fn();
    onSearch = jest.fn();
    onBack = jest.fn();
  });

  test("types input and shows suggestions", async () => {
    render(
      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        onSearch={onSearch}
        onBack={onBack}
      />
    );

    const input = screen.getByPlaceholderText("Type an ingredient...");

    await userEvent.type(input, "to");

    const expected = ALL_INGREDIENTS.filter((i) =>
      i.toLowerCase().startsWith("to")
    ).slice(0, 6);

    expected.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("calls onSearch when clicking Find recipes", async () => {
    render(
      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        onSearch={onSearch}
        onBack={onBack}
      />
    );

    const button = screen.getByRole("button", {
      name: /find recipes/i,
    });

    await userEvent.click(button);

    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  test("calls onBack when back button clicked", async () => {
    render(
      <IngredientInput
        ingredients={ingredients}
        setIngredients={setIngredients}
        onSearch={onSearch}
        onBack={onBack}
      />
    );

    const backButton = screen.getByText("← Back");

    await userEvent.click(backButton);

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});