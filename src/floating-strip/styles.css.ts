import { css } from 'lit';

export const floatingStripStyles = css`
  :host {
    display: block;
    position: fixed;
    left: 0;
    bottom: 20px;
    z-index: 1000;
    pointer-events: none;
  }

  .floating-strip {
    background: white;
    color: #1f2937;
    padding: 8px 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-left: none;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: all 0.3s ease;
    border-radius: 0 16px 16px 0;
    backdrop-filter: blur(10px);
    pointer-events: auto;
    max-width: 90vw;
    height: 56px;
    box-sizing: border-box;
  }

  .floating-strip.retracted {
    padding: 0;
    width: fit-content;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  .expand-btn {
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-left: none;
    color: #1f2937;
    padding: 8px 12px;
    min-width: 44px;
    height: 56px;
    border-radius: 0 8px 8px 0;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 24px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
    box-sizing: border-box;
  }

  .expand-btn:hover {
    background: #f9fafb;
    padding-right: 16px;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #9ca3af;
    padding: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 28px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    margin-left: 8px;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .strip-content {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 1;
    min-width: 0;
  }

  .controls-area {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .dice-btn-icon {
    background: #f3f4f6;
    border: 2px solid #d1d5db;
    color: #1f2937;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    font-size: 20px;
    flex-shrink: 0;
    min-height: 40px;
    transform: rotate(0deg);
  }

  .dice-btn-icon:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
    transform: rotate(20deg);
  }

  .lyric-creator {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .input-container {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .lyric-input {
    flex: 1;
    padding: 10px 16px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    color: #1f2937;
    font-size: 16px;
    min-height: 40px;
    box-sizing: border-box;
  }

  .lyric-input::placeholder {
    color: #9ca3af;
  }

  .lyric-input:focus {
    outline: none;
    background: white;
    border-color: #1f2937;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    min-height: 40px;
  }

  .btn-primary {
    background: #1f2937;
    color: white;
  }

  .btn-primary:hover {
    background: #111827;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #1f2937;
    border: 2px solid #d1d5db;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }

  /* Group Creator Styles */
  .group-creator {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .group-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .alignment-buttons {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }

  .align-btn {
    background: #f3f4f6;
    border: 2px solid #d1d5db;
    color: #1f2937;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
    flex-shrink: 0;
    min-width: 36px;
  }

  .align-btn:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
    transform: translateY(-1px);
  }

  .section-picker-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .section-picker-btn {
    padding: 8px 14px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    color: #6b7280;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 40px;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .section-picker-btn:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  .section-picker-btn:focus {
    outline: none;
    background: white;
    border-color: #1f2937;
  }

  .section-picker-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(2px);
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .section-picker-panel {
    position: fixed;
    bottom: 80px;
    left: 20px;
    background: white;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    max-width: 400px;
    animation: slideUp 0.2s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .section-bubble {
    padding: 6px 12px;
    background: #f0f0f0;
    border: 1px solid #d0d0d0;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .section-bubble:hover {
    background: #374151;
    color: white;
    border-color: #374151;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .section-bubble:active {
    transform: translateY(0);
  }

  .custom-section-form {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .custom-section-input {
    flex: 1;
    padding: 10px 16px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    color: #1f2937;
    font-size: 16px;
    min-height: 40px;
    box-sizing: border-box;
  }

  .custom-section-input::placeholder {
    color: #9ca3af;
  }

  .custom-section-input:focus {
    outline: none;
    background: white;
    border-color: #1f2937;
  }

  /* Word Ladder Controls */
  .word-ladder-controls {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;
  }

  .word-ladder-nav {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .set-index {
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
    padding: 0 4px;
    min-width: 90px;
    text-align: center;
    font-variant-numeric: tabular-nums;
  }

  .carousel-btn {
    background: #f3f4f6;
    border: 2px solid #d1d5db;
    color: #1f2937;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
    min-height: 40px;
  }

  .carousel-btn:hover:not(:disabled) {
    background: #e5e7eb;
    border-color: #9ca3af;
  }

  .carousel-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .add-set-btn {
    background: #f3f4f6;
    border: 2px solid #d1d5db;
    color: #1f2937;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    min-height: 40px;
  }

  .add-set-btn:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }

  /* Lyrics Controls */
  .lyrics-controls {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .lyrics-info {
    font-size: 16px;
    font-weight: 600;
    opacity: 0.95;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .floating-strip {
      padding: 5px 12px;
      gap: 10px;
      bottom: 10px;
      max-width: 95vw;
    }

    .strip-content {
      gap: 10px;
    }

    .controls-area {
      gap: 8px;
      flex-wrap: wrap;
    }

    .dice-btn-icon {
      padding: 6px 10px;
      font-size: 18px;
    }

    .lyric-input,
    .custom-section-input {
      padding: 8px 12px;
      font-size: 14px;
    }

    .btn {
      padding: 8px 14px;
      font-size: 13px;
    }

    .input-container {
      gap: 8px;
      flex-wrap: wrap;
    }

    .group-controls {
      gap: 8px;
      flex-wrap: wrap;
    }

    .alignment-buttons {
      gap: 3px;
    }

    .align-btn {
      padding: 5px 8px;
      font-size: 14px;
    }

    .section-picker-btn {
      padding: 6px 10px;
      font-size: 12px;
    }

    .section-picker-panel {
      max-width: 320px;
    }

    .section-bubble {
      padding: 5px 10px;
      font-size: 11px;
    }

    .word-ladder-controls {
      gap: 10px;
    }

    .word-ladder-nav {
      gap: 8px;
    }

    .set-index {
      font-size: 12px;
      min-width: 80px;
    }

    .carousel-btn {
      padding: 6px 10px;
      font-size: 18px;
    }

    .add-set-btn {
      padding: 8px 12px;
      font-size: 13px;
    }

    .lyrics-controls {
      gap: 12px;
      flex-wrap: wrap;
    }

    .lyrics-info {
      font-size: 14px;
    }

    .close-btn {
      width: 28px;
      height: 28px;
      font-size: 24px;
      margin-left: 4px;
    }

    .expand-btn {
      padding: 6px 10px;
      min-width: 40px;
      height: 40px;
      font-size: 20px;
    }

    .custom-section-form {
      gap: 8px;
      flex-wrap: wrap;
    }
  }

  /* Extra small mobile devices */
  @media (max-width: 480px) {
    .floating-strip {
      padding: 4px 10px;
      gap: 8px;
      border-radius: 0 12px 12px 0;
    }

    .strip-content {
      gap: 8px;
    }

    .controls-area {
      gap: 6px;
    }

    .lyric-input,
    .custom-section-input {
      padding: 6px 10px;
      font-size: 13px;
      min-width: 120px;
    }

    .btn {
      padding: 6px 12px;
      font-size: 12px;
    }

    .section-picker-btn {
      padding: 5px 8px;
      font-size: 11px;
    }

    .section-picker-panel {
      max-width: 280px;
      bottom: 60px;
      left: 10px;
    }

    .section-bubble {
      padding: 4px 8px;
      font-size: 10px;
    }

    .lyrics-info {
      font-size: 13px;
    }

    .set-index {
      font-size: 11px;
      min-width: 70px;
    }
  }
`;

