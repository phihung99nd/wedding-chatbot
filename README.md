# Wedding Chatbot

A React-based wedding invitation chatbot with interactive chat UI, photo album, and background music.

## Tech Stack

- **React 18** with JSX
- **Vite 5** (dev server & build)
- **Tailwind CSS 3** (styling)
- **Framer Motion** (animations)

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Yarn](https://yarnpkg.com/) (v1 classic)

## Getting Started

```bash
# 1. Install dependencies
yarn install

# 2. Start the dev server
yarn dev
```

The app will be available at `http://localhost:5173` by default.

## Available Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `yarn dev`     | Start Vite dev server with HMR       |
| `yarn build`   | Build for production into `dist/`    |
| `yarn preview` | Preview the production build locally |

## Project Structure

```
src/
  components/       # React components (chat page, intro, message bubbles, etc.)
  data/             # Wedding data (event details, Q&A)
  assets/
    album/          # Photo album images
    audio/          # Background music
  App.jsx           # Root component
  main.jsx          # Entry point
  index.css         # Global styles + Tailwind directives
```
