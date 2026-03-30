# 📅 Future Steps: Level Integration

This file tracks the required actions for when the high-quality assets for **Levels 1, 2, 3, 4, and 5** are ready for deployment.

## 🛠️ Integration Checklist
- [ ] **Asset Migration**: Copy the `Work Book`, `Student Book`, and `Teacher Guide` HTML/Asset folders into `Everybody up_Flipbooks_3rd Edition/Level X/`.
- [ ] **Link Verification**: Ensure the relative paths in the new HTML files correctly point to their local images/scripts (fix the watermark if necessary).
- [ ] **UI Update**:
    - [ ] Update `index.html` `booksData` object to include the new levels.
    - [ ] Add the corresponding icons and labels to the selector screen.
- [ ] **Sanity Check**: Verify that the password wall correctly protects the new levels.
- [ ] **Deployment**: Run `npx netlify-cli deploy --prod` to push new assets.

## 💡 Technical Notes
- **Watermark Removal**: Remember to apply the watermark removal script/logic if the new exports contain the "Flip PDF Plus" overlay.
- **Pathing**: Maintain the exact folder structure currently used by Level 0 to avoid breaking logic.
- **Scaling**: As levels increase, consider adding a "Search" or "Filter" bar if the number of books becomes overwhelming (though for 5 levels it should be fine).
