export const checkFalsy = (value: string | null) =>
  value !== null && value !== "" && value !== "undefined" && value !== "null" && value !== undefined;
