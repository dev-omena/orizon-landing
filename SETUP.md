# Setup & Development Guide

Complete guide for setting up the Orizon Landing Page development environment and workflow.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development Workflow](#development-workflow)
- [Project Configuration](#project-configuration)
- [Environment Setup](#environment-setup)
- [IDE Setup](#ide-setup)
- [Troubleshooting](#troubleshooting)
- [Development Tools](#development-tools)

---

## Prerequisites

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version  # Should show v18.x.x or higher
     npm --version   # Should show 9.x.x or higher
     ```

2. **Git** (Latest version)
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation:
     ```bash
     git --version
     ```

3. **Code Editor**
   - Recommended: [Visual Studio Code](https://code.visualstudio.com/)
   - Alternative: WebStorm, Sublime Text, or any modern editor

### Optional but Recommended

- **pnpm** or **yarn** (faster package managers)
  ```bash
  npm install -g pnpm
  # or
  npm install -g yarn
  ```

- **Git GUI Client**
  - GitHub Desktop
  - GitKraken
  - SourceTree

---

## Installation

### 1. Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/yourusername/orizon-landing.git

# Or using SSH
git clone git@github.com:yourusername/orizon-landing.git

# Navigate to project directory
cd orizon-landing/landing
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm (faster)
pnpm install

# Or using yarn
yarn install
```

This will install all dependencies defined in [package.json](package.json):
- Next.js 14.0.4
- React 18.3.1
- TypeScript 5.3.3
- GSAP 3.13.0
- Three.js 0.180.0
- Tailwind CSS 3.4.0
- And all other dependencies

**Expected output:**
```
added 328 packages, and audited 329 packages in 45s

110 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### 3. Verify Installation

```bash
# Run development server
npm run dev
```

**Expected output:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see:
1. Loading screen with Orizon logo (800ms)
2. Header with console animation
3. Interactive wave animation
4. Full landing page content

---

## Development Workflow

### Starting Development Server

```bash
npm run dev
```

**Features:**
- Hot module replacement (HMR)
- Fast refresh for React components
- Automatic TypeScript compilation
- Error overlay in browser

**Server Configuration:**
- Default port: 3000
- Change port: `npm run dev -- -p 3001`
- Network access: `npm run dev -- -H 0.0.0.0`

### Building for Production

```bash
# Create optimized production build
npm run build
```

**Build Output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB          142 kB
└ ○ /_not-found                          871 B          87.1 kB

○  (Static)  prerendered as static HTML
```

**Build includes:**
- Minified JavaScript bundles
- Optimized images (AVIF, WebP)
- CSS optimization
- Console removal
- Tree shaking

### Running Production Build Locally

```bash
# Start production server
npm start
```

**Note:** Always run `npm run build` before `npm start`

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

**Lint Configuration:**
- Extends Next.js recommended rules
- TypeScript-aware linting
- Configured in `.eslintrc.json`

---

## Project Configuration

### Next.js Configuration

**File:** [next.config.js](next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Remove console in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimize package imports
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap'],
  },
};

module.exports = nextConfig;
```

**Key Settings:**
- Image optimization enabled
- Console logs removed in production
- Package import optimization for lucide-react and gsap

### TypeScript Configuration

**File:** [tsconfig.json](tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Important Settings:**
- Strict mode enabled
- Path aliases: `@/*` maps to `src/*`
- ES6 target for modern JavaScript

### Tailwind Configuration

**File:** [tailwind.config.js](tailwind.config.js)

```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#272860',
        secondary: '#f8e800',
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

**Custom Configuration:**
- Brand colors (primary, secondary)
- 16-column grid system
- Custom animations

### PostCSS Configuration

**File:** [postcss.config.js](postcss.config.js)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### shadcn/ui Configuration

**File:** [components.json](components.json)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Environment Setup

### Environment Variables

Currently, no environment variables are configured. For future needs:

**Create `.env.local`:**
```bash
# API Keys
NEXT_PUBLIC_API_URL=https://api.example.com

# Analytics
NEXT_PUBLIC_GA_ID=UA-XXXXXXXXX-X

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

**Usage in code:**
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

**Important:**
- Prefix with `NEXT_PUBLIC_` for client-side access
- Never commit `.env.local` to version control
- Add `.env.local` to `.gitignore`

### Git Configuration

**File:** [.gitignore](.gitignore)

```
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
```

---

## IDE Setup

### Visual Studio Code

#### Recommended Extensions

Install these extensions for the best development experience:

1. **ES7+ React/Redux/React-Native snippets**
   - ID: `dsznajder.es7-react-js-snippets`
   - Provides React code snippets

2. **Tailwind CSS IntelliSense**
   - ID: `bradlc.vscode-tailwindcss`
   - Autocomplete for Tailwind classes

3. **ESLint**
   - ID: `dbaeumer.vscode-eslint`
   - Real-time linting

4. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`
   - Code formatting

5. **TypeScript Error Translator**
   - ID: `mattpocock.ts-error-translator`
   - Easier-to-understand TypeScript errors

6. **GitLens**
   - ID: `eamodio.gitlens`
   - Enhanced Git capabilities

7. **Auto Rename Tag**
   - ID: `formulahendry.auto-rename-tag`
   - Automatically rename paired HTML/JSX tags

#### VSCode Settings

**Create `.vscode/settings.json`:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

**Benefits:**
- Auto-format on save
- Auto-fix ESLint errors
- Tailwind IntelliSense in `cn()` function

#### VSCode Snippets

**Create `.vscode/snippets.code-snippets`:**

```json
{
  "Client Component": {
    "prefix": "ccomp",
    "body": [
      "'use client';",
      "",
      "import { useEffect, useRef } from 'react';",
      "",
      "export default function ${1:ComponentName}() {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "}"
    ]
  },
  "GSAP Effect": {
    "prefix": "gsapeffect",
    "body": [
      "useEffect(() => {",
      "  gsap.registerPlugin(ScrollTrigger);",
      "",
      "  const tl = gsap.timeline();",
      "  $0",
      "",
      "  return () => {",
      "    tl.kill();",
      "    ScrollTrigger.getAll().forEach(st => st.kill());",
      "  };",
      "}, []);"
    ]
  }
}
```

---

## Development Tools

### Browser DevTools

#### Recommended Extensions

1. **React Developer Tools**
   - Chrome: [Install](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - Firefox: [Install](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

2. **Redux DevTools** (if adding Redux)
   - Chrome: [Install](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

#### Performance Profiling

```bash
# Build with profiling enabled
npm run build -- --profile

# Analyze bundle
npm install -g @next/bundle-analyzer
```

### Debugging

#### Browser Debugging

1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in source files
4. Use debugger statement in code:

```typescript
useEffect(() => {
  debugger;  // Execution will pause here
  // ... code
}, []);
```

#### VSCode Debugging

**Create `.vscode/launch.json`:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Git Workflow

#### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/new-animation

# Make changes and commit
git add .
git commit -m "Add new animation to hero section"

# Push to remote
git push origin feature/new-animation

# Create pull request on GitHub
```

#### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
git commit -m "feat(animations): add wave interaction effect"
git commit -m "fix(header): resolve console animation bug"
git commit -m "docs: update component documentation"
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

#### 2. Module Not Found

**Error:**
```
Module not found: Can't resolve '@/components/MyComponent'
```

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or
npm run build -- --no-cache
```

#### 3. TypeScript Errors

**Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Solution:**
```bash
# Restart TypeScript server in VSCode
# Press Ctrl+Shift+P
# Type: TypeScript: Restart TS Server

# Or clear TypeScript cache
rm -rf .next
npm run dev
```

#### 4. GSAP Animation Not Working

**Error:**
Animations not triggering or console errors about ScrollTrigger

**Solution:**
```typescript
// Ensure GSAP is registered
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Ensure cleanup
useEffect(() => {
  // ... animations

  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}, []);
```

#### 5. Canvas Not Rendering

**Error:**
Blank canvas or "Cannot read properties of null"

**Solution:**
```typescript
const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(() => {
  if (!canvasRef.current) return;  // Guard clause

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ... canvas logic
}, []);
```

#### 6. Hydration Errors

**Error:**
```
Hydration failed because the initial UI does not match what was rendered on the server
```

**Solution:**
```typescript
// Use dynamic import with ssr: false
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { ssr: false }
);
```

#### 7. Images Not Loading

**Error:**
404 errors for images in public folder

**Solution:**
```typescript
// Correct path (no /public prefix)
<img src="/image.png" alt="Image" />

// Using Next Image
import Image from 'next/image';

<Image
  src="/image.png"
  alt="Image"
  width={500}
  height={300}
/>
```

### Getting Help

1. **Check Documentation**
   - [README.md](README.md) - Project overview
   - [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details
   - [COMPONENTS.md](COMPONENTS.md) - Component reference

2. **Search Issues**
   - Check GitHub Issues for similar problems
   - Search Next.js documentation

3. **Ask for Help**
   - Create GitHub issue with:
     - Steps to reproduce
     - Expected behavior
     - Actual behavior
     - Environment details (OS, Node version, etc.)

4. **Useful Resources**
   - [Next.js Docs](https://nextjs.org/docs)
   - [React Docs](https://react.dev)
   - [GSAP Docs](https://greensock.com/docs/)
   - [Three.js Docs](https://threejs.org/docs/)
   - [Tailwind Docs](https://tailwindcss.com/docs)

---

## Performance Monitoring

### Lighthouse

```bash
# Run Lighthouse audit
npm run build
npm start

# Open http://localhost:3000 in Chrome
# Press F12 > Lighthouse tab > Generate report
```

**Target Scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

### Bundle Analysis

```bash
# Install analyzer
npm install -g @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

---

## Next Steps

After setup, you can:

1. **Explore the codebase** - Start with [src/app/page.tsx](src/app/page.tsx)
2. **Read component docs** - See [COMPONENTS.md](COMPONENTS.md)
3. **Make changes** - Edit a component and see hot reload
4. **Run build** - Test production build
5. **Deploy** - See [DEPLOYMENT.md](DEPLOYMENT.md)

Happy coding!
