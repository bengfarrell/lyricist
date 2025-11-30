# Lyricist 🎵

A beautiful LitElement-based web component app for creating and arranging song lyrics like fridge magnets.

## Features

- ✨ Add lyric lines one at a time
- 🎯 Drag and drop lines anywhere on the canvas
- 📋 Double-click any line to copy it to clipboard
- 💾 Auto-save to localStorage (instant backup)
- ☁️ Cloud sync with DynamoDB (optional)
- 📦 Import/Export songs as JSON files
- 🎨 Beautiful, modern UI with smooth animations
- 🎵 Organize lyrics into sections (Verse, Chorus, etc.)
- 🎸 Add chords above lyrics

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup (Required for Cloud Sync)

If you want cloud sync to work:

```bash
# Copy the environment template
cp env.template .env

# Edit .env and add your API Gateway URL
# VITE_API_URL=https://your-api-url...
```

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

**Note:** The app works fine without cloud sync - it will just use localStorage only.

### Development

Start the development server:

```bash
npm run dev
```

The app will open in your browser automatically.

### Build

Build for production:

```bash
npm run build
```

### Testing

Run tests:

```bash
npm test
```

## Usage

1. **Enter a song name** in the header input field
2. **Add lyrics** by typing in the input field and clicking "Add Line" or pressing Enter
3. **Drag lines** around the canvas to arrange them
4. **Double-click** any line to copy it to your clipboard
5. **Delete lines** by hovering and clicking the × button
6. **Save your song** to localStorage using the Save button
7. **Load saved songs** using the Load button
8. **Export/Import** songs as JSON files for backup or sharing

## Technology Stack

### Frontend
- **LitElement** - Fast, lightweight web components
- **Spectrum Web Components** - Adobe's design system components
- **Vite** - Modern build tool and dev server
- **Vitest** - Unit testing framework
- **localStorage** - Client-side data persistence (auto-save)

### Cloud Sync (Optional)
- **AWS DynamoDB** - Cloud database for song storage
- **API Gateway** - REST API endpoints
- **Lambda** - Serverless functions for data operations

### Design System
- **Adobe Spectrum** - Enterprise design system
- **Spectrum CSS** - Spectrum design tokens and styles
- **Spectrum Icons** - Official icon set

See [spectrum/README.md](./spectrum/README.md) for complete Spectrum documentation.

**Key Resources:**
- [`spectrum/tokens.json`](./spectrum/tokens.json) - All design token values ⭐
- [`spectrum/DESIGN_TOKENS_GUIDE.md`](./spectrum/DESIGN_TOKENS_GUIDE.md) - How to use tokens
- [`spectrum/patterns/`](./spectrum/patterns/) - UI pattern documentation

See [CLOUD_SYNC_README.md](./CLOUD_SYNC_README.md) for cloud sync documentation.

## License

MIT










