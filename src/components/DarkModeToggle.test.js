import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DarkModeToggle from "./DarkModeToggle";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

test("toggles dark mode, updates DOM and localStorage", async () => {
  render(<DarkModeToggle />);

  const button = screen.getByRole("button");

  expect(button).toHaveTextContent("🌙");
  expect(document.documentElement.classList.contains("dark")).toBe(false);

  await userEvent.click(button);

  expect(button).toHaveTextContent("☀️");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(localStorage.getItem("darkMode")).toBe("true");

  await userEvent.click(button);

  expect(document.documentElement.classList.contains("dark")).toBe(false);
  expect(localStorage.getItem("darkMode")).toBe("false");
});