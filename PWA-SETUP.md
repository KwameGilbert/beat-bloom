# EasyBeats PWA Setup Guide

## 🎯 What You Need to Do

### 1. Install Dependencies

Run this command in your terminal:

```bash
npm install -D vite-plugin-pwa
```

### 2. Create PWA Icons

You need to create two icon files in the `public/logo/` directory:

- **icon-192.png** (192x192 pixels)
- **icon-512.png** (512x512 pixels)

**Icon Requirements:**

- Use your EasyBeats logo
- Square format (192x192 and 512x512)
- PNG format
- Clear, recognizable design
- Works well on light and dark backgrounds

**Quick Way to Generate:**

1. Use your existing `favicon.png` as a base
2. Resize it to 192x192 and 512x512 using an online tool like:
   - https://www.iloveimg.com/resize-image
   - Or use Photoshop/Figma

### 3. Test Your PWA

After installing the plugin and creating icons:

```bash
npm run build
npm run preview
```

Then:

1. Open Chrome/Edge browser
2. Navigate to your preview URL (usually http://localhost:4173)
3. Look for the **install icon** in the address bar
4. Click "Install" to add EasyBeats to your home screen

### 4. What You Get

✅ **Offline Support**: App works without internet (cached assets)
✅ **Installable**: Add to mobile home screen / desktop
✅ **App-Like**: Runs in standalone mode (no browser UI)
✅ **Auto-Updates**: Service worker auto-updates app
✅ **Image Caching**: Unsplash images cached for 30 days
✅ **Audio Caching**: Beat previews cached for 7 days
✅ **Fast Loading**: Assets served from cache

### 5. PWA Features Enabled

- ✨ Splash screen on mobile
- 🎨 Custom theme color (#f97316 - Orange)
- 📱 Portrait orientation lock
- 🔔 Notification support (ready for future)
- 💾 Offline fallback
- 🚀 Fast loading with service worker

### 6. Testing on Mobile

**Android:**

1. Open Chrome on your phone
2. Visit your deployed app URL
3. Tap the menu (⋮) → "Install app" or "Add to Home screen"

**iOS:**

1. Open Safari on iPhone
2. Visit your app
3. Tap Share button → "Add to Home Screen"

## 📝 Notes

- The manifest will be auto-generated at build time
- Service worker is registered automatically
- Icons must exist before building
- PWA only works over HTTPS (except localhost)

## 🐛 Troubleshooting

**"Cannot find module 'vite-plugin-pwa'"**
→ Run `npm install -D vite-plugin-pwa`

**Icons not showing**
→ Make sure `/public/logo/icon-192.png` and `/public/logo/icon-512.png` exist

**App not installable**
→ Check browser console for manifest errors
→ Ensure you're using HTTPS (or localhost)

---

**That's it!** Your EasyBeats app is now a fully functional PWA! 🎉
