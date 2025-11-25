/**
 * Contexto de tema optimizado y simplificado
 * File: src/contexts/ThemeContext.jsx
 * 
 * Versión simplificada que mantiene la funcionalidad clave 
 * y elimina código innecesario.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define opciones de tema
export const themes = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Crear el contexto
const ThemeContext = createContext(null);

// Hook personalizado para usar el contexto
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme debe usarse dentro de un ThemeProvider');
    }
    return context;
};

// Componente proveedor de tema
export function ThemeProvider({ children }) {
    // Inicializar con null para evitar problemas de hidratación
    const [theme, setTheme] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    // Una vez montado, establecer el tema desde localStorage o preferencia del sistema
    useEffect(() => {
        // Obtener tema inicial desde localStorage o preferencia del sistema
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? themes.DARK : themes.LIGHT);

        setTheme(initialTheme);
        setIsMounted(true);

        // Asegurar que la clase se aplique al elemento html
        document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
        document.documentElement.classList.add(initialTheme);

        // Escuchar cambios de preferencia del sistema
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Solo actualizar si el usuario no ha establecido una preferencia
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? themes.DARK : themes.LIGHT;
                setTheme(newTheme);
                document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
                document.documentElement.classList.add(newTheme);
            }
        };

        // Usar API moderna si está disponible
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            mediaQuery.addListener(handleChange); // Fallback para navegadores antiguos
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    // Alternar entre temas - INSTANTÁNEO sin transiciones
    const toggleTheme = () => {
        if (!isMounted) return;

        const newTheme = theme === themes.LIGHT ? themes.DARK : themes.LIGHT;

        // Actualizar estado y DOM inmediatamente
        setTheme(newTheme);
        document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
        document.documentElement.classList.add(newTheme);

        // Guardar la preferencia de tema
        localStorage.setItem('theme', newTheme);
    };

    // Estado de carga simple para evitar problemas de hidratación
    if (!isMounted) {
        return <div className="invisible">{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;