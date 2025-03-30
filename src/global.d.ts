// src/global.d.ts
interface Window {
    CURRENT_LANGUAGE: string;
    TRANSLATIONS: Record<string, any>;
    t: (key: string) => string;
    changeLanguage?: (lang: string) => void;
}

export { };