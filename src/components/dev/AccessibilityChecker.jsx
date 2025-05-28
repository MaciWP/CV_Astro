// src/components/dev/AccessibilityChecker.jsx
/**
 * Accessibility debugging component - Only active in development
 * Integrates axe-core for automated accessibility auditing
 */
import React, { useEffect, useState } from 'react';

const AccessibilityChecker = () => {
    const [violations, setViolations] = useState([]);
    const [isCheckingA11y, setIsCheckingA11y] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const runA11yCheck = async () => {
        if (typeof window === 'undefined') return;

        setIsCheckingA11y(true);

        try {
            // Importar axe-core dinámicamente (solo en desarrollo)
            const axe = await import('axe-core');

            // Ejecutar análisis de accesibilidad
            axe.default.run(document, { reporter: 'v2' }, (err, results) => {
                if (err) throw err;

                setViolations(results.violations);
                setShowResults(true);
                setIsCheckingA11y(false);
            });
        } catch (error) {
            console.error('Error running accessibility check:', error);
            setIsCheckingA11y(false);
        }
    };

    // Solo activar en desarrollo y cuando se solicite manualmente
    useEffect(() => {
        // Añadir evento de teclado para activar la verificación (Ctrl+Shift+A)
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                runA11yCheck();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!showResults) return null;

    return (
        <div
            className="fixed bottom-0 right-0 z-50 w-96 max-h-96 overflow-y-auto bg-white dark:bg-dark-surface border border-gray-300 dark:border-dark-border shadow-lg p-4 text-left"
            style={{ fontSize: '14px' }}
        >
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold">Accessibility Issues ({violations.length})</h3>
                <button
                    onClick={() => setShowResults(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Close accessibility report"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {violations.length === 0 ? (
                <p className="text-green-600 dark:text-green-400">No accessibility issues found!</p>
            ) : (
                <ul className="space-y-2">
                    {violations.map((violation, index) => (
                        <li key={index} className="border-l-4 border-red-500 pl-2 py-1">
                            <p className="font-medium">{violation.id}: {violation.description}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Impact: <span className="font-semibold">{violation.impact}</span>
                            </p>
                            <p className="text-xs text-brand-red">
                                {violation.nodes.length} occurrences
                            </p>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <p>Press Ctrl+Shift+A to run accessibility check again</p>
            </div>
        </div>
    );
};

export default AccessibilityChecker;