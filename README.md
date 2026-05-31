# ResumeCraft Pro

An AI-powered resume builder with real-time preview, multiple premium templates, full design customization, and instant PDF export.

## Features

- **6 Premium Templates** — Modern, Classic, Minimal, Executive, Creative, Technical
- **Real-time Preview** — See changes reflected instantly as you type
- **Full Customization** — Fonts, colors, spacing, section ordering via drag-and-drop
- **PDF Export** — One-click high-quality PDF generation
- **Local Storage** — All data saved in-browser, no account required
- **Dark / Light Mode** — System-aware theme switching
- **Responsive Design** — Works on desktop, tablet, and mobile

## Tech Stack

- **React 19** + TypeScript
- **Vite 7** — build tool
- **TanStack Router v1** — file-based routing
- **TanStack Query v5** — async state management
- **Tailwind CSS v4** + shadcn/ui
- **Zustand** — client state (persisted to localStorage)
- **Framer Motion** — animations
- **jsPDF + html2canvas** — PDF export

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Other commands:

```bash
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint
npm run format   # Prettier
```

---

## Deploy to Vercel

### Option 1 — Vercel Dashboard (recommended)

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Vite. Leave all defaults as-is.
4. Click **Deploy**.

`vercel.json` is already configured to rewrite all paths to `index.html` for client-side routing.

### Option 2 — Vercel CLI

```bash
npm i -g vercel
vercel        # follow prompts, deploys to preview URL
vercel --prod # promote to production
```

---

## Deploy to GitHub Pages

1. Install the gh-pages package:

```bash
npm install --save-dev gh-pages
```

2. Add these scripts to `package.json`:

```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Add `base` to `vite.config.ts` matching your repo name:

```ts
base: "/resumecraft-pro/",
```

4. Run:

```bash
npm run deploy
```

> **Note:** GitHub Pages requires hash-based routing or a 404.html redirect trick for deep links. For cleaner URLs, Vercel is the recommended deployment target.

---

## Project Structure

```
src/
├── components/        # Shared UI components + shadcn/ui primitives
├── hooks/             # Custom React hooks
├── lib/               # Types, utilities, default data
├── routes/            # TanStack Router file-based routes
│   ├── __root.tsx     # Root layout (theme, query client, toaster)
│   ├── index.tsx      # Landing page
│   ├── dashboard.tsx  # Resume list
│   ├── builder.$id.tsx# Resume editor
│   ├── privacy.tsx
│   └── terms.tsx
└── store/             # Zustand stores (resume data, theme)
```

---

## Environment Variables

No environment variables are required. The app is fully client-side.

To add public variables (e.g. analytics), prefix them with `VITE_` in a `.env` file:

```
VITE_GA_ID=G-XXXXXXXXXX
```

---

## License

MIT
