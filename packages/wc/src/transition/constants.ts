export const Duration = {
  ExtraLong1: 700,
  ExtraLong2: 800,
  ExtraLong3: 900,
  ExtraLong4: 1000,
  Long1: 450,
  Long2: 500,
  Long3: 550,
  Long4: 600,
  Medium1: 250,
  Medium2: 300,
  Medium3: 350,
  Medium4: 400,
  Short1: 50,
  Short2: 100,
  Short3: 150,
  Short4: 200,
} as const;

export const Easing = {
  Emphasized: "cubic-bezier(0.2, 0, 0, 1)",
  EmphasizedAccelerate: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  EmphasizedDecelerate: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  Linear: "cubic-bezier(0, 0, 1, 1)",
  Standard: "cubic-bezier(0.2, 0, 0, 1)",
  StandardAccelerate: "cubic-bezier(0.3, 0, 1, 1)",
  StandardDecelerate: "cubic-bezier(0, 0, 0, 1)",
} as const;
