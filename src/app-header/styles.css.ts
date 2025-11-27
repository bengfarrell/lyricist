import { css } from 'lit';

export const appHeaderStyles = css`
  :host {
    display: block;
  }

  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
  }

  .header-controls {
    display: flex;
    gap: 10px;
    align-items: center;
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
    padding: 8px 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 16px;
    min-width: 200px;
  }

  .song-name-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
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

  .btn-primary {
    background: white;
    color: #667eea;
  }

  .btn-primary:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .header {
      padding: 12px 15px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .header h1 {
      font-size: 20px;
      width: 100%;
    }

    .header-controls {
      width: 100%;
      flex-wrap: wrap;
      gap: 8px;
    }

    .song-name-input {
      min-width: 0;
      flex: 1;
      font-size: 14px;
      padding: 6px 12px;
    }

    .btn {
      padding: 6px 12px;
      font-size: 12px;
      flex-shrink: 0;
    }
  }

  @media (max-width: 480px) {
    .header {
      padding: 10px;
    }

    .header h1 {
      font-size: 18px;
    }

    .song-name-input {
      font-size: 13px;
      padding: 5px 10px;
    }

    .btn {
      padding: 5px 10px;
      font-size: 11px;
    }
  }
`;

