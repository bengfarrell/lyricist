import { css } from 'lit';

export const lyricistAppStyles = css`
  :host {
    display: block;
    width: 95vw;
    height: 95vh;
    max-width: 1400px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
  }

  .header-controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .song-name-input {
    padding: 8px 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 16px;
    min-width: 200px;
  }

  .song-name-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .btn {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .btn-primary {
    background: white;
    color: #667eea;
  }

  .btn-primary:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .btn-danger {
    background: #ef4444;
    color: white;
  }

  .btn-danger:hover {
    background: #dc2626;
  }

  .controls {
    padding: 20px 30px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .input-container {
    flex: 1;
    display: flex;
    gap: 10px;
  }

  .lyric-input {
    flex: 1;
    padding: 12px 20px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s ease;
  }

  .lyric-input:focus {
    outline: none;
    border-color: #667eea;
  }

  .lyrics-panel {
    background: #f8f9fa;
    border-left: 2px solid #e9ecef;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
  }

  .lyrics-panel-header {
    padding: 20px;
    background: white;
    border-bottom: 2px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lyrics-panel-header h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .copy-lyrics-btn {
    padding: 8px 12px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-lyrics-btn:hover {
    background: #5568d3;
    transform: translateY(-1px);
  }

  .copy-lyrics-btn.copied {
    background: #10b981;
  }

  .lyrics-panel-content {
    flex: 1;
    padding: 30px;
    overflow-y: auto;
    overflow-x: auto;
    background: #fefce8;
    background-image: 
      repeating-linear-gradient(
        transparent,
        transparent 31px,
        #e5e7eb 31px,
        #e5e7eb 32px
      );
  }

  .lyrics-text {
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 16px;
    color: #1f2937;
    padding-top: 1px;
    white-space: nowrap;
  }

  .lyrics-text.empty {
    color: #9ca3af;
    font-style: italic;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  .lyric-line-with-chords {
    margin-bottom: 4px;
  }

  .chord-line {
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 16px;
    font-weight: bold;
    color: #000;
    white-space: pre;
    line-height: 18px;
    position: relative;
    height: 18px;
    margin-bottom: 2px;
  }

  .lyric-text-line {
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 16px;
    color: #1f2937;
    line-height: 16px;
  }

  .canvas {
    flex: 1;
    position: relative;
    background: linear-gradient(90deg, #f8f9fa 1px, transparent 1px),
                linear-gradient(#f8f9fa 1px, transparent 1px);
    background-size: 40px 40px;
    overflow: hidden;
  }

  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #9ca3af;
  }

  .empty-state-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  .empty-state h2 {
    font-size: 24px;
    margin: 0 0 10px 0;
    font-weight: 600;
  }

  .empty-state p {
    font-size: 16px;
    margin: 0;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  .dialog {
    background: white;
    border-radius: 16px;
    padding: 30px;
    min-width: 400px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
  }

  .dialog h2 {
    margin: 0 0 20px 0;
    font-size: 24px;
    color: #333;
  }

  .song-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .song-item {
    padding: 15px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .song-item:hover {
    border-color: #667eea;
    background: #f8f9fa;
  }

  .song-item-info {
    flex: 1;
  }

  .song-item-name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }

  .song-item-meta {
    font-size: 14px;
    color: #6b7280;
  }

  .dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .export-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
  }

  .export-section h3 {
    margin: 0 0 15px 0;
    font-size: 18px;
    color: #333;
  }

  .export-actions {
    display: flex;
    gap: 10px;
  }

  .file-input {
    display: none;
  }

  .panel-divider {
    width: 8px;
    background: #e9ecef;
    flex-shrink: 0;
    position: relative;
    transition: background 0.2s ease;
  }

  .panel-divider:hover {
    background: #d1d5db;
  }

  .panel-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 40px;
    background: #9ca3af;
    border-radius: 1px;
  }
`;

