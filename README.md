# Oriol Macias - CV Portfolio

![License](https://img.shields.io/github/license/MaciWP/CV_Astro)
![Technologies](https://img.shields.io/badge/Tech-Astro%20%7C%20TailwindCSS-blue)

A professional CV/portfolio website following Swiss design standards. This project showcases my skills and experience as a software developer, built with modern web technologies.

## 🌐 [View Live Site](https://oriolmacias.dev)

![Oriol Macias CV Portfolio](public/screenshots/desktop.jpg)

## 🚀 Features

- 🎨 **Modern, Clean Design**: Following Swiss design principles with clean typography and structured layout
- 🌙 **Dark/Light Theme**: Toggle between themes with smooth transitions
- 🌍 **Multilingual Support**: Available in English, Spanish, French, and German
- 📱 **Fully Responsive**: Optimized for all screen sizes and devices
- ⚡ **Performance Optimized**: Fast loading, with 90+ scores on Lighthouse
- 📊 **SEO Ready**: Structured data, meta tags, and sitemap for better search engine visibility
- 📄 **Printable CV**: print-optimized layout for saving as PDF
- 🔄 **PWA Support**: Can be installed as a Progressive Web App for offline access

## 🧰 Tech Stack

- **[Astro](https://astro.build/)**: Core framework for static site generation (pure Astro + vanilla JS, no UI framework)
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Netlify](https://www.netlify.com/)**: Hosting and continuous deployment

## 🛠️ Development

### Prerequisites

- Node.js 22 or higher
- pnpm 11 (managed via Corepack, bundled with Node 22)

### Setup

```bash
# Clone the repository
git clone https://github.com/MaciWP/CV_Astro.git
cd CV_Astro

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Build

```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run generate-images` - Generate responsive profile images
- `pnpm run check` - Run all validation checks (contrast, translations, structured data)
- `pnpm run a11y:audit` - Run Lighthouse accessibility audit
- `pnpm run lint` - Run ESLint
- `pnpm run clean` - Clean build artifacts

## 📂 Project Structure

```
/
├── public/              # Public assets
│   ├── icons/           # Favicons and app icons
│   ├── images/          # Images and photos
│   └── locales/         # Translation files
├── src/
│   ├── components/      # Astro components
│   │   └── cv/          # CV section components
│   ├── data/            # Data files for CV sections
│   ├── layouts/         # Astro layouts
│   ├── pages/           # Astro pages
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── scripts/             # Build and optimization scripts
├── astro.config.mjs     # Astro configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## 📚 Key Components

- **Responsive Design**: Adapts to all device sizes
- **Theme Switching**: Smooth transition between light and dark modes
- **CV Sections**:
  - Summary
  - Experience
  - Skills
  - Education
  - Languages
  - Projects
- **SEO Optimization**: Rich metadata and structured data
- **Performance**: Optimized asset loading strategies

## 🔍 SEO Features

- Complete meta tags
- Structured data (JSON-LD)
- Sitemap generation
- Optimized for keywords such as:
  - oriol
  - oriol macias
  - oriol dev
  - macias dev
  - oriol macias dev
  - developer
  - software developer

## 📋 Future Improvements

- Add blog section
- Enhance multilingual support
- Add more interactive elements
- Improve accessibility features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Oriol Macias - [oriolomb@gmail.com](mailto:oriolomb@gmail.com)

Portfolio: [oriolmacias.dev](https://oriolmacias.dev)

LinkedIn: [linkedin.com/in/oriolmaciasbadosa](https://linkedin.com/in/oriolmaciasbadosa)

GitHub: [github.com/MaciWP](https://github.com/MaciWP)

---

❤️ Thanks for checking out my project!