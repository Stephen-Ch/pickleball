# LearnPickle

[![CI](https://github.com/Stephen-Ch/pickleball/actions/workflows/ci.yml/badge.svg)](https://github.com/Stephen-Ch/pickleball/actions/workflows/ci.yml)

**Learn pickleball rules and improve your game through interactive lessons, practice scenarios, and quizzes.**

## ✨ Features

- 🎮 **Nintendo-inspired Design** - Retro gaming aesthetics with gradients and bold colors
- 📱 **Mobile-First Experience** - Touch-optimized interface designed for smartphones and tablets
- 🚀 **Offline PWA** - Full Progressive Web App with offline functionality, installable on any device
- 🏓 **Interactive Arcade Mode** - Pong-style mini-game with rally call system
- 📚 **Comprehensive Rules** - Complete pickleball rulebook with searchable content
- 🎯 **Practice Scenarios** - Guided practice sessions for skill development
- ❓ **Knowledge Quizzes** - Test your understanding with interactive challenges
- 🏆 **Rally Call System** - Educational feedback after each rally with explanations

## 🚀 Quick Start

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 🔍 Testing PWA & Service Worker

To test the offline PWA functionality and service worker:

1. **Build production version**:
   ```bash
   npm run build
   ```

2. **Serve with HTTP server**:
   ```bash
   npx http-server ./dist/learn-pickle/browser -p 4201
   ```

3. **Open browser** and navigate to `http://localhost:4201`

4. **Test offline mode**:
   - Open DevTools → Application → Service Workers
   - Check "Offline" checkbox
   - Reload the page
   - Verify app works offline with cached content

5. **Install as PWA**:
   - Look for browser install prompt, or
   - DevTools → Application → Manifest → "Install" button

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
