import { css } from 'lit';

export const leftPanelStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    background: var(--spectrum-gray-75);
    overflow: hidden;
    flex-shrink: 0;
    height: 100%;
    width: 100%;
  }

  .left-panel-header {
    padding: var(--spectrum-spacing-200) var(--spectrum-spacing-300);
    background: linear-gradient(135deg, var(--spectrum-gray-900) 0%, var(--spectrum-gray-700) 100%);
    border-bottom: 2px solid var(--spectrum-gray-200);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spectrum-spacing-200);
    color: white;
  }

  .header-title {
    margin: 0;
    font-size: var(--spectrum-font-size-300);
    font-weight: 600;
    flex: 1;
    text-align: center;
  }

  .carousel-btn {
    background: var(--spectrum-transparent-white-400);
    border: 1px solid var(--spectrum-transparent-white-500);
    color: white;
    width: var(--spectrum-spacing-500);
    height: var(--spectrum-spacing-500);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--spectrum-font-size-400);
    line-height: 1;
    transition: all 0.2s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .carousel-btn:hover {
    background: var(--spectrum-transparent-white-500);
    border-color: var(--spectrum-transparent-white-700);
    transform: scale(1.1);
  }

  .carousel-btn:active {
    transform: scale(0.95);
  }

  .carousel-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background: var(--spectrum-transparent-white-300);
  }

  .carousel-btn:disabled:hover {
    background: var(--spectrum-transparent-white-300);
    transform: none;
  }

  .add-set-btn {
    background: var(--spectrum-transparent-white-500);
    border: 1px solid var(--spectrum-transparent-white-600);
    color: white;
    width: var(--spectrum-spacing-500);
    height: var(--spectrum-spacing-500);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--spectrum-font-size-300);
    font-weight: bold;
    line-height: 1;
    transition: all 0.2s ease;
    padding: 0;
    flex-shrink: 0;
  }

  .add-set-btn:hover {
    background: var(--spectrum-transparent-white-700);
    border-color: var(--spectrum-transparent-white-800);
    transform: scale(1.1);
  }

  .add-set-btn:active {
    transform: scale(0.95);
  }

  .left-panel-content {
    flex: 1;
    padding: var(--spectrum-spacing-400);
    overflow-y: auto;
    background: white;
  }

  .word-ladder {
    display: grid;
    grid-template-columns: 0.75fr 0.75fr;
    gap: var(--spectrum-spacing-200);
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
    background: linear-gradient(to bottom, transparent 0%, var(--spectrum-gray-200) 10%, var(--spectrum-gray-200) 90%, transparent 100%);
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
    margin: 0 0 var(--spectrum-spacing-200) 0;
    font-size: var(--spectrum-font-size-100);
    font-weight: 600;
    color: var(--spectrum-gray-900);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .column-title.editable {
    cursor: pointer;
    padding: var(--spectrum-spacing-75) var(--spectrum-spacing-100);
    border-radius: var(--spectrum-corner-radius-75);
    transition: background 0.2s ease;
  }

  .column-title.editable:hover {
    background: var(--spectrum-transparent-black-200);
  }

  .edit-title-container {
    margin-bottom: var(--spectrum-spacing-200);
  }

  .edit-title-form {
    margin-bottom: var(--spectrum-spacing-100);
  }

  .edit-left-title,
  .edit-right-title {
    width: 100%;
    max-width: 100%;
    padding: var(--spectrum-spacing-75) var(--spectrum-spacing-100);
    border: 2px solid var(--spectrum-gray-700);
    border-radius: var(--spectrum-corner-radius-75);
    font-size: var(--spectrum-font-size-100);
    font-weight: 600;
    color: var(--spectrum-gray-900);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: white;
    outline: none;
    box-sizing: border-box;
  }

  .suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spectrum-spacing-75);
  }

  .suggestion-chip {
    padding: var(--spectrum-spacing-75) var(--spectrum-spacing-100);
    background: var(--spectrum-gray-100);
    border: 1px solid var(--spectrum-gray-300);
    border-radius: var(--spectrum-spacing-200);
    font-size: var(--spectrum-font-size-50);
    font-weight: 500;
    color: var(--spectrum-gray-700);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .suggestion-chip:hover {
    background: var(--spectrum-gray-700);
    color: white;
    border-color: var(--spectrum-gray-700);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px var(--spectrum-transparent-black-500);
  }

  .suggestion-chip:active {
    transform: translateY(0);
  }

  .word-list {
    flex: 1;
    overflow-y: auto;
    margin-bottom: var(--spectrum-spacing-200);
    display: flex;
    flex-direction: column;
    gap: var(--spectrum-spacing-100);
  }

  .word-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spectrum-spacing-100) var(--spectrum-spacing-200);
    background: var(--spectrum-gray-75);
    border: 1px solid var(--spectrum-gray-200);
    border-radius: var(--spectrum-corner-radius-300);
    transition: all 0.2s ease;
    position: relative;
    cursor: pointer;
  }

  .word-item:hover {
    background: var(--spectrum-gray-200);
    border-color: var(--spectrum-gray-700);
  }

  .word-item.selected {
    background: var(--spectrum-gray-200);
    border: 2px solid var(--spectrum-gray-900);
    box-shadow: 0 0 8px var(--spectrum-transparent-black-400);
  }

  .word-item.placeholder {
    border-style: dashed;
    background: transparent;
    opacity: 0.6;
  }

  .word-item.placeholder:hover {
    background: transparent;
    border-color: var(--spectrum-gray-200);
    cursor: default;
  }

  .word-text {
    font-size: var(--spectrum-font-size-100);
    color: var(--spectrum-gray-900);
    font-weight: 500;
  }

  .word-item.placeholder .word-text {
    font-style: italic;
    color: var(--spectrum-gray-500);
  }

  .remove-btn {
    background: transparent;
    border: none;
    color: var(--spectrum-red-600);
    font-size: var(--spectrum-font-size-300);
    cursor: pointer;
    padding: 0;
    width: var(--spectrum-spacing-400);
    height: var(--spectrum-spacing-400);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--spectrum-corner-radius-75);
    opacity: 0;
    transition: all 0.2s ease;
  }

  .word-item:hover .remove-btn {
    opacity: 1;
  }

  .remove-btn:hover {
    background: var(--spectrum-red-100);
  }

  .add-word-item {
    display: flex;
    align-items: center;
    padding: var(--spectrum-spacing-100) var(--spectrum-spacing-200);
    background: var(--spectrum-gray-50);
    border: 1px dashed var(--spectrum-gray-500);
    border-radius: var(--spectrum-corner-radius-300);
    transition: all 0.2s ease;
    cursor: text;
  }

  .add-word-item:hover {
    background: var(--spectrum-gray-100);
    border-color: var(--spectrum-gray-600);
  }

  .word-input-inline {
    flex: 1;
    border: none;
    background: transparent;
    padding: 0;
    font-size: var(--spectrum-font-size-75);
    font-weight: 500;
    color: var(--spectrum-gray-700);
    outline: none;
    min-width: 0;
  }

  .word-input-inline::placeholder {
    color: var(--spectrum-gray-600);
    opacity: 0.6;
  }

  .word-input-inline:focus::placeholder {
    opacity: 0.8;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .left-panel-content {
      padding: var(--spectrum-spacing-200);
    }

    .word-ladder {
      gap: var(--spectrum-spacing-100);
    }

    .column-title {
      font-size: var(--spectrum-font-size-75);
      margin-bottom: var(--spectrum-spacing-100);
      padding: var(--spectrum-spacing-75) var(--spectrum-spacing-100);
    }

    .word-list {
      gap: var(--spectrum-spacing-100);
      margin-bottom: var(--spectrum-spacing-100);
    }

    .word-item {
      padding: var(--spectrum-spacing-100) var(--spectrum-spacing-100);
    }

    .word-text {
      font-size: var(--spectrum-font-size-75);
    }

    .add-word-item {
      padding: var(--spectrum-spacing-100) var(--spectrum-spacing-100);
    }

    .word-input-inline {
      font-size: var(--spectrum-font-size-75);
    }

    .suggestion-chips {
      gap: var(--spectrum-spacing-75);
    }

    .suggestion-chip {
      padding: var(--spectrum-spacing-75) var(--spectrum-spacing-100);
      font-size: var(--spectrum-font-size-50);
    }

    .edit-title-container {
      margin-bottom: var(--spectrum-spacing-100);
    }

    .edit-title-form {
      margin-bottom: var(--spectrum-spacing-100);
    }
  }
`;

