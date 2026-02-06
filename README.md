# Shelly Spanish Island

A sophisticated Spanish vocabulary review application with AI-powered context generation and progress tracking.

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```

## Supabase Configuration (Optional)

This app supports Supabase for authentication and data sync. If you do not provide these credentials, the app will run in **Offline Mode** using LocalStorage.

1.  Create a file named `.env.local` in the root directory.
2.  Add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

3.  Restart the dev server (`npm run dev`) for changes to take effect.
