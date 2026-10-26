# Sharthi AI (सारथी AI)

> **AI-Native Browser & Autonomous Multimodal Companion Web App Using AdaL**

Sharthi AI is a web application combining an AI-native browser workspace with a real-time autonomous companion powered by AdaL (Adaptive Learning) and persistent memory sync with Supabase.

---

## 🚀 Running the Web App

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Supabase Database Integration

Sharthi AI works immediately out of the box using **local fallback memory**! When you're ready to sync with Supabase:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the SQL from [`supabase_schema.sql`](file:///Users/akashsharma/Desktop/Sharthi%20ai/supabase_schema.sql).
3. In Sharthi AI, click the **"Connect Supabase"** button in the top navigation bar.
4. Paste your **Project URL** and **Anon Key**, then click **Save Configuration**.

---

## 🏗️ Project Architecture

```
├── index.html                 # Web app entry point
├── vite.config.ts             # Vite + React + Tailwind v4 config
├── package.json               # Lightweight web dependencies
├── supabase_schema.sql        # pgvector & context memory tables
└── src/
    ├── main.tsx               # React root render
    ├── App.tsx                # Browser shell & multi-tab layout
    ├── index.css              # Tailwind CSS styles
    ├── components/
    │   ├── BrowserNav.tsx     # Omnibox, tabs, Supabase status pill
    │   ├── WebviewContainer.tsx # Web canvas & research hub
    │   ├── CompanionPane.tsx  # AdaL autonomous companion chat & actions
    │   └── SupabaseConfigModal.tsx # In-app credentials connector & SQL copy
    └── lib/
        ├── supabase.ts        # Client, live connection tester, fallback storage
        └── adalCompanion.ts   # AdaL reasoning engine & context synthesis
```
