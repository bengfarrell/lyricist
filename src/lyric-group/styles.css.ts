import { css } from 'lit';

export const lyricGroupStyles = css`
  :host {
    position: absolute;
    user-select: none;
    z-index: 1;
  }

  :host([dragging]) {
    z-index: 1000;
    opacity: 0.8;
  }

  :host([selected]) .container {
    box-shadow: 0 0 0 3px #667eea, 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
    border: 2px solid #667eea;
  }

  :host([selected]:hover) .container {
    box-shadow: 0 0 0 3px #667eea, 0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  :host([selected][dragging]) .container {
    box-shadow: 0 0 0 3px #667eea, 0 20px 25px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.1);
  }

  .container {
    background: #f0f4ff;
    padding: 12px 20px;
    border-radius: 8px;
    border: 2px solid #c7d2fe;
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
    color: #4f46e5;
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
    background: #3b82f6;
  }

  .duplicate-btn:hover {
    background: #2563eb;
    transform: scale(1.1);
  }

  .ungroup-btn {
    left: 50%;
    transform: translateX(-50%);
    background: #8b5cf6;
  }

  .ungroup-btn:hover {
    background: #7c3aed;
    transform: translateX(-50%) scale(1.1);
  }
`;

