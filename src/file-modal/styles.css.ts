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
    width: 90%;
    max-width: 1200px;
    height: 90%;
    max-height: 900px;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
    box-sizing: border-box;
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
    padding: 20px 24px 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-shrink: 0;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
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

  /* Tab styles */
  .tabs-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 24px;
    border-bottom: 2px solid #e5e7eb;
    flex-shrink: 0;
  }

  .tabs {
    display: flex;
    gap: 8px;
    flex: 1;
  }

  .tab {
    padding: 12px 24px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    color: #6b7280;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: -2px;
  }

  .tab:hover {
    color: #374151;
    background: #f9fafb;
  }

  .tab.active {
    color: #2563eb;
    border-bottom-color: #2563eb;
  }

  .new-song-btn {
    margin-bottom: 2px;
    flex-shrink: 0;
  }

  .modal-body {
    padding: 24px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
    min-height: 0;
  }

  .modal-footer {
    padding: 12px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .version-text {
    font-size: 12px;
    color: #9ca3af;
  }

  .section {
    flex-shrink: 0;
  }

  .section.lyrics-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    gap: 12px;
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

  .actions-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-shrink: 0;
  }

  .actions-row {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
  }

  .button-divider {
    width: 100%;
    height: 1px;
    background: #d1d5db;
    margin: 0;
  }

  .section h3 {
    margin: 0 0 12px 0;
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
    box-sizing: border-box;
  }

  .song-name-input:focus {
    outline: none;
    border-color: #374151;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 2px solid #e5e7eb;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn:disabled:hover {
    transform: none;
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

  .btn-primary {
    background: #2563eb;
    color: white;
    border: 2px solid #2563eb;
  }

  .btn-primary:hover:not(:disabled) {
    background: #1d4ed8;
    border-color: #1d4ed8;
  }

  /* Current Song Tab Styles */
  .current-song-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
  }

  .song-name-section {
    flex-shrink: 0;
  }

  .song-name-section .song-name-input {
    width: 100%;
  }

  .lyrics-preview-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .lyrics-preview-section h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .lyrics-preview-section lyrics-panel {
    flex: 1;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    min-height: 0;
  }

  .current-song-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  .empty-message {
    padding: 60px 20px;
    text-align: center;
    color: #6b7280;
    font-size: 16px;
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
    flex: 1;
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

  .document-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn-delete {
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    color: #dc2626;
    background: transparent;
    border: 1px solid #dc2626;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .btn-delete:hover {
    background: #dc2626;
    color: white;
    transform: scale(1.05);
  }

  .btn-delete:active {
    transform: scale(0.98);
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

  .sample-document {
    border-left: 3px solid #667eea;
  }

  .empty-picker-message {
    padding: 60px 20px;
    text-align: center;
    color: #6b7280;
    font-size: 16px;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .modal-content {
      width: 95%;
      height: 95%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 8px;
    }

    .modal-header {
      padding: 12px 16px;
    }

    .modal-header h2 {
      font-size: 20px;
    }

    .modal-body {
      padding: 16px;
    }

    .song-name-input {
      font-size: 14px;
      padding: 8px 12px;
    }

    .actions-container {
      gap: 10px;
    }

    .actions-row {
      flex-wrap: wrap;
      gap: 8px;
    }

    .btn {
      padding: 8px 12px;
      font-size: 12px;
      flex: 1;
      min-width: 80px;
    }

    .button-divider {
      width: 100%;
      height: 1px;
    }

    .lyrics-preview {
      max-height: 400px;
    }

    .document-item {
      padding: 12px 16px;
    }

    .document-title {
      font-size: 14px;
    }

    .document-meta {
      font-size: 12px;
    }

    .tabs-container {
      padding: 0 16px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .tabs {
      flex: 1;
      min-width: 200px;
    }

    .tab {
      padding: 10px 16px;
      font-size: 14px;
    }

    .new-song-btn {
      font-size: 12px;
      padding: 8px 12px;
    }
  }

  @media (max-width: 480px) {
    .modal-content {
      width: 100%;
      height: 100%;
      border-radius: 0;
    }

    .modal-header {
      padding: 10px 12px;
    }

    .modal-header h2 {
      font-size: 18px;
    }

    .modal-body {
      padding: 12px;
    }

    .song-name-input {
      font-size: 13px;
      padding: 6px 10px;
    }

    .btn {
      padding: 6px 10px;
      font-size: 11px;
      min-width: 70px;
    }

    .close-btn {
      font-size: 20px;
    }

    h3 {
      font-size: 14px;
    }

    .lyrics-preview {
      max-height: 300px;
    }

    .document-item {
      padding: 10px 12px;
    }

    .document-title {
      font-size: 13px;
    }

    .document-meta {
      font-size: 11px;
    }

    .tabs-container {
      flex-direction: column;
      align-items: stretch;
    }

    .tabs {
      min-width: 0;
      width: 100%;
    }

    .tab {
      padding: 8px 12px;
      font-size: 13px;
      flex: 1;
    }

    .new-song-btn {
      width: 100%;
      margin-bottom: 0;
    }
  }
`;

