import { css } from 'lit';

export const wordLadderConfigModalStyles = css`
  :host {
    display: block;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: 32px;
    line-height: 1;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .config-section {
    margin-bottom: 32px;
  }

  .config-section:last-child {
    margin-bottom: 0;
  }

  .config-section h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }

  .help-text {
    margin: 0 0 16px 0;
    font-size: 14px;
    color: #6b7280;
  }

  .column-toggles {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .column-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 600;
  }

  .column-toggle.active {
    background: #ecfdf5;
    border-color: #10b981;
    color: #065f46;
  }

  .column-toggle.muted {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #991b1b;
    opacity: 0.7;
  }

  .column-toggle:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .number-input-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .stepper-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    color: #374151;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .stepper-btn:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }

  .stepper-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .random-count-input {
    width: 60px;
    height: 36px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0 12px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    color: #1f2937;
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
  }

  .done-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .done-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .done-btn:active {
    transform: translateY(0);
  }
`;
