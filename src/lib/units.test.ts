import { describe, expect, it } from "vitest";

import { formatTemperature, formatVisibility, formatWindSpeed, isUnitPreferences } from "./units";

describe("unit conversion", () => {
  it("shows °F when the Fahrenheit unit is selected", () => {
    expect(formatTemperature(20, "fahrenheit")).toBe("68°");
    expect(formatTemperature(20, "celsius")).toBe("20°");
  });

  it("shows mph when the mph unit is selected", () => {
    expect(formatWindSpeed(100, "mph")).toBe("62 mph");
    expect(formatWindSpeed(100, "kmh")).toBe("100 km/h");
  });

  it("shows visibility in miles alongside mph", () => {
    expect(formatVisibility(16093.44, "mph")).toBe("10.0 mi");
    expect(formatVisibility(10000, "kmh")).toBe("10.0 km");
  });

  it("rejects corrupt saved unit preferences", () => {
    expect(isUnitPreferences({ temperature: "kelvin", wind: "kmh" })).toBe(false);
    expect(isUnitPreferences({ temperature: "fahrenheit", wind: "mph" })).toBe(true);
  });
});
