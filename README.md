# Murari Kumar — 3D Cinematic Developer Portfolio 🌍✨

A premium, interactive 3D developer portfolio website built for **Murari Kumar**, Diploma Student in Computer Science and Engineering (CSE), Web Developer, and AI Product Builder.

Features an immersive low-poly miniature world with layered purple and indigo mountains, stylized pine trees, winding roads, a coral-colored camper van, an AI crystal station for **Nexora AI**, agricultural terraces for **CropIndia AI**, animated cyclists, drifting clouds, glowing fireflies, cinematic GSAP camera flight, and native Web Audio atmosphere.

---

## 🌟 Key Features

1. **Pure Static Architecture (No Build Tools Required)**
   - No Node.js, npm, Vite, webpack, or terminal commands needed.
   - Works straight out of the box in any modern browser.
   - 100% compatible with free **GitHub Pages** hosting.

2. **Cinematic 3D Experience (Three.js)**
   - Procedurally generated low-poly miniature floating island with flat shading.
   - Soft directional sunlight, atmospheric depth fog, and soft real-time shadows.
   - Layered indigo and purple mountain peaks with snow caps.
   - Stylized pine trees, campfire with flickering point light, rocks, and a turning mountain windmill.
   - Coral-colored retro camper van with roof surfboard and luggage.
   - Animated cyclist riding along the winding road.
   - Puffy low-poly clouds drifting around the island and glowing ambient firefly particles.

3. **Cinematic Camera Transitions (GSAP)**
   - Smooth dual-coordinate camera position & target interpolation.
   - Prevents overlapping camera glitches.
   - 1-click preset navigation to:
     - 🌐 **World Overview** (Panoramic view of the entire island)
     - 👤 **About Me** (Campsite overlook)
     - ⚡ **Technical Skills** (Mountain windmill ridge)
     - 🚀 **Nexora AI** (Futuristic AI tech hub)
     - 🌾 **CropIndia AI** (Terraced agricultural orchard)
     - 🎓 **Education** (Academics view)
     - 📬 **Contact** (Roadside communication station)

4. **Dual 3D + 2D Interactive Hotspots**
   - 3D rotating diamond crystals with pulsing ground rings.
   - Real-time 2D glassmorphic badges dynamically projected to screen coordinates.
   - Full touch support on mobile devices without relying on mouse hover.

5. **Procedural Web Audio Engine**
   - Synthesizes chill ambient drone chords (Fmaj9 / lo-fi warmth) directly via the native browser `AudioContext`.
   - Generates UI clicks and camera whoosh sound effects on the fly.
   - **Zero external MP3 audio files needed** — no broken audio links or CORS restrictions!
   - Strict adherence to browser autoplay policies (starts only upon user consent).

6. **Responsive Glassmorphism UI**
   - High-contrast, clean typography using Google Fonts (*Outfit* and *JetBrains Mono*).
   - Slide-out project and detail panels.
   - Mobile hamburger drawer menu.
   - 1-click "Copy Email" feature with instant feedback.

---

## 📁 Project Structure

```text
murari-3d-portfolio/
│
├── index.html        # Main HTML structure, import maps, modals & templates
├── style.css         # Modern glassmorphism design system & responsive layout
├── main.js           # Three.js 3D world, GSAP camera animations & Web Audio
└── README.md         # Project documentation & beginner customization guide
```

---

## 🚀 How to Host on GitHub Pages (No Code or Terminal Needed)

1. Open your web browser and go to [github.com](https://github.com).
2. Log in and create a new repository named `murari-3d-portfolio` (set it to **Public**).
3. Click **Add file** &rarr; **Upload files**.
4. Drag and drop `index.html`, `style.css`, `main.js`, and `README.md` directly into GitHub.
5. Click **Commit changes**.
6. In your repository, click **Settings** &rarr; **Pages** (in the left sidebar).
7. Under **Build and deployment** &rarr; **Branch**, select `main` and folder `/(root)`, then click **Save**.
8. Wait 1–2 minutes, then refresh the page to see your live URL:
   `https://<your-username>.github.io/murari-3d-portfolio/`

---

## 🛠️ Quick Customization Guide

### 1. Update Contact Information & Links
Open `index.html` and search for `template-contact`:
- Replace `[your.email@example.com]` with your real email address.
- Replace `YOUR_GITHUB_USERNAME` with your real GitHub username.
- Replace `YOUR_LINKEDIN_PROFILE` with your real LinkedIn handle.

### 2. Update College / Education Details
Open `index.html` and search for `template-education`:
- Replace `[Your Polytechnic / College Name Here]` with your college name.
- Update the duration `[e.g., 2023 – 2026]`.

### 3. Update Projects & Links
Open `index.html` and search for `template-nexora`:
- Nexora AI live link is currently set to: `https://nexora-ai-webbuilder.vercel.app/`.
- Update the GitHub repository button link once your repository is public.

### 4. Change 3D World Colors
Open `main.js` and look at the top `CONFIG.colors` section:
```javascript
colors: {
  skyTop: 0x60a5fa,
  skyBottom: 0xc4b5fd,
  islandGrass: 0x22c55e,
  mountainFront: 0x7c3aed, // Purple peaks
  camperCoral: 0xff6b6b   // Camper van body color
}
```
You can adjust any hex color values to your preference!

---

## 📜 Credits & License

- Designed and Developed for **Murari Kumar** (Diploma in Computer Science & Engineering).
- Libraries: [Three.js](https://threejs.org/) (MIT) & [GSAP](https://greensock.com/gsap/) (Standard).
