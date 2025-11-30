import { css } from 'lit';

export const loadDialogStyles = css`
  :host {
    display: block;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--spectrum-transparent-black-700);
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
    box-shadow: 0 20px 25px var(--spectrum-transparent-black-500);
  }

  .dialog h2 {
    margin: 0 0 20px 0;
    font-size: var(--spectrum-font-size-400);
    color: var(--spectrum-gray-900);
  }

  .song-section {
    margin-bottom: 24px;
  }

  .song-section:last-of-type {
    margin-bottom: 20px;
  }

  .section-heading {
    margin: 0 0 12px 0;
    font-size: var(--spectrum-font-size-200);
    font-weight: 600;
    color: var(--spectrum-gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .song-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .song-item {
    padding: 15px;
    border: 2px solid var(--spectrum-gray-200);
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .song-item:hover {
    border-color: var(--spectrum-blue-600);
    background: var(--spectrum-gray-75);
  }

  .sample-item {
    border-style: dashed;
    border-color: var(--spectrum-gray-300);
  }

  .sample-item:hover {
    border-color: var(--spectrum-blue-600);
    border-style: solid;
  }

  .song-item-info {
    flex: 1;
  }

  .song-item-name {
    font-size: var(--spectrum-font-size-300);
    font-weight: 600;
    color: var(--spectrum-gray-900);
    margin-bottom: 5px;
  }

  .song-item-meta {
    font-size: var(--spectrum-font-size-100);
    color: var(--spectrum-gray-600);
  }

  .btn {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    font-size: var(--spectrum-font-size-100);
    font-weight: 600;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
  }

  .btn-danger {
    background: var(--spectrum-red-600);
    color: white;
  }

  .btn-danger:hover {
    background: var(--spectrum-red-700);
  }

  .btn-secondary {
    background: var(--spectrum-gray-100);
    color: var(--spectrum-gray-800);
    border: 2px solid var(--spectrum-gray-200);
  }

  .btn-secondary:hover {
    background: var(--spectrum-gray-200);
  }

  .dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .export-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--spectrum-gray-200);
  }

  .export-section h3 {
    margin: 0 0 15px 0;
    font-size: var(--spectrum-font-size-300);
    color: var(--spectrum-gray-900);
  }

  .export-actions {
    display: flex;
    gap: 10px;
  }

  .file-input {
    display: none;
  }

  .empty-message {
    color: var(--spectrum-gray-600);
    text-align: center;
    padding: 40px 0;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .dialog {
      min-width: 0;
      max-width: 90%;
      width: 90%;
      padding: 20px;
      max-height: 85vh;
    }

    .dialog h2 {
      font-size: var(--spectrum-font-size-300);
      margin-bottom: 16px;
    }

    .section-heading {
      font-size: var(--spectrum-font-size-100);
    }

    .song-item {
      padding: 12px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .song-item-name {
      font-size: var(--spectrum-font-size-200);
    }

    .song-item-meta {
      font-size: var(--spectrum-font-size-75);
    }

    .btn {
      padding: 6px 16px;
      font-size: var(--spectrum-font-size-75);
      width: 100%;
    }

    .export-section h3 {
      font-size: var(--spectrum-font-size-200);
    }

    .export-actions {
      flex-direction: column;
    }

    .dialog-actions {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .dialog {
      width: 95%;
      max-width: 95%;
      padding: 16px;
      max-height: 90vh;
      border-radius: 12px;
    }

    .dialog h2 {
      font-size: var(--spectrum-font-size-300);
    }

    .section-heading {
      font-size: var(--spectrum-font-size-75);
      margin-bottom: 10px;
    }

    .song-section {
      margin-bottom: 20px;
    }

    .song-item {
      padding: 10px;
    }

    .song-item-name {
      font-size: var(--spectrum-font-size-200);
    }

    .song-item-meta {
      font-size: var(--spectrum-font-size-50);
    }

    .btn {
      padding: 6px 12px;
      font-size: var(--spectrum-font-size-50);
    }

    .export-section {
      margin-top: 16px;
      padding-top: 16px;
    }

    .export-section h3 {
      font-size: var(--spectrum-font-size-200);
      margin-bottom: 12px;
    }

    .empty-message {
      padding: 30px 0;
      font-size: var(--spectrum-font-size-100);
    }
  }
`;

