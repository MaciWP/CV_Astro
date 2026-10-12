/**
 * Identity facts that do not change with the language: the site URL, contact
 * details and profile links. The translated header copy (job title, summary,
 * permit, availability...) lives in the locale files under `header.*`.
 * @file src/data/profile.ts
 */

export const SITE_URL = "https://oriolmacias.dev";

const email = "oriolomb@gmail.com";
const github = "https://github.com/MaciWP";
const linkedin = "https://linkedin.com/in/oriolmaciasbadosa";

export const profile = {
  fullName: "Oriol Macias",
  dateOfBirth: "1994",
  email,
  github,
  linkedin,
  contacts: [
    { type: "email", value: email, url: `mailto:${email}`, icon: "envelope" },
    { type: "linkedin", value: "oriolmaciasbadosa", url: linkedin, icon: "linkedin" },
    { type: "github", value: "MaciWP", url: github, icon: "github" },
  ],
} as const;
