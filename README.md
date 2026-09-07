# BuildPath - Autonomous Portfolio & Project Engine

BuildPath continuously scrapes and indexes real-world developer friction across GitHub, Reddit, and StackOverflow. It generates actionable 4-week execution roadmaps, task breakdowns, and architecture specifications using Gemini 2.5 Flash.

---

## Prerequisites

- **Node.js**: `v18+` or `v20+` recommended
- **npm**: `v9+` or `v10+`
- **Gemini API Key**: Get a free API key from [Google AI Studio](https://aistudio.google.com/)

---

## Setup & Installation Instructions

### 1. Clone or Extract the Project

Extract the repository files into your local project directory.

### 2. Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Set your Gemini API key in `.env`:

```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

---

## Running the Application

### Development Mode

To start the local Express + Vite dev server with Hot Reload support:

```bash
npm run dev
```

The application will be accessible at:
[http://localhost:3000](http://localhost:3000)

### Production Build & Run

To build the optimized client bundle and bundle the server for production:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm run start
   ```

The production server will listen on port `3000` by default.

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the server in development mode using `tsx` on port 3000 |
| `npm run build` | Builds Vite client assets and bundles `server.ts` into `dist/server.cjs` |
| `npm run start` | Executes the production CommonJS server build |
| `npm run lint` | Runs TypeScript type checking without emitting files |
| `npm run clean` | Removes build output directories (`dist`) |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Express (Node.js)
- **AI Integration**: `@google/genai` (Gemini 2.5 Flash)
- **Build Tooling**: Vite, esbuild, tsx
