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

  .song-section {
    margin-bottom: 24px;
  }

  .song-section:last-of-type {
    margin-bottom: 20px;
  }

  .section-heading {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #6b7280;
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
    border: 2px solid #e9ecef;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .song-item:hover {
    border-color: #667eea;
    background: #f8f9fa;
  }

  .sample-item {
    border-style: dashed;
    border-color: #d1d5db;
  }

  .sample-item:hover {
    border-color: #667eea;
    border-style: solid;
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

  .btn {
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
  }

  .btn-danger {
    background: #ef4444;
    color: white;
  }

  .btn-danger:hover {
    background: #dc2626;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 2px solid #e5e7eb;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
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

  .empty-message {
    color: #6b7280;
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
      font-size: 20px;
      margin-bottom: 16px;
    }

    .section-heading {
      font-size: 14px;
    }

    .song-item {
      padding: 12px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .song-item-name {
      font-size: 16px;
    }

    .song-item-meta {
      font-size: 12px;
    }

    .btn {
      padding: 6px 16px;
      font-size: 12px;
      width: 100%;
    }

    .export-section h3 {
      font-size: 16px;
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
      font-size: 18px;
    }

    .section-heading {
      font-size: 13px;
      margin-bottom: 10px;
    }

    .song-section {
      margin-bottom: 20px;
    }

    .song-item {
      padding: 10px;
    }

    .song-item-name {
      font-size: 15px;
    }

    .song-item-meta {
      font-size: 11px;
    }

    .btn {
      padding: 6px 12px;
      font-size: 11px;
    }

    .export-section {
      margin-top: 16px;
      padding-top: 16px;
    }

    .export-section h3 {
      font-size: 15px;
      margin-bottom: 12px;
    }

    .empty-message {
      padding: 30px 0;
      font-size: 14px;
    }
  }
`;

