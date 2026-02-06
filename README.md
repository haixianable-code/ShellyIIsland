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

## Deployment to Vercel

To set up continuous deployment with Vercel, follow these steps. This will automatically update your live application every time you push changes to your GitHub repository.

1.  **Push your project to GitHub:**
    Make sure your project code is in a GitHub repository.

2.  **Sign up/Log in to Vercel:**
    Go to [vercel.com](https://vercel.com/) and create an account. It's recommended to sign up using your GitHub account for seamless integration.

3.  **Create a New Project:**
    - On your Vercel dashboard, click "Add New..." and select "Project".
    - Import your project's GitHub repository.

4.  **Configure the Project:**
    - Vercel will automatically detect that this is a **Vite** project and configure the build settings correctly. You shouldn't need to change anything for the "Framework Preset", "Build Command" (`npm run build`), or "Output Directory" (`dist`).
    - **Important:** If you are using Supabase, you must add your environment variables. Go to the "Environment Variables" section in your project settings on Vercel and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with their corresponding values from your `.env.local` file.

5.  **Deploy:**
    Click the "Deploy" button. Vercel will build and deploy your application.

6.  **Enjoy Automatic Deployments:**
    Now, every time you push a change to your main branch on GitHub, Vercel will automatically trigger a new deployment. Your workflow will be:
    ```bash
    # Make your changes
    git add .
    git commit -m "A description of your changes"
    git push
    ```
    Vercel will take care of the rest, and your live site will be updated shortly!
