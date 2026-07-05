# Ditlhaeletsanyo NetSys

A modern, professional website for Ditlhaeletsanyo NetSys - a networking and IT services company based in Botswana.

## Features

- **Responsive Design**: Works on all devices from mobile to desktop
- **Modern UI**: Clean, professional design with smooth animations
- **Complete Sections**: 
  - Hero with call-to-action
  - Services showcase
  - About company
  - Portfolio
  - Testimonials
  - Contact form with validation
  - Footer with newsletter subscription

## Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **clsx + tailwind-merge** - Class management

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) to view the site in your browser.

### Build for Production

```bash
npm run build
```

Builds the application for production to the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

Previews the production build locally.

### Clean Build

```bash
npm run clean
```

Removes the `dist` folder.

## Project Structure

```
├── dist/                # Production build output
├── src/
│   ├── components/      # Reusable components (empty for this single-component app)
│   ├── styles/          # Global styles (empty for Tailwind)
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind directives
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## Customization

### Colors

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      'primary': '#4f46e5', // Indigo
      'secondary': '#8b5cf6', // Purple
    },
  },
}
```

### Content

Edit `src/App.tsx` to update the content:
- Hero section
- Services
- About company
- Portfolio projects
- Testimonials
- Contact information

### Images

Replace images in the `public/` folder (create if needed) and update the src attributes in `App.tsx`.

## License

ISC
