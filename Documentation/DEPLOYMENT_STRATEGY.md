# 🚀 SpokenEnglish Academy Deployment Strategy

Due to the massive size of the interactive Flipbooks (4GB+), we cannot push everything through GitHub (GitHub has a 100MB strict file size limit and a repository soft limit of 1GB). To solve this, we use the **Dual-Track Deployment Strategy**:

## 🛤️ What is Dual-Track?
- **Track 1 (Version Control): GitHub**
  We use `git commit` and `git push` to save our code (HTML, CSS, JS, Markdown). We ignore (`.gitignore`) the heavy flipbooks folder so our repository stays tiny and lightning-fast.
- **Track 2 (Live Hosting): Netlify CLI**
  We use a terminal command to push the Code + the Heavy Flipbooks directly to the live server together.

## 🛠️ The Ultimate Deployment Command
Whenever you are ready to make changes live (whether you changed code, added new backend functions, or added new flipbooks), simply run this command in your Cursor terminal:

```bash
npx netlify deploy --dir . --prod
```

### What this command does:
1. It looks at your current folder (`.`).
2. It detects the `netlify.toml` configuration we just set up, which tells it to bundle your backend serverless functions from `_netlify_backup/functions/`.
3. It bundles the 4GB+ Flipbooks folder because it is NOT ignored in `.netlifyignore`.
4. It safely uploads only the files that changed to the live Netlify production environment (`--prod`).

## ⚙️ What we just automated
You no longer have to manually drag-and-drop the functions folder! 
We created a `netlify.toml` file at the root of the project:
```toml
[build]
  functions = "_netlify_backup/functions"
  publish = "."
```
This serves as the blueprint for Netlify. Every time you run the deployment command above, Netlify instantly knows exactly where to find your backend database connections (like `submit-level2-exam.js`) without you having to point to them.

## 🔄 Daily Workflow Habit
When you finish a coding session:
1. **Save to GitHub (Backup code):**
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push
   ```
2. **Push to Live (Deploy code + functions + books):**
   ```bash
   npx netlify deploy --prod
   ```
