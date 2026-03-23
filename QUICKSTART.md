# 🍓 Birthday Party Website - Quick Start Guide

Your Next.js birthday party website is **ready to run**!

## 🚀 Getting Started

### 1. **Start Development Server**
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) in your browser
- The server will auto-reload when you make changes
- Press `Ctrl+C` to stop the server

### 2. **Build for Production**
```bash
npm run build
npm start
```

---

## 📝 Customizing for Different Children

The entire website is driven by a single JSON configuration file. **No code changes needed!**

### Edit `data/config.json`

Change any of these fields to instantly update your website:

```json
{
  "child": {
    "name": "Emma",           // First name (used in navigation)
    "fullName": "Emma Grace", // Full name (used in About section)
    "age": 8,
    "birthDate": "2017-04-12",
    "zodiac": "Aries",
    "emoji": "🍓",
    "colors": ["#e8243c", "#ff6b8a", "#ffd6e0"]
  },
  "party": {
    "date": "April 12, 2025",
    "time": "3:00 PM - 6:00 PM",
    "venue": "Strawberry Fields Park",
    "address": "123 Berry Lane, Garden City, CA 90001",
    "mapUrl": "https://www.google.com/maps/embed?pb=...",
    "dressCode": "Strawberry red or green",
    "activities": ["Face Painting", "Bouncy Castle", "Photo Booth", "Games & Prizes"]
  },
  "hero": {
    "subtitle": "A Strawberry Celebration",
    "CTA1": "RSVP Now",
    "CTA2": "Celebrate",
    "photo": "https://images.unsplash.com/photo-..."
  }
  // ... and more fields
}
```

**Simply update the values and save** — everything on the website updates automatically!

---

## 📁 Project Structure

```
birthday/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page (all sections)
├── components/            # React components
│   ├── Navbar.tsx
│   ├── Hero.tsx           # With countdown timer
│   ├── About.tsx          # With animated counters
│   ├── Gallery.tsx        # With lightbox
│   ├── Details.tsx        # With Google Maps
│   ├── RSVP.tsx           # Form with validation
│   ├── Treats.tsx         # Menu cards
│   ├── Footer.tsx
│   └── Utils.tsx          # Animations (Wave, Confetti, Hearts, Rain)
├── styles/                # CSS Modules
│   ├── globals.css        # CSS variables & reset
│   └── [Component].module.css
├── data/
│   └── config.json        # All child/party data (EDIT THIS!)
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md              # Full documentation
```

---

## 🎨 Color Theme

All colors are defined as CSS variables in `styles/globals.css`. Change them here:

```css
:root {
  --red: #e8243c;
  --dark-red: #8c001a;
  --pink: #ff6b8a;
  --green: #2ecc71;
  --yellow: #ffe566;
  --purple: #c77dff;
  --teal: #00b4d8;
  /* ... more colors */
}
```

---

## ⚡ Features

✅ **Countdown Timer** - Auto-calculates days/hours/minutes/seconds  
✅ **Confetti Animation** - Launches on page load and form submission  
✅ **Animated Counters** - Trigger when About section scrolls into view  
✅ **Gallery Lightbox** - Click images to zoom, navigate with prev/next  
✅ **Embedded Map** - Google Maps showing venue location  
✅ **RSVP Form** - Collects guest information with validation  
✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **Custom CSS** - No Tailwind, all modular CSS  
✅ **TypeScript** - Full type safety across all components  

---

## 🔧 Modifying Components

Each component is independent and fully customizable:

### Example: Edit Navbar
```typescript
// components/Navbar.tsx
export const Navbar = ({ childName }: { childName: string }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>🍓 {childName}'s Birthday</div>
      // ... links and buttons
    </nav>
  );
};
```

### Example: Edit Styling
```css
/* styles/Navbar.module.css */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 250, 245, 0.95);
  backdrops-filter: blur(10px);
  z-index: 1000;
}
```

---

## 📦 Adding Images

Replace image URLs in `data/config.json`:

```json
"hero": {
  "photo": "https://your-image-url.jpg"  // Change this
},
"gallery": [
  {
    "url": "https://your-image-url.jpg"
  }
]
```

**Image hosting options:**
- Use Unsplash: `https://images.unsplash.com/photo-...`
- Use Pexels: `https://images.pexels.com/...`
- Use your own server: `https://yourdomain.com/image.jpg`
- Upload to `/public` folder and use: `/image-name.jpg`

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Select your repo
4. Click "Deploy"
5. Done! Your site is live at `yourproject.vercel.app`

### Deploy to Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git" → Select your repo
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Click "Deploy"

### Deploy to your own server
```bash
npm run build
npm start
```
Then upload the `.next` folder and `public` folder to your server.

---

## 🐛 Troubleshooting

**Problem: Images not loading**
- Check the image URL is correct and publicly accessible
- Try using a different image hosting service

**Problem: Countdown not updating**
- Make sure `data/config.json` has correct `party.date` format: `"YYYY-MM-DD"`

**Problem: Form not submitting**
- Currently form data logs to browser console
- To save form data, you'll need to add a backend API route

**Problem: Styles not applying**
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`

---

## 📚 Learn More

- **React Docs**: https://react.dev
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Docs**: https://www.typescriptlang.org

For full documentation, see [README.md](README.md)

---

## 💡 Pro Tips

1. **Test on Mobile**: Use browser DevTools (F12) → Toggle Device Toolbar
2. **Edit config.json**: Use any text editor, save, and refresh browser
3. **Add New Sections**: Create new component, add to `app/page.tsx`, style with CSS module
4. **Personalize for Different Kids**: Just change `data/config.json`, deploy once!

---

**You're all set! 🎉 Happy birthday! 🍓**

Have questions? Check [README.md](README.md) for detailed documentation.
