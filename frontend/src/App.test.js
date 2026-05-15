import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the home page content", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /Seva Foundation/i })).toBeInTheDocument();
});
