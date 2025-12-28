# Prophet.ai Deployment Guide

Your application is ready for deployment! Here are the simple steps for the two best options.

## Option 1: Cloudflare Pages (Recommended - Free & Fast)

1. **Push Code**: Ensure your latest code is pushed to GitHub (I have already done this).
2. **Go to Cloudflare**: Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
3. **Create Application**:
    * Go to **Compute (Workers & Pages)** > **Create Application** > **Pages** > **Connect to Git**.
    * Select your repository: `luckylife`.
4. **Configuration**:
    * **Project Name**: `prophet-ai` (or your choice).
    * **Production Branch**: `main`.
    * **Framework Preset**: Select **Vite**.
    * **Root directory**: `prophet.ai` (Important! Check this setting).
    * **Build command**: `npm run build` (Default).
    * **Build output directory**: `dist` (Default).
5. **Environment Variables**:
    * Add variable: `VITE_API_KEY`
    * Value: `YOUR_API_KEY_HERE`
6. **Deploy**: Click **Save and Deploy**.

## Option 2: Docker / Google Cloud Run

If you prefer to run it in a container:

1. **Build Docker Image**:

    ```bash
    docker build -t prophet-ai .
    ```

2. **Run Locally**:

    ```bash
    docker run -p 8080:80 prophet-ai
    ```
