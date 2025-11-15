# Lyricist 🎵

A beautiful LitElement-based web component app for creating and arranging song lyrics like fridge magnets.

## Features

- ✨ Add lyric lines one at a time
- 🎯 Drag and drop lines anywhere on the canvas
- 📋 Double-click any line to copy it to clipboard
- 💾 Save and load songs using localStorage
- 📦 Import/Export songs as JSON files
- 🎨 Beautiful, modern UI with smooth animations

## Getting Started

### Installation

```bash
npm install
```

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

- **LitElement** - Fast, lightweight web components
- **Vite** - Modern build tool and dev server
- **Vitest** - Unit testing framework
- **localStorage** - Client-side data persistence

## License

MIT

