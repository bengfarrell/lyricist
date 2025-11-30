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
    box-shadow: 0 4px 6px var(--spectrum-transparent-black-300);
  }

  .header h1 {
    margin: 0;
    font-size: var(--spectrum-font-size-500);
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
    border: 2px solid var(--spectrum-transparent-white-500);
    border-radius: 8px;
    background: var(--spectrum-transparent-white-400);
    color: white;
    font-size: var(--spectrum-font-size-200);
    min-width: 200px;
  }

  .song-name-input::placeholder {
    color: var(--spectrum-transparent-white-800);
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

  .btn-primary {
    background: white;
    color: var(--spectrum-blue-600);
  }

  .btn-primary:hover {
    background: var(--spectrum-gray-100);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--spectrum-transparent-black-400);
  }

  .btn-secondary {
    background: var(--spectrum-transparent-white-400);
    color: white;
    border: 2px solid white;
  }

  .btn-secondary:hover {
    background: var(--spectrum-transparent-white-500);
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .header {
      padding: 12px 15px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .header h1 {
      font-size: var(--spectrum-font-size-300);
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
      font-size: var(--spectrum-font-size-100);
      padding: 6px 12px;
    }

    .btn {
      padding: 6px 12px;
      font-size: var(--spectrum-font-size-75);
      flex-shrink: 0;
    }
  }

  @media (max-width: 480px) {
    .header {
      padding: 10px;
    }

    .header h1 {
      font-size: var(--spectrum-font-size-300);
    }

    .song-name-input {
      font-size: var(--spectrum-font-size-75);
      padding: 5px 10px;
    }

    .btn {
      padding: 5px 10px;
      font-size: var(--spectrum-font-size-50);
    }
  }
`;

