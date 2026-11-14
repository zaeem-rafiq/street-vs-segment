import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceStatus } from "./SiteHeader";

describe("PriceStatus", () => {
  it("says the prices were read just now only when every price is live", () => {
    render(<PriceStatus live />);
    expect(screen.getByTestId("price-status")).toHaveTextContent(/^Kalshi prices read just now/);
  });

  it("never calls a saved price live", () => {
    render(<PriceStatus live={false} />);
    const status = screen.getByTestId("price-status");
    expect(status).toHaveTextContent(/^Some prices are saved, not live/);
    expect(status).not.toHaveTextContent("read just now");
  });
});
