import { css } from 'lit';

export const emailPromptStyles = css`
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(4px);
  }

  .dialog {
    background: white;
    border-radius: 12px;
    padding: 32px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .header {
    text-align: center;
    margin-bottom: 24px;
  }

  .header h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #333;
  }

  .header p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }

  .email-input {
    padding: 12px 16px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s;
    font-family: inherit;
  }

  .email-input:focus {
    outline: none;
    border-color: #0066cc;
  }

  .email-input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  .error-message {
    color: #d32f2f;
    font-size: 13px;
    margin-top: 4px;
  }

  .info-box {
    background: #f0f7ff;
    border: 1px solid #bbdefb;
    border-radius: 8px;
    padding: 16px;
    font-size: 13px;
    color: #333;
  }

  .info-box strong {
    display: block;
    margin-bottom: 8px;
    color: #0066cc;
  }

  .info-box ul {
    margin: 0;
    padding-left: 20px;
  }

  .info-box li {
    margin-bottom: 4px;
    line-height: 1.5;
  }

  .button-group {
    display: flex;
    gap: 12px;
  }

  .btn {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #0066cc;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0052a3;
    transform: translateY(-1px);
  }

  .btn-secondary {
    background: #f5f5f5;
    color: #666;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #e0e0e0;
  }

  .footer {
    text-align: center;
    margin-top: 20px;
  }

  .footer small {
    color: #999;
    font-size: 12px;
  }
`;



