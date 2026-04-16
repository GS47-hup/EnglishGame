# 01. Global Setup Guide

This guide details how to run the various applications within the English Review Game Monorepo locally.

---

## 🎮 Running the Core Game & Dashboards

Because the core game uses JavaScript `fetch()` to load the `questions.json` file and utilize the Web Speech API, opening `index.html` directly from your file system (via `file://`) will often trigger CORS (Cross-Origin Resource Sharing) security errors in modern browsers.

You must run a local server.

### Method 1: The Windows Launcher (Recommended)
Simply double-click the `start_game.bat` file in the root directory. 
This will automatically start a Python HTTP server and open your default web browser to the correct `localhost` address.

### Method 2: Manual Python Server
If you are on Mac/Linux or prefer the terminal:
1. Open your terminal in the repository root.
2. Run: `python start_server.py`
3. Open your browser and navigate to `http://localhost:8000`

---

## 📚 Running the Flipbook Portal

The Flipbook Portal (`Flipbook_Portal/index.html`) is currently designed as a pure, static HTML/JS file without external JSON dependencies (its data is hardcoded in the JS).

You can simply **double-click** the `Flipbook_Portal/index.html` file to open it directly in your browser without needing a server.

---

## ☁️ Deployment

The entire repository (and its sub-apps) are deployed via **Netlify**. 

### Deploying the Core Apps & Exams
Run the standard Netlify CLI command from the root:
```bash
npx netlify-cli deploy --prod
```

### Deploying the Flipbook Assets (Dual-Track Strategy)
Because the `Everybody up_Flipbooks_3rd Edition/` folder is gigabytes in size, it is `.gitignore`d to prevent GitHub from crashing.
When you need to update the heavy book files on the server:
1. Open the Netlify Dashboard.
2. Go to Deploys -> Drag & Drop.
3. Drag the `Flipbook_Portal/index.html` AND the `Everybody up_Flipbooks...` folder into the upload box manually to bypass GitHub storage limits.
