/**
 * Identity facts that do not change with the language. The translated header
 * copy (job title, summary, permit, availability...) lives in the locale files
 * under `header.*`.
 * @file src/data/profile.ts
 */

export const profile = {
  fullName: "Oriol Macias",
  dateOfBirth: "1994",
  contacts: [
    { type: "email", value: "oriolomb@gmail.com", url: "mailto:oriolomb@gmail.com", icon: "envelope" },
    { type: "linkedin", value: "oriolmaciasbadosa", url: "https://linkedin.com/in/oriolmaciasbadosa", icon: "linkedin" },
    { type: "github", value: "MaciWP", url: "https://github.com/MaciWP", icon: "github" },
  ],
} as const;
