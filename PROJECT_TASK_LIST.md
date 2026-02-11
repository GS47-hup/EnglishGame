# Project Task List (Level: Ultra-Detailed)
**Created Date:** 2026-02-11
**Objective:** Securely transition to a 14-book Professional Architecture.

## 1. PRE-EXECUTION SAFETY (Measure Twice)
- [x] **Lock GitHub Assets**: Add `Everybody up_Flipbooks_3rd Edition/` and `final result/` to `.gitignore`.
- [x] **Verify Silence**: Run `git status` to ensure 0 large files are being tracked.
- [x] **Untrack Folders**: Remove `final result` from Git index so `.gitignore` works.
- [x] **Backup Entry Point**: Verify root `index.html` contains the modern login UI before we touch anything else.

## 2. SECURITY & GATEKEEPING
- [x] **Extract Gatekeeper**: Copy the redirect script from the old flipbook to use in the new ones.
- [x] **Secure Student Book**: Inject the Access Check script into `Lvl 0 CourseBook.html`.
- [x] **Secure Workbook**: Inject the Access Check script into `Lvl 0 WorkBook.html`.
- [x] **Secure Teacher Guide**: Inject the Access Check script into `Lvl 0 Teacher Guide.html`.
- [x] **Test Security**: Try to open the files directly in a browser without logging in (it should kick you out).

## 3. MASTER PORTAL DEVELOPMENT
- [x] **UI Framework**: Set up the responsive 14-card grid (7 Rows x 2 Columns).
- [x] **State Management**: Implement the "Student / Workbook / Teacher Guide" triple toggle.
- [x] **Active Cards**: Build Level 0 (Starter) cards with functional links to 3rd Edition paths.
- [x] **Placeholder Cards**: Build Levels 1-6 with "Coming Soon" labels and disabled buttons.
- [x] **Styling**: Match the SAGE Academy premium aesthetic (glassmorphism/gradients).

## 4. CLEANUP & PATHING
- [x] **Asset Deletion**: Delete the outdated `final result/` folder entirely.
- [x] **Relative Path Check**: Verify that `Everybody up_Flipbooks_3rd Edition/...` links work from the root `index.html`.

## 5. DEPLOYMENT & HANDOVER
- [/] **Guide Creation**: Write `DEPLOYMENT_GUIDE.md` with "How to upload to Netlify without GitHub."
- [x] **GitHub Sync**: Push the new "Hub" code to GitHub (should be < 1MB).
- [/] **Live Verification**: Confirm the login screen appears on your Netlify URL.

## 6. FINAL VERIFICATION
- [ ] Login with `Academy2026`.
- [ ] Open Level 0 Student Book (Master Portal -> Course Book).
- [ ] Open Level 0 Workbook (Master Portal -> Work Book).
- [ ] Verify videos and flip animations play correctly.
