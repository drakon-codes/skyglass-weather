import { describe, expect, it } from "vitest";

import { toggleFavorite } from "./location";

const paris = { id: "1", name: "Paris", latitude: 48.85, longitude: 2.35 };
const tokyo = { id: "2", name: "Tokyo", latitude: 35.68, longitude: 139.69 };

describe("saved cities", () => {
  it("adds a city that isn't saved yet", () => {
    expect(toggleFavorite([paris], tokyo).map((c) => c.id)).toEqual(["1", "2"]);
  });

  it("removes a city that is already saved instead of duplicating it", () => {
    expect(toggleFavorite([paris, tokyo], paris).map((c) => c.id)).toEqual(["2"]);
  });
});
