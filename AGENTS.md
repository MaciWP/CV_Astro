# Instrucciones para Codex

## Formateo y Linting

- Ejecuta `npx prettier --write .` para formatear el código.
- Ejecuta `npm run lint` para verificar estilo. Corrige cualquier advertencia antes de un commit.

```bash
npx prettier --check .
npm run lint
```

## Estilo de código

- Prefiere módulos y funciones bien definidas.
- Mantén los comentarios breves y actualizados.
- Sigue un enfoque pragmático y ágil.

## Resumen del proyecto

- **Objetivo:** Portfolio/CV construido con Astro y React.
- **Características:** soporte i18n, animaciones y PWA.
- **Desafío:** mantener un sitio rápido con código simple.

## Stack tecnológico

- **Astro** y **React** para el frontend.
- **TailwindCSS** para estilos.

## Flujo de trabajo

1. Instala dependencias con `npm install` si es necesario.
2. Para desarrollo usa `npm run dev`.
3. Compila con `npm run build` y previsualiza con `npm run preview`.

```bash
npm run dev      # servidor de desarrollo
npm run build    # compilar para producción
npm run preview  # ver build de producción
```

## Corrección de errores

1. Reproduce el fallo.
2. Revisa mensajes en consola y registros.
3. Aplica la solución y documenta los cambios relevantes.

## Proceso de Git

- Realiza commits pequeños y descriptivos.
- Asegúrate de que Prettier y ESLint no muestren errores antes de cada commit.
- Utiliza pull requests para integrar cambios.

## Puntos clave

- Mantén el código conciso pero claro.
- Documenta cualquier decisión técnica importante.

## Validación

Después de modificar archivos ejecuta:

```bash
npx prettier --check .
npm run lint
```

Soluciona los problemas que aparezcan antes de finalizar la tarea.
