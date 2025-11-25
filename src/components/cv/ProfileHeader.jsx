/**
 * Componente ProfileHeader con fix para ruta de imagen
 * File: src/components/cv/ProfileHeader.jsx
 */
import React, { useState, useEffect } from 'react';
import headerData from '../../data/header';

const ProfileHeader = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [photoLoaded, setPhotoLoaded] = useState(false);
    const [localData, setLocalData] = useState({
        ...headerData,
        jobTitle: headerData.jobTitle || "Software Developer",
        summary: headerData.summary || "",
        photoAlt: headerData.photoAlt || "Oriol Macias - Software Developer"
    });

    // Función segura para obtener traducciones con fallbacks robustos
    const getTranslation = (key, defaultValue) => {
        // Verificar si la API de traducción está disponible
        if (typeof window !== 'undefined' && typeof window.t === 'function') {
            const translated = window.t(key);

            // Comprobar si la traducción es válida (no es solo la clave)
            if (translated && translated !== key.split('.').pop()) {
                return translated;
            }
        }

        // Fallback 1: Buscar en TRANSLATIONS si está disponible
        if (typeof window !== 'undefined' && window.TRANSLATIONS) {
            const currentLang = window.CURRENT_LANGUAGE || 'en';
            const translations = window.TRANSLATIONS[currentLang];

            if (translations) {
                const keys = key.split('.');
                let result = translations;

                for (const k of keys) {
                    if (result && typeof result === 'object' && k in result) {
                        result = result[k];
                    } else {
                        result = null;
                        break;
                    }
                }

                if (result) return result;
            }
        }

        // Fallback 2: Devolver el valor de headerData si coincide con la clave
        if (key === 'header.jobTitle') return headerData.jobTitle;
        if (key === 'header.summary') return headerData.summary;
        if (key === 'header.photoAlt') return headerData.photoAlt;

        // Fallback 3: Usar el valor predeterminado proporcionado
        return defaultValue || key.split('.').pop();
    };

    // Cargar traducciones
    const loadTranslations = () => {
        setLocalData({
            ...headerData,
            jobTitle: getTranslation('header.jobTitle', headerData.jobTitle),
            summary: getTranslation('header.summary', headerData.summary),
            photoAlt: getTranslation('header.photoAlt', headerData.photoAlt),
            email: getTranslation('header.email', 'Email'),
            linkedin: getTranslation('header.linkedin', 'LinkedIn'),
            github: getTranslation('header.github', 'GitHub'),
            downloadCV: getTranslation('buttons.downloadCV', 'Download CV'),
            downloadCoverLetter: getTranslation('buttons.downloadCoverLetter', 'Download Cover Letter')
        });
    };

    useEffect(() => {
        // Iniciar animación
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        // Cargar traducciones iniciales
        loadTranslations();

        // Observer para detección de visibilidad
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('about');
        if (element) {
            observer.observe(element);
        }

        // Escuchar cambios de idioma
        const handleLanguageChange = () => {
            loadTranslations();
        };

        document.addEventListener('languageChanged', handleLanguageChange);
        document.addEventListener('translationsLoaded', handleLanguageChange);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
            document.removeEventListener('languageChanged', handleLanguageChange);
            document.removeEventListener('translationsLoaded', handleLanguageChange);
        };
    }, []);

    // Función para manejar carga de imagen
    const handleImageLoaded = () => {
        setPhotoLoaded(true);
    };

    // Función para descargar el CV
    const handleCVDownload = () => {
        const pdfUrl = '/OriolMacias_CV.pdf';
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'OriolMacias_CV.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Función para descargar la carta de presentación
    const handleCoverLetterDownload = () => {
        const pdfUrl = '/OriolMacias_CoverLetter.pdf';
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'OriolMacias_CoverLetter.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div id="about" className="pt-4 pb-10">
            {/* Header / Información Personal - diseño compacto */}
            <section>
                <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 items-start transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Foto profesional - a la izquierda, solo imagen con borde */}
                    <div className="md:col-span-3 flex justify-center md:justify-start order-1 md:order-1">
                        <div className={`relative transition-all duration-300 ${photoLoaded ? 'opacity-100' : 'opacity-80'}`}>
                            {/* Solo imagen con borde rojo sutil */}
                            <div className="w-40 h-40 md:w-44 md:h-44 border-2 border-brand-red/30 hover:border-brand-red transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md">
                                <picture>
                                    <source
                                        srcSet="/images/oriol_macias-192.avif 192w, /images/oriol_macias-320.avif 320w"
                                        sizes="176px"
                                        type="image/avif"
                                    />
                                    <source
                                        srcSet="/images/oriol_macias-192.webp 192w, /images/oriol_macias-320.webp 320w"
                                        sizes="176px"
                                        type="image/webp"
                                    />
                                    <img
                                        src="/images/oriol_macias-320.avif"
                                        alt={localData.photoAlt}
                                        width={176}
                                        height={176}
                                        loading="eager"
                                        fetchpriority="high"
                                        className="w-full h-full object-cover"
                                        onLoad={handleImageLoaded}
                                    />
                                </picture>
                            </div>
                        </div>
                    </div>

                    {/* Información personal */}
                    <div className="md:col-span-9 space-y-3 order-2 md:order-2">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-1">{headerData.fullName}</h1>
                            <h2
                                className="text-lg md:text-xl text-brand-red font-medium"
                                data-i18n="header.jobTitle"
                            >
                                {localData.jobTitle}
                            </h2>
                        </div>

                        <p
                            className="text-gray-700 dark:text-gray-300 leading-relaxed text-base text-justify"
                            data-i18n="header.summary"
                        >
                            {localData.summary}
                        </p>

                        {/* Información de contacto - compacta en línea */}
                        <div className="flex flex-wrap gap-4 pt-1">
                            {headerData.contactInfo.map((contact, index) => (
                                <a
                                    key={index}
                                    href={contact.type === 'email' ? `mailto:${contact.value}` : contact.url}
                                    target={contact.type !== 'email' ? "_blank" : undefined}
                                    rel={contact.type !== 'email' ? "noopener noreferrer" : undefined}
                                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red transition-colors duration-200"
                                    aria-label={localData[contact.type] || contact.label}
                                >
                                    <i className={`${contact.icon} text-brand-red`}></i>
                                    <span className="text-sm">{contact.value}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProfileHeader;