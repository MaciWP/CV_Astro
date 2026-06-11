// src/global.d.ts
declare global {
    interface Window {
        CURRENT_LANGUAGE: string;
        TRANSLATIONS: Record<string, any>;
        t: (key: string) => string;
        changeLanguage?: (lang: string) => void;
    }
}

export { };
