import { css } from 'lit';

export const lyricLineStyles = css`
  :host {
    position: absolute;
    user-select: none;
    z-index: 1;
    touch-action: none;
  }

  /* Allow touch interactions when editing text */
  :host([editing-text]) {
    touch-action: auto;
    user-select: auto;
  }

  :host([dragging]) {
    z-index: 1000;
    opacity: 0.8;
  }

  :host([selected]) .lyric-line {
    box-shadow: 0 0 0 3px #1f2937, 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    border: 2px solid #1f2937;
  }

  :host([selected]:hover) .lyric-line {
    box-shadow: 0 0 0 3px #1f2937, 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :host([selected][dragging]) .lyric-line {
    box-shadow: 0 0 0 3px #1f2937, 0 20px 25px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.1);
  }

  .container {
    display: inline-block;
  }

  .chord-section {
    position: absolute;
    bottom: 100%;
    margin-bottom: 8px;
    left: 0;
    right: 0;
    background: transparent;
    padding: 0;
    border-radius: 0;
    border: none;
    transition: all 0.2s ease;
  }

  .chord-section:hover {
    background: rgba(255, 255, 255, 0.8);
  }

  .chord-section-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #9ca3af;
    font-size: 14px;
    opacity: 0.7;
    pointer-events: none;
    font-style: italic;
  }

  .chord-markers {
    position: relative;
    width: 100%;
    height: 26px;
  }

  .chord-marker {
    position: absolute;
    background: #000;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 700;
    color: white;
    transform: translateX(-50%);
    white-space: nowrap;
    border: 2px solid #000;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .chord-marker:hover {
    background: #374151;
    border-color: #374151;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  :host([chord-drag-active]) .chord-marker:hover {
    background: #000;
    border-color: #000;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .chord-marker.active {
    background: #374151;
    border-color: #374151;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    50% {
      box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  .chord-marker::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: 8px;
    background: #000;
  }

  .chord-picker {
    position: fixed;
    background: white;
    border: 2px solid #000;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    padding: 16px;
    z-index: 100000;
    overflow-y: auto;
    width: 240px;
    max-height: 400px;
  }

  .chord-picker-group {
    margin-bottom: 12px;
  }

  .chord-picker-group:last-child {
    margin-bottom: 0;
  }

  .chord-picker-label {
    font-size: 11px;
    font-weight: 700;
    color: #000;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .chord-picker-options {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
  }

  .chord-option {
    padding: 6px 8px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: #000;
    transition: all 0.15s ease;
  }

  .chord-option:hover {
    background: #000;
    color: white;
    border-color: #000;
    transform: scale(1.05);
  }

  .chord-delete-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ef4444;
    color: white;
    border: 1px solid white;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .chord-marker:hover .chord-delete-btn {
    display: flex;
  }

  :host([chord-drag-active]) .chord-delete-btn {
    display: none !important;
    pointer-events: none !important;
  }
  
  :host([chord-drag-active]) .chord-marker:hover .chord-delete-btn {
    display: none !important;
  }

  .chord-delete-btn:hover {
    background: #dc2626;
  }

  .lyric-line {
    background: white;
    padding: 12px 20px;
    border-radius: 8px;
    border: 2px solid transparent;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    font-size: 18px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    transition: box-shadow 0.2s ease, transform 0.1s ease, border-color 0.2s ease;
    position: relative;
    display: inline-block;
  }

  :host(:hover) .lyric-line {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :host([chord-drag-active]:hover) .lyric-line {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  :host([dragging]) .lyric-line {
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.1);
  }

  .lyric-text-input {
    border: none;
    outline: 2px solid #1f2937;
    outline-offset: 2px;
    border-radius: 4px;
    padding: 2px 4px;
    background: white;
    font-size: 18px;
    font-weight: 500;
    font-family: inherit;
    color: #333;
    min-width: 200px;
    width: auto;
    touch-action: manipulation;
    -webkit-user-select: text;
    -webkit-touch-callout: default;
  }

  .lyric-text-input:focus {
    outline: 2px solid #1f2937;
    outline-offset: 2px;
  }
  
  @media (max-width: 768px) {
    .lyric-text-input {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    .lyric-text-input {
      font-size: 14px;
    }
  }

  .action-btn {
    position: absolute;
    bottom: -20px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    color: white;
    border: 2px solid white;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  :host(:hover) .action-btn {
    display: flex;
  }

  :host([chord-drag-active]) .action-btn {
    display: none !important;
    pointer-events: none !important;
  }
  
  :host([chord-drag-active]:hover) .action-btn {
    display: none !important;
  }

  .delete-btn {
    right: -8px;
    background: #ef4444;
  }

  .delete-btn:hover {
    background: #dc2626;
    transform: scale(1.1);
  }

  .duplicate-btn {
    left: -8px;
    background: #374151;
  }

  .duplicate-btn:hover {
    background: #1f2937;
    transform: scale(1.1);
  }

  .chord-toggle-btn {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: white;
    border: 2px solid white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  :host(:hover) .chord-toggle-btn {
    display: flex;
  }

  :host([chord-drag-active]) .chord-toggle-btn {
    display: none !important;
    pointer-events: none !important;
  }
  
  :host([chord-drag-active]:hover) .chord-toggle-btn {
    display: none !important;
  }

  .chord-toggle-btn:hover {
    background: #374151;
    transform: translateX(-50%) scale(1.1);
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .lyric-line {
      padding: 10px 16px;
      font-size: 16px;
    }

    .chord-picker {
      width: 200px;
      max-height: 300px;
      padding: 12px;
    }

    .chord-picker-group {
      margin-bottom: 10px;
    }

    .chord-picker-options {
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }

    .chord-option {
      padding: 8px 6px;
      font-size: 12px;
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chord-marker {
      padding: 3px 8px;
      font-size: 12px;
    }

    .chord-section {
      margin-bottom: 6px;
    }

    .chord-markers {
      height: 24px;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }

    .chord-toggle-btn {
      width: 32px;
      height: 32px;
      font-size: 18px;
    }

    .chord-delete-btn {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    .lyric-line {
      padding: 8px 14px;
      font-size: 14px;
    }

    .chord-picker {
      width: calc(100vw - 32px);
      max-width: 280px;
      max-height: 280px;
      padding: 10px;
    }

    .chord-picker-options {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .chord-option {
      padding: 10px 8px;
      font-size: 11px;
      min-height: 40px;
    }

    .chord-marker {
      padding: 4px 10px;
      font-size: 11px;
    }

    .action-btn,
    .chord-toggle-btn {
      width: 36px;
      height: 36px;
    }

    .chord-delete-btn {
      width: 24px;
      height: 24px;
      font-size: 14px;
    }
  }
`;

