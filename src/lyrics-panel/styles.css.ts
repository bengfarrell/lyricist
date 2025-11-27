import { css } from 'lit';

export const lyricsPanelStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    background: #f8f9fa;
    overflow: hidden;
    flex-shrink: 0;
    height: 100%;
    width: 100%;
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
    background: #374151;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .copy-lyrics-btn:hover {
    background: #1f2937;
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

  /* Hide scrollbar when used as overlay in canvas mode */
  :host([overlay]) .lyrics-panel-content {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  :host([overlay]) .lyrics-panel-content::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
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
    white-space: normal;
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
  
  .section-group {
    margin-top: 24px;
    margin-bottom: 20px;
  }
  
  .section-group:first-child {
    margin-top: 0;
  }
  
  .section-header {
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .section-divider {
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 16px;
    color: #9ca3af;
    margin-top: 8px;
    line-height: 16px;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .lyrics-panel-header {
      padding: 12px;
    }

    .lyrics-panel-header h2 {
      font-size: 16px;
    }

    .copy-lyrics-btn {
      padding: 6px 10px;
      font-size: 16px;
    }

    .lyrics-panel-content {
      padding: 16px;
    }

    .lyrics-text,
    .chord-line,
    .lyric-text-line,
    .section-header,
    .section-divider {
      font-size: 14px;
    }

    .section-group {
      margin-top: 20px;
      margin-bottom: 16px;
    }

    .section-header {
      margin-bottom: 6px;
    }
  }

  @media (max-width: 480px) {
    .lyrics-panel-header {
      padding: 10px;
    }

    .lyrics-panel-header h2 {
      font-size: 14px;
    }

    .lyrics-panel-content {
      padding: 12px;
    }

    .lyrics-text,
    .chord-line,
    .lyric-text-line,
    .section-header,
    .section-divider {
      font-size: 13px;
    }
  }
`;

