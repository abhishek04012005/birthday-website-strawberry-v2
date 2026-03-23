# Birthday Party Website - Next.js

A beautiful, fully customizable birthday party website built with **Next.js**, **React**, and **custom CSS** (no Tailwind CSS). All content is controlled via JSON configuration, making it easy to adapt for any birthday child.

## 🎉 Features

- ✅ **100% Custom CSS** - No Tailwind or utility frameworks
- ✅ **JSON-Based Configuration** - Change all content in one file
- ✅ **Modular Components** - Each section is a reusable React component
- ✅ **Fully Responsive** - Works on mobile, tablet, and desktop
- ✅ **Interactive Elements**:
  - Countdown timer
  - Animated counters for fun facts
  - Photo gallery with lightbox
  - RSVP form with confetti celebration
  - Smooth animations throughout
- ✅ **TypeScript Support**
- ✅ **Easy to Customize** - Change child name, dates, colors, and all content from `data/config.json`

## 📁 Project Structure

```
birthday/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Hero.tsx            # Hero section with countdown
│   ├── About.tsx           # About section with fun facts
│   ├── Gallery.tsx         # Photo gallery
│   ├── Details.tsx         # Event details & map
│   ├── RSVP.tsx            # RSVP form
│   ├── Treats.tsx          # Menu/treats section
│   ├── Footer.tsx          # Footer
│   └── Utils.tsx           # Helper components (waves, confetti, etc)
├── styles/
│   ├── globals.css         # Root CSS variables
│   ├── Navbar.module.css   # Component styles
│   ├── Hero.module.css
│   ├── About.module.css
│   ├── Gallery.module.css
│   ├── Details.module.css
│   ├── RSVP.module.css
│   ├── Treats.module.css
│   ├── Footer.module.css
│   └── Utils.module.css
├── data/
│   └── config.json         # ALL CONTENT & CONFIGURATION
├── public/                 # Static files
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### 3. Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization Guide

All content is configured in **`data/config.json`**. Here's what you can customize:

### Basic Child Information

```json
{
  "child": {
    "name": "Emma",
    "fullName": "Emma Rose",
    "age": 5,
    "birthDate": "2020-04-12",
    "emoji": "🍓"
  }
}
```

### Party Details

```json
{
  "party": {
    "date": "2025-04-12",
    "time": "3:00 PM - 6:00 PM",
    "venue": "Strawberry Garden Hall",
    "address": "42 Blossom Lane, Central Park, New York, NY 10024",
    "dressCode": "Wear your pinkest outfit!"
  }
}
```

### Fun Facts (About Section)

Add or modify facts to show different statistics:

```json
{
  "facts": [
    {
      "id": "chocolates",
      "icon": "🍫",
      "label": "Lifetime Chocolates Eaten",
      "number": "1247",
      "unit": "pcs",
      "description": "And she remembers...",
      "barWidth": 88,
      "colorClass": "fc-red"
    }
  ]
}
```

### Treats/Menu

```json
{
  "treats": [
    {
      "emoji": "🎂",
      "name": "Strawberry Dream Cake",
      "description": "Three-tiered masterpiece...",
      "image": "https://images.unsplash.com/...",
      "tag": "⭐ Star of the Show"
    }
  ]
}
```

### Gallery Images

```json
{
  "gallery": [
    {
      "url": "https://images.unsplash.com/...",
      "alt": "Birthday celebration",
      "badge": "🎂 Celebration!",
      "text": "🎂 Birthday Magic!"
    }
  ]
}
```

### Personality Tags

```json
{
  "personalityTags": [
    { "text": "🍓 Strawberry Addict", "emoji": "🍓" },
    { "text": "🌿 Nature Explorer", "emoji": "🌿" }
  ]
}
```

## 🎨 Styling & Colors

All colors are defined in `styles/globals.css` as CSS variables:

```css
:root {
  --red: #e8243c;
  --dark-red: #8c001a;
  --pink: #ff6b8a;
  --yellow: #ffe566;
  --green: #2ecc71;
  /* ... more colors ... */
}
```

To change the color scheme, update these variables. The theme is themed around strawberries (reds, pinks), but you can adapt it to any theme!

## 📝 Sections Overview

### 1. **Hero Section**
- Welcome message with countdown timer
- Child's photo with stickers
- Call-to-action buttons

### 2. **About Section**
- Child's portrait with name tag
- Fun facts with animated counters and progress bars
- Personality tags

### 3. **Gallery**
- Photo grid with different layouts
- Lightbox viewer
- Thumbnail strips

### 4. **Party Details**
- Date, time, venue information
- Dress code
- Embedded Google Map
- Activities list

### 5. **RSVP Section**
- Attendance options (Yes/No)
- Attendee form with validation
- Guest count tracker
- Success message with confetti

### 6. **Treats Menu**
- Food/drink items with ratings
- Images and descriptions
- Special tags

### 7. **Footer**
- Credits and event information
- Animated emoji decorations

## 🎭 Animations & Effects

- **Confetti** - Triggered on page load and when submitting RSVP
- **Floating rain emojis** - Falling strawberries, hearts, etc.
- **Animated counters** - Fun fact numbers count up when section scrolls into view
- **Bounce, fade & scale animations** - Throughout the design
- **Hover effects** - Buttons, cards, images

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- `960px` - Tablet/medium screens
- `600px` - Mobile screens

## 🔄 Adapting for Different Children

To quickly adapt for a different child:

1. **Edit `data/config.json`** with new child's information:
   - Name, age, birthdate
   - Party date, location
   - Photos
   - Personality traits
   - Any other customizable content

2. Update **component props** if needed (optional - most data comes from JSON)

3. Run `npm run build` and deploy

**That's it!** The entire website adapts automatically.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the `.next` folder to Netlify
```

### Deploy to Any Static Host

```bash
npm run build
# Deploy the `.next` folder with Node.js support
```

## 📦 Technologies Used

- **Next.js 16+** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **CSS Modules** - Component-scoped styling (no Tailwind)
- **Canvas API** - Confetti animation
- **Intersection Observer** - Scroll animations
- **Google Maps Embed** - Venue location

## 🎯 Tips & Best Practices

1. **Images**: Replace Unsplash URLs with your own images for better personalization
2. **Colors**: Customize CSS variables in `globals.css` to match the theme
3. **Fonts**: Google Fonts are embedded; change in your layout if desired
4. **Map**: Update the Google Maps iframe URL with the actual venue coordinates
5. **RSVP**: The form currently stores data locally; add a backend for persistence

## 📄 License

Feel free to use this template for any birthday party website!

## 🎉 Enjoy!

This website is designed to be fun, engaging, and easy to customize. Have a wonderful birthday celebration!
