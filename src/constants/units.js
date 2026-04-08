export const MEASUREMENT_TYPES = [
  "LengthUnit",
  "WeightUnit",
  "VolumeUnit",
  "TemperatureUnit",
];

export const UNITS_BY_TYPE = {
  LengthUnit: ["FEET", "INCHES", "YARDS", "CENTIMETERS"],
  WeightUnit: ["KILOGRAM", "GRAM", "POUND", "MILIGRAM", "TONNE"],
  VolumeUnit: ["LITRE", "MILLILITRE", "GALLON"],
  TemperatureUnit: ["CELSIUS", "FAHRENHEIT"],
};

export const TYPE_LABELS = {
  LengthUnit: "Length",
  WeightUnit: "Weight",
  VolumeUnit: "Volume",
  TemperatureUnit: "Temperature",
};

export const TYPE_ICONS = {
  LengthUnit: "📏",
  WeightUnit: "⚖️",
  VolumeUnit: "🧪",
  TemperatureUnit: "🌡️",
};

export const OPERATIONS = {
  COMPARE: "compare",
  CONVERT: "convert",
  ADD: "add",
  SUBTRACT: "subtract",
  DIVIDE: "divide",
};