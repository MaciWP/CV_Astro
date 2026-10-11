/**
 * Build-time UI strings. Every visible string that is not CV content lives in
 * src/data/locales/<lang>/translation.json; components read it through
 * `messages(lang)`, which is typed from the English file, so a missing key is
 * a type error and `pnpm run check:translations` keeps the 4 files in parity.
 * URL routing stays with astro:i18n.
 * @file src/i18n.ts
 */
import en from "./data/locales/en/translation.json";
import es from "./data/locales/es/translation.json";
import fr from "./data/locales/fr/translation.json";
import de from "./data/locales/de/translation.json";

export const LANGS = ["en", "es", "fr", "de"] as const;
export type Lang = (typeof LANGS)[number];
export type Messages = typeof en;

const MESSAGES: Record<Lang, Messages> = { en, es, fr, de };

/** Normalizes a language code to a supported one, defaulting to English. */
export const normalizeLang = (lang: string | undefined): Lang =>
    LANGS.includes(lang as Lang) ? (lang as Lang) : "en";

/** The UI strings for a language (English for an unknown code). */
export const messages = (lang: string | undefined): Messages =>
    MESSAGES[normalizeLang(lang)];

/** BCP 47 locale for Intl date formatting, per site language. */
export const DATE_LOCALE: Record<Lang, string> = {
    en: "en-GB",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
};
