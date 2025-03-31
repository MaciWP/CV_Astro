// src/components/A11yAnnouncer.jsx
/**
 * Accessibility announcer component
 * Allows screen readers to announce dynamic content changes
 */
import React, { useState, useEffect } from 'react';

const A11yAnnouncer = () => {
    const [announcement, setAnnouncement] = useState('');
    const [previousAnnouncement, setPreviousAnnouncement] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Crear un método global para hacer anuncios a lectores de pantalla
        window.announceToScreenReader = (message, priority = 'polite') => {
            if (priority !== 'polite' && priority !== 'assertive') {
                priority = 'polite';
            }

            // Almacenar el anuncio anterior para evitar duplicados
            setPreviousAnnouncement(announcement);
            setAnnouncement({ message, priority });

            // Limpiar después de un tiempo prudencial
            setTimeout(() => {
                setAnnouncement('');
            }, 3000);
        };

        // Evento personalizado para anuncios
        const handleAnnouncement = (event) => {
            if (event.detail && event.detail.message) {
                window.announceToScreenReader(
                    event.detail.message,
                    event.detail.priority || 'polite'
                );
            }
        };

        document.addEventListener('a11y-announce', handleAnnouncement);
        return () => {
            document.removeEventListener('a11y-announce', handleAnnouncement);
            delete window.announceToScreenReader;
        };
    }, [announcement]);

    if (!announcement || announcement.message === previousAnnouncement) {
        return null;
    }

    return (
        <div
            aria-live={announcement.priority}
            aria-atomic="true"
            className="sr-only"
        >
            {announcement.message}
        </div>
    );
};

export default A11yAnnouncer;