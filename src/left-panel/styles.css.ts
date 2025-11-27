import { css } from 'lit';

export const leftPanelStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    background: #f8f9fa;
    overflow: hidden;
    flex-shrink: 0;
    height: 100%;
    width: 100%;
  }

  .left-panel-header {
    padding: 12px 16px;
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
    border-bottom: 2px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    color: white;
  }

  .header-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    flex: 1;
    text-align: center;
  }

  .carousel-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    line-height: 1;
    transition: all 0.2s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .carousel-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  .carousel-btn:active {
    transform: scale(0.95);
  }

  .carousel-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.1);
  }

  .carousel-btn:disabled:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: none;
  }

  .add-set-btn {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
    transition: all 0.2s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .add-set-btn:hover {
    background: rgba(255, 255, 255, 0.5);
    border-color: rgba(255, 255, 255, 0.6);
    transform: scale(1.1);
  }

  .add-set-btn:active {
    transform: scale(0.95);
  }

  .left-panel-content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #ffffff;
  }

  .word-ladder {
    display: grid;
    grid-template-columns: 0.75fr 0.75fr;
    gap: 12px;
    height: 100%;
    max-width: 100%;
    position: relative;
  }

  .word-ladder::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent 0%, #e9ecef 10%, #e9ecef 90%, transparent 100%);
    transform: translateX(-50%);
    z-index: 0;
    pointer-events: none;
  }

  .word-column {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    max-width: 100%;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .column-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .column-title.editable {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  .column-title.editable:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .edit-title-container {
    margin-bottom: 12px;
  }

  .edit-title-form {
    margin-bottom: 8px;
  }

  .edit-left-title,
  .edit-right-title {
    width: 100%;
    max-width: 100%;
    padding: 4px 8px;
    border: 2px solid #374151;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #1f2937;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: white;
    outline: none;
    box-sizing: border-box;
  }

  .suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .suggestion-chip {
    padding: 4px 8px;
    background: #f0f0f0;
    border: 1px solid #d0d0d0;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .suggestion-chip:hover {
    background: #374151;
    color: white;
    border-color: #374151;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .suggestion-chip:active {
    transform: translateY(0);
  }

  .word-list {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .word-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    transition: all 0.2s ease;
    position: relative;
    cursor: pointer;
  }

  .word-item:hover {
    background: #e9ecef;
    border-color: #374151;
  }

  .word-item.selected {
    background: #e5e7eb;
    border: 2px solid #1f2937;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }

  .word-item.placeholder {
    border-style: dashed;
    background: transparent;
    opacity: 0.6;
  }

  .word-item.placeholder:hover {
    background: transparent;
    border-color: #e9ecef;
    cursor: default;
  }

  .word-text {
    font-size: 14px;
    color: #333;
    font-weight: 500;
  }

  .word-item.placeholder .word-text {
    font-style: italic;
    color: #9ca3af;
  }

  .remove-btn {
    background: transparent;
    border: none;
    color: #ef4444;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    opacity: 0;
    transition: all 0.2s ease;
  }

  .word-item:hover .remove-btn {
    opacity: 1;
  }

  .remove-btn:hover {
    background: #fee2e2;
  }

  .add-word-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: #f9fafb;
    border: 1px dashed #9ca3af;
    border-radius: 6px;
    transition: all 0.2s ease;
    cursor: text;
  }

  .add-word-item:hover {
    background: #f3f4f6;
    border-color: #6b7280;
  }

  .word-input-inline {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    outline: none;
    min-width: 0;
  }

  .word-input-inline::placeholder {
    color: #6b7280;
    opacity: 0.6;
  }

  .word-input-inline:focus::placeholder {
    opacity: 0.8;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .left-panel-content {
      padding: 12px;
    }

    .word-ladder {
      gap: 8px;
    }

    .column-title {
      font-size: 12px;
      margin-bottom: 8px;
      padding: 3px 6px;
    }

    .word-list {
      gap: 6px;
      margin-bottom: 8px;
    }

    .word-item {
      padding: 8px 10px;
    }

    .word-text {
      font-size: 13px;
    }

    .add-word-item {
      padding: 8px 10px;
    }

    .word-input-inline {
      font-size: 12px;
    }

    .suggestion-chips {
      gap: 3px;
    }

    .suggestion-chip {
      padding: 3px 6px;
      font-size: 10px;
    }

    .edit-title-container {
      margin-bottom: 8px;
    }

    .edit-title-form {
      margin-bottom: 6px;
    }
  }
`;

