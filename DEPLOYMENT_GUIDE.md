# 🚀 SAGE Content Hub Deployment Guide

This guide ensures you can deploy **4GB+ of educational flipped books** to Netlify safely, bypassing GitHub's storage limits using the **Dual-Track Deployment Strategy**.

---

## 🏗️ The Strategy: Dual-Track
To keep your project lean and professional, we split the content:
1.  **Code (GitHub Track)**: Login page, Master Portal, and core logic. (< 1MB)
2.  **Assets (Manual Track)**: The heavy flipbooks folder. (approx. 4GB)

---

## 📤 Part 1: Push the "Brain" (GitHub)
Since we added `.gitignore` rules, GitHub will only see your HTML, CSS, and JS.
1.  Open your terminal in Cursor.
2.  Run these commands:
    ```bash
    git add .
    git commit -m "feat: Upgrade to Triple-Toggle Master Portal architecture"
    git push origin main
    ```
3.  **Result**: Your Netlify site will automatically build the login screen from your code.

---

## 📂 Part 2: Upload the "Books" (Netlify Manual)
This is the "Secret Sauce" to bypass the 100MB GitHub limit.

1.  Log in to your **Netlify Dashboard**.
2.  Go to the **"Deploys"** tab for your site.
3.  Scroll to the bottom where you see **"Need to update your site? Drag and drop your site folder here."**
4.  **CRITICAL STEP**:
    *   On your computer, select **BOTH** the `index.html` file AND the `Everybody up_Flipbooks_3rd Edition` folder.
    *   Drag them **together** into the box.
5.  **Result**: Netlify will combine your code from GitHub with the heavy assets you just dropped in. This site will now be functional and complete!

---

## 🛡️ Part 3: Adding New Levels Later
When you get Level 1, Level 2, etc.:
1.  Add the new folders inside `Everybody up_Flipbooks_3rd Edition/`.
2.  Inject the **Gatekeeper Script** into their entry-point `.html` files.
3.  Update the `BOOKS` array in `index.html` to set `ready: true`.
4.  Repeat the **Manual Drop** (Part 2) to upload the updated assets.

---

## ✅ Final Verification
Once deployed, check your live URL:
- [ ] Visit `https://your-site.netlify.app/`
- [ ] Log in with `Academy2026`
- [ ] Toggle to "Teacher Guides"
- [ ] Open "Starter"
- [ ] **Check the URL**: It should look like `your-site.netlify.app/Everybody up_Flipbooks_3rd Edition/.../Lvl 0 Teacher Guide.html`

---
**SAGE Academy Technical Support** 🎓🛡️
