import { css } from 'lit';

export const lyricGroupStyles = css`
  :host {
    position: absolute;
    user-select: none;
    z-index: 1;
    touch-action: none;
  }

  :host([dragging]) {
    z-index: 1000;
    opacity: 0.8;
  }

  :host([selected]) .container {
    box-shadow: 0 0 0 3px #1f2937, 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    border: 2px solid #1f2937;
  }

  :host([selected]:hover) .container {
    box-shadow: 0 0 0 3px #1f2937, 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :host([selected][dragging]) .container {
    box-shadow: 0 0 0 3px #1f2937, 0 20px 25px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.1);
  }

  .container {
    background: #f3f4f6;
    padding: 12px 20px;
    border-radius: 8px;
    border: 2px solid #d1d5db;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.2s ease, transform 0.1s ease, border-color 0.2s ease;
    display: inline-block;
    position: relative;
  }
  
  :host(:hover) .container {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :host([dragging]) .container {
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.1);
  }
  
  .section-header {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
  }
  
  .section-name {
    font-weight: 600;
    color: #1f2937;
  }
  
  .line-count {
    font-size: 14px;
    color: #6b7280;
    margin-left: 8px;
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
    background: #374151;
  }

  .duplicate-btn:hover {
    background: #1f2937;
    transform: scale(1.1);
  }

  .ungroup-btn {
    left: 50%;
    transform: translateX(-50%);
    background: #4b5563;
  }

  .ungroup-btn:hover {
    background: #374151;
    transform: translateX(-50%) scale(1.1);
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .container {
      padding: 10px 16px;
    }

    .section-header {
      font-size: 16px;
    }

    .line-count {
      font-size: 12px;
      margin-left: 6px;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 8px 14px;
    }

    .section-header {
      font-size: 14px;
    }

    .line-count {
      font-size: 11px;
      margin-left: 4px;
    }

    .action-btn {
      width: 36px;
      height: 36px;
      font-size: 18px;
    }
  }
`;

