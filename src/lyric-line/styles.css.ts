import { css } from 'lit';

export const lyricLineStyles = css`
  :host {
    position: absolute;
    user-select: none;
    z-index: 1;
  }

  :host([dragging]) {
    z-index: 1000;
    opacity: 0.8;
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

  .chord-delete-btn:hover {
    background: #dc2626;
  }

  .lyric-line {
    background: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    font-size: 18px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    transition: box-shadow 0.2s ease, transform 0.1s ease;
    position: relative;
    display: inline-block;
  }

  :host(:hover) .lyric-line {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :host([dragging]) .lyric-line {
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.1);
  }

  .lyric-text-editable {
    outline: 2px solid #667eea;
    outline-offset: 2px;
    border-radius: 4px;
    padding: 2px 4px;
    margin: -2px -4px;
    display: inline-block;
    min-width: 100px;
    user-select: text;
  }

  .lyric-text-editable:focus {
    outline: 2px solid #667eea;
    user-select: text;
  }

  .action-btn {
    position: absolute;
    bottom: -8px;
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
    background: #3b82f6;
  }

  .duplicate-btn:hover {
    background: #2563eb;
    transform: scale(1.1);
  }

  .chord-toggle-btn {
    position: absolute;
    bottom: -8px;
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

  .chord-toggle-btn:hover {
    background: #374151;
    transform: translateX(-50%) scale(1.1);
  }
`;

