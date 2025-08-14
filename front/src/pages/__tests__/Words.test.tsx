import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Words from "../Words";

describe("Words page", () => {
  it("renderiza título", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Words />
      </MemoryRouter>
    );
    expect(getByText(/Explorar palavras/i)).toBeInTheDocument();
  });
});
