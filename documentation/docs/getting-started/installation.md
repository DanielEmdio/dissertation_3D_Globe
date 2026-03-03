---
sidebar_position: 1
---

# Installation

## Prerequisites

| Requirement | Version |
|-------------|---------|
| [Node.js](https://nodejs.org/) | 20 or later |
| npm | bundled with Node.js |

## Clone the repository

```bash
git clone <repository-url>
cd dissertation_3D_Globe
```

## Install dependencies

The project has two independent packages: the **globe app** (Next.js) and this **documentation site** (Docusaurus). Install them separately.

```bash
# Globe app
cd globe-app
npm install

# Documentation (optional — only if you want to run docs locally)
cd ../documentation
npm install
```

## Run the development server

```bash
cd globe-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app loads a full-screen 3D globe. You will see a loading screen while the globe assets initialise — this takes a few seconds on the first load.

## Run the documentation site

```bash
cd documentation
npm start
```

The docs are served at [http://localhost:3001](http://localhost:3001) (Docusaurus auto-picks an available port if 3000 is already taken).

## Build for production

```bash
# Globe app
cd globe-app
npm run build
npm start          # preview the production build

# Documentation
cd documentation
npm run build      # outputs to documentation/build/
```

## Environment notes

- The globe relies on `react-globe.gl`, which uses **Three.js** and requires a browser environment. It is imported dynamically (`next/dynamic` with `ssr: false`) to avoid server-side rendering errors.
- Audio autoplay is gated by browser policy. Background music starts on first user interaction if autoplay is blocked.
- Seismic risk textures (`/public/textures/seismic-risk-map-*.png`) must exist for the coloured globe view. If a texture file is missing, the component falls back to the standard earth texture.
