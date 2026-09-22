# tagg | What are you wearing tonight?

> Your wardrobe, understood by AI.

A mobile-first, AI-powered digital wardrobe application. **tagg** allows users to seamlessly digitize their closet using their phone's camera. By leveraging on-device Edge AI, the application automatically categorizes, tags, and extracts rich metadata from clothing items. With a built-in intelligent recommendation engine, tagg generates styled outfits tailored to specific occasions, personal aesthetics, and color harmony.

## ✨ Core Features

1. **Camera-First Wardrobe**: Scan your clothes directly using your phone's camera with a seamless, immersive UI.
2. **Edge AI Analysis**: The app automatically identifies clothing type, color, fit, formality, and style using a zero-shot vision model running directly on the device.
3. **Direct Styling**: Scan a new item and immediately generate a complete outfit anchored around that specific piece.
4. **Digital Closet**: View, manage, and filter your completely digitized wardrobe.
5. **Occasion-Based Styling**: Choose an occasion (Dinner, Date, Night Out, Casual, etc.) and receive a styled outfit composed *only* of clothes you actually own.
6. **AI Reasoning**: Outfits are accompanied by AI-generated reasoning explaining why the pieces work together.

## 🏗 Technical Architecture

tagg is built with a focus on privacy, edge computing, and modern UX.

### 1. Privacy-First Edge AI (Vision)
Instead of relying on cloud APIs, tagg uses **WebAssembly (WASM)** to run Machine Learning models directly in the user's browser.
- **Model**: `Xenova/clip-vit-base-patch32` via Hugging Face.
- **Implementation**: Runs dynamically on the client using `@xenova/transformers`.
- **Why**: Offers zero-latency inference after the initial load and ensures **100% user privacy** (camera streams and images never leave the user's device).

### 2. Local-First Persistence
- **State Management**: `zustand`
- **Storage**: `localforage` (IndexedDB)
- **Why**: Bypasses traditional `localStorage` limits, allowing the application to securely store base64 encoded images and metadata directly in the browser's IndexedDB. This architecture allows the app to function flawlessly entirely offline or as a lightweight PWA.

### 3. Recommendation Engine
The outfit generation is handled by a deterministic rules-based algorithm combined with AI-extracted metadata. It strictly enforces mutually exclusive slotting (e.g., ensuring a top is not simultaneously worn as outerwear) while matching formality scores, color theory, and user style preferences.

### 4. UI/UX Layer
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Design Language**: A bespoke "neo-brutalist" design system featuring high-contrast layouts, heavy borders, sharp shadows, and a mobile-first responsive grid.

## 🚀 Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tagg
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**: Navigate to `http://localhost:3000`

*Note: Since the AI runs locally in the browser, the first image scan will download the WASM model chunks (~120MB). Subsequent scans are instant and cached.*

## 🌐 Deployment

This application is designed as a 100% static/client-side architecture and requires no server-side secrets or databases.

**Vercel / Netlify / Cloudflare Pages**
1. Push your code to GitHub.
2. Import the project into your preferred hosting provider.
3. Deploy! No environment variables are required.

## 🛣 Future Roadmap
- **Background Segmentation**: Integrate a browser-based segmentation model (like `segment-anything`) to automatically remove backgrounds from clothing photos.
- **Cloud AI Syncing**: Optional cloud sync utilizing advanced multimodal models (like GPT-4o Vision or Claude 3.5 Sonnet) for highly creative, conversational styling advice.
- **React Native Migration**: Wrap the core PWA logic into a native Expo application for deeper OS camera integration and push notifications.
- **Contextual APIs**: Integrate weather and calendar APIs to automatically suggest climate-appropriate outfits for upcoming events.
