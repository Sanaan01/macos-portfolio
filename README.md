# macOS Portfolio

A macOS-inspired portfolio built with React and Vite. It mimics a desktop experience with draggable windows, a dock, Finder-style project browsing, a gallery, and quick access to contact and resume views.

## Features

- **macOS-style UI** with desktop windows, dock interactions, and app-like panels.
- **Project showcase** in a Finder-inspired layout with folders, files, and previews.
- **Interactive windows** for skills, gallery, contact, resume, and articles.
- **Smooth animations** powered by GSAP and draggable window behavior.
- **State management** with Zustand for window/app interactions.

## Tech Stack

- React + Vite
- GSAP + @gsap/react
- Tailwind CSS
- Zustand

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

```text
src/
  components/   # Reusable UI pieces (dock, navbar, welcome screen)
  windows/      # Windowed views (Finder, Gallery, Terminal, Contact, etc.)
  constants/    # App configuration/data for dock, links, and content
  store/        # Zustand state management
```

## Customization

- Update window content and data in `src/constants/index.js`.
- Adjust styles in `src/index.css` or component-level styles.
- Replace images and icons in `public/` for personal branding.

## Scripts

- `npm run dev` — Start the dev server.
- `npm run build` — Build for production.
- `npm run preview` — Preview the production build.
- `npm run lint` — Run ESLint.

## PWA and iOS
If the home screen icon doesn’t update on iOS, delete the shortcut and clear Safari website data/cache, then add again.

## License

MIT
