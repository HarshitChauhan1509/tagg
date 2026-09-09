# Fashion AI MVP

> **"What are you wearing tonight?"**
> Your wardrobe, understood by AI.

A fully functional, zero-cost, camera-first fashion MVP. Built as an assignment for a CTO / Technical Co-Founder role, prioritizing modern UI/UX, Edge AI, and a believable product experience.

## 🚀 The Product Loop

1. **Sign Up**: Create a profile and define your aesthetic.
2. **Camera-First Wardrobe**: Scan your clothes using your phone's camera.
3. **Edge AI Analysis**: The app automatically identifies the clothing type, color, fit, and style using a zero-shot vision model.
4. **Digital Wardrobe**: View your completely digitized closet.
5. **"I'm going out tonight"**: Choose an occasion (Dinner, Date, Night Out, etc.).
6. **Outfit Recommendation**: Receive a styled outfit composed *only* of clothes you actually own, complete with AI reasoning.

## 🧠 Technical Architecture

This MVP was built under a strict **₹0 / $0 Budget Constraint** while remaining fully functional.

### 1. Zero-Cost Edge AI (Vision)
Instead of relying on paid cloud APIs (like OpenAI Vision or Google Cloud Vision), this app uses **WebAssembly (WASM)** to run Machine Learning models directly in the user's browser.
- **Model**: `Xenova/clip-vit-base-patch32` via Hugging Face.
- **Implementation**: Runs in a background Web Worker (`src/lib/ai/worker.ts`) using `@xenova/transformers`.
- **Why**: Guarantees $0 cloud inference costs, offers zero-latency after initial load, and ensures 100% user privacy (images never leave the device).

### 2. Zero-Cost Local Persistence
To avoid paid databases or complicated auth setup for a simple MVP demo:
- **State Management**: `zustand`
- **Storage**: `localforage` (IndexedDB)
- **Why**: Bypasses the 5MB `localStorage` limit allowing us to store base64 encoded images directly in the browser's IndexedDB. The app can be deployed as a static site and instantly works for any user without database provisioning.

### 3. Recommendation Engine
The AI recommendation is handled by a deterministic algorithm (`recommendationEngine.ts`) that matches the extracted metadata (formality scores, color theory, and user aesthetic) to the chosen occasion. This keeps the MVP fast and reliable without hitting rate limits on free LLM APIs.

### 4. UI/UX Layer
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Design Language**: Inspired by modern editorial apps (Phia, Partiful). Large organic shapes, a stark black/white/neon color palette, and a mobile-first layout.

## 💻 Local Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**: Navigate to `http://localhost:3000`

*Note: Since the AI runs in the browser, the first image scan will take a few seconds longer as it downloads the WASM model chunks. Subsequent scans are near-instant.*

## 🌍 Free Deployment Instructions

This app is 100% static/client-side and requires no server-side secrets or databases.

**Option A: Vercel (Recommended)**
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Deploy! (Works perfectly on the Free Hobby Tier).

**Option B: Netlify / Cloudflare Pages**
Works exactly the same way. No environment variables are required.

## 🔒 Environment Variables
**None required.** The app is designed to run entirely locally/at the edge to maintain the strict $0 cost requirement.

## 🚧 Known Limitations & Future Improvements
- **Model Size**: The CLIP model is ~120MB. While fine for a CTO demo, a production app would offload this to a cloud API (or use a much smaller quantized model) to reduce initial load times.
- **Background Removal**: Images currently show the background. A future implementation could use a browser-based segmentation model (like `segment-anything`) to cut out the clothes beautifully.
- **Algorithmic Fallback**: The outfit recommendation is currently algorithmic. In production, the stored wardrobe metadata would be injected into an LLM prompt (e.g., GPT-4o) for highly creative, personalized styling advice.

---
*Developed as a Technical Co-Founder MVP.*
