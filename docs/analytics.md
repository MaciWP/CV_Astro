# Configurar Google Analytics 4 y Search Console

Este proyecto puede integrar Google Analytics 4 (GA4) y Google Search Console para mejorar el seguimiento de visitas y el posicionamiento en buscadores.

## Obtener el ID de medición de GA4

1. Accede a [Google Analytics](https://analytics.google.com/) y crea una propiedad GA4.
2. Crea un flujo de datos para tu web y copia el **ID de medición** que comienza con `G-`.

## Obtener el token de verificación de Search Console

1. Abre [Google Search Console](https://search.google.com/search-console).
2. Añade tu dominio como nueva propiedad.
3. Elige el método de verificación mediante **etiqueta HTML** y copia el valor del token.

## Variables de entorno

Al desplegar el proyecto establece las siguientes variables de entorno:

- `PUBLIC_GA_MEASUREMENT_ID`: contiene el ID de medición de GA4.
- `SEARCH_CONSOLE_TOKEN`: valor del meta de verificación de Search Console.

En Netlify puedes añadirlas en **Site settings > Environment variables**. Para desarrollo local, crea un archivo `.env` con estos valores.
