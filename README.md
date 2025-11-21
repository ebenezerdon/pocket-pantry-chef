# Pocket Pantry Chef

Pocket Pantry Chef is a beautiful, private-by-design web app that turns your pantry into Nigerian dishes and native recipes from around the world. It builds smart shopping lists and generates recipes based on what you have, all in your browser using WebGPU. Built by [Teda.dev](https://teda.dev), the AI app builder for everyday problems.

## Features
- Generate Nigerian meals with one tap and instantly add ingredients to a shopping list
- Add your pantry items and get AI-crafted recipes that use what you already have
- Select a country to get a recipe native to that cuisine using your ingredients
- 100% client-side AI with WebLLM; no servers, no sign-in
- Data is saved to your device with localStorage

## Tech stack
- HTML5 + Tailwind CSS (CDN)
- jQuery 3.7.x
- WebLLM (Qwen3-4B-q4f16_1-MLC by default) via ESM CDN
- No build step; runs entirely in the browser

## Development
Just open index.html for the landing page or app.html for the main application. There is no build or server required.

Project structure:
- index.html: marketing landing page
- app.html: main application UI
- styles/main.css: custom CSS and animations
- scripts/helpers.js: utilities, storage, curated Nigerian recipes
- scripts/ai.js: minimal WebLLM wrapper (module)
- scripts/ui.js: UI rendering and event handlers
- scripts/main.js: app bootstrap
- assets/logo.svg: app logo

## Browser compatibility
- Requires a modern browser with WebGPU for AI features (Chrome/Edge 113+, Firefox 118+)
- If WebGPU is unavailable, the app will still let you manage pantry and shopping list; AI actions are disabled

## Privacy
All AI runs locally in your browser. Your ingredients and lists are stored with localStorage on your device only.
