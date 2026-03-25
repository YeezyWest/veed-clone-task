# 🎬 Mini Video Editor

A lightweight, interactive video editing interface built with **Next.js 16**, **Tailwind CSS v4**, **Zustand**, and **react-rnd** — inspired by VEED.io.

![Editor Preview](./public/preview.png)

---

## ✨ Features

| Feature | Details |
|---|---|
| 📁 **Media Upload** | Drag files onto the sidebar or click **Add** to upload video/images |
| 🎨 **Canvas Editing** | Drag and resize any media element directly on the canvas |
| ⏱️ **Interactive Timeline** | Drag clips left/right to reposition, resize handles to trim duration |
| ▶️ **Playback** | Play/Pause with synced video playback, click-to-seek on timeline |
| ⬇️ **Export** | Download your uploaded media files directly from the browser |
| ⌨️ **Keyboard Shortcuts** | `Space` play/pause · `Delete`/`Backspace` remove selected item · `←` `→` seek |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YeezyWest/veed-clone-task.git
cd veed-clone-task

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🗂️ Project Structure

```
veed-clone-task/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Editor assembly
│   └── globals.css         # Theme & global styles
├── components/
│   ├── Navbar.tsx          # Header + Export button
│   ├── Sidebar.tsx         # Assets library & upload
│   ├── Canvas.tsx          # Drag/resize preview area
│   ├── Timeline.tsx        # Multi-track sequencer
│   └── ExportModal.tsx     # Export flow with download
├── store/
│   └── useEditorStore.ts   # Zustand global state
└── public/
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **State**: [Zustand](https://github.com/pmndrs/zustand)
- **Drag/Resize**: [react-rnd](https://github.com/bokuweb/react-rnd)
- **Icons**: [Lucide React](https://lucide.dev)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Space` | Play / Pause |
| `←` | Seek back 1 second |
| `→` | Seek forward 1 second |
| `Delete` / `Backspace` | Remove selected item |
| `Escape` | Deselect item |

---

## 🚀 Live Demo

[View on Vercel →](https://veed-clone-task.vercel.app)
