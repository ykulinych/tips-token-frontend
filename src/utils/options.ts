export const tokenOptions = [
  { label: "SOL", value: "sol" },
  { label: "TipsToken", value: "tips-token" },
] as const;

export type Token = (typeof tokenOptions)[number]["value"];
