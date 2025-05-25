# Oriol Macias - CV Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-id/deploy-status)](https://app.netlify.com/sites/oriolmacias/deploys)
![License](https://img.shields.io/github/license/MaciWP/CV_Astro)
![Technologies](https://img.shields.io/badge/Tech-Astro%20%7C%20React%20%7C%20TailwindCSS-blue)

A professional CV/portfolio website following Swiss design standards. This project showcases my skills and experience as a software developer, built with modern web technologies.

## 🌐 [View Live Site](https://oriolmacias.dev)

![Oriol Macias CV Portfolio](public/screenshots/desktop.jpg)

## 🚀 Features

- 🎨 **Modern, Clean Design**: Following Swiss design principles with clean typography and structured layout
- 🌙 **Dark/Light Theme**: Toggle between themes with smooth transitions
- 🌍 **Multilingual Support**: Available in English, Spanish, and French
- 📱 **Fully Responsive**: Optimized for all screen sizes and devices
- ⚡ **Performance Optimized**: Fast loading, with 90+ scores on Lighthouse
- 📊 **SEO Ready**: Structured data, meta tags, and sitemap for better search engine visibility
- 📄 **CV Download**: Direct PDF export of resume
- 🔄 **PWA Support**: Can be installed as a Progressive Web App for offline access

## 🧰 Tech Stack

- **[Astro](https://astro.build/)**: Core framework for static site generation
- **[React](https://reactjs.org/)**: For interactive components
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework
- **[Netlify](https://www.netlify.com/)**: Hosting and continuous deployment
- **[Cloudflare CDN](https://www.cloudflare.com/)**: Global content delivery for static assets

## 🛠️ Development

### Prerequisites

- Node.js 18 or higher
- npm 9.5 or higher

### Setup

```bash
# Clone the repository
git clone https://github.com/MaciWP/CV_Astro.git
cd CV_Astro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run generate:favicons` - Generate favicons
- `npm run generate:sitemap` - Generate sitemap
- `npm run optimize:images` - Optimize images
- `npm run seo:audit` - Run Lighthouse audit
- `npm run analyze:bundle` - Analyze bundle size

### SSL Certificate Renewal

Use the `scripts/renew-cert.sh` script to renew your Let's Encrypt
certificate. You can automate it with a cron job:

```bash
0 3 * * 1 /path/to/CV_Astro/scripts/renew-cert.sh >> /var/log/letsencrypt/renew.log 2>&1
```

This example runs every Monday at 3 AM. Adjust the path and schedule as
needed.

## 📂 Project Structure

```
/
├── public/              # Public assets
│   ├── icons/           # Favicons and app icons
│   ├── images/          # Images and photos
│   └── locales/         # Translation files
├── src/
│   ├── components/      # React components
│   │   └── cv/          # CV section components
│   ├── contexts/        # React contexts
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

The source code is licensed under the [MIT License](LICENSE).
All text and images are provided under the [CC BY-NC 4.0](LICENSE_CONTENT) license.

## 📧 Contact

Oriol Macias - [oriolomb@gmail.com](mailto:oriolomb@gmail.com)

Portfolio: [oriolmacias.dev](https://oriolmacias.dev)

LinkedIn: [linkedin.com/in/oriolmaciasbadosa](https://linkedin.com/in/oriolmaciasbadosa)

GitHub: [github.com/MaciWP](https://github.com/MaciWP)

Para configurar los registros SPF y DMARC de tu dominio puedes consultar
[docs/email-dns.md](docs/email-dns.md).

---

❤️ Thanks for checking out my project!
