import { css } from 'lit';

export const fileModalStyles = css`
  :host {
    display: block;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 96%;
    height: 96%;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .modal-header {
    padding: 24px 32px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: 24px;
    color: #6b7280;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .modal-body {
    padding: 32px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .section {
    flex-shrink: 0;
  }

  .section.lyrics-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    gap: 16px;
  }

  .lyrics-preview {
    flex: 1;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .actions-row {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    padding-top: 8px;
  }

  .section h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
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

  .song-name-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s ease;
  }

  .song-name-input:focus {
    outline: none;
    border-color: #374151;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .btn {
    padding: 14px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-primary {
    background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
    color: white;
    grid-column: 1 / -1;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 2px solid #e5e7eb;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn:disabled:hover {
    transform: none;
    background: #f3f4f6;
    border-color: #e5e7eb;
  }

  .btn-active {
    background: #374151;
    color: white;
    border-color: #374151;
  }

  .btn-active:hover {
    background: #1f2937;
    border-color: #1f2937;
  }

  .document-picker {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: #f9fafb;
  }

  .document-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: #e5e7eb;
  }

  .document-item {
    background: white;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .document-item:hover {
    background: #f3f4f6;
    transform: translateX(4px);
  }

  .document-item:active {
    background: #e5e7eb;
  }

  .document-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .document-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
  }

  .document-meta {
    font-size: 13px;
    color: #6b7280;
  }

  .document-arrow {
    font-size: 20px;
    color: #9ca3af;
    transition: all 0.2s ease;
  }

  .document-item:hover .document-arrow {
    color: #1f2937;
    transform: translateX(4px);
  }
`;

