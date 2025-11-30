import { css } from 'lit';

export const appControlsStyles = css`
  :host {
    display: block;
  }

  .controls {
    padding: var(--spectrum-spacing-400) var(--spectrum-spacing-500);
    background: var(--spectrum-gray-75);
    border-bottom: 1px solid var(--spectrum-gray-200);
    display: flex;
    gap: var(--spectrum-spacing-300);
    align-items: stretch;
    height: 92px;
    box-sizing: border-box;
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

  .input-container {
    display: flex;
    gap: var(--spectrum-spacing-100);
    align-items: center;
  }

  .lyric-input {
    flex: 1;
    padding: var(--spectrum-spacing-200) var(--spectrum-spacing-400);
    border: 2px solid var(--spectrum-gray-200);
    border-radius: var(--spectrum-corner-radius-100);
    font-size: var(--spectrum-font-size-200);
    transition: border-color 0.2s ease;
  }

  .lyric-input:focus {
    outline: none;
    border-color: var(--spectrum-blue-600);
  }

  .btn {
    padding: var(--spectrum-spacing-200) var(--spectrum-spacing-400);
    border: none;
    border-radius: var(--spectrum-corner-radius-100);
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
    background: var(--spectrum-gray-500);
    color: white;
  }
  
  .btn-secondary:hover {
    background: var(--spectrum-gray-600);
  }
  
  .group-creator {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .group-header {
    margin-bottom: var(--spectrum-spacing-100);
  }
  
  .group-title {
    font-weight: 600;
    color: var(--spectrum-gray-700);
    font-size: var(--spectrum-font-size-75);
  }

  .lyric-creator {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .lyric-header {
    margin-bottom: var(--spectrum-spacing-100);
  }
  
  .lyric-title {
    font-weight: 600;
    color: var(--spectrum-gray-700);
    font-size: var(--spectrum-font-size-75);
  }
  
  .section-buttons {
    display: flex;
    gap: var(--spectrum-spacing-100);
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .section-btn {
    padding: var(--spectrum-spacing-100) var(--spectrum-spacing-200);
    background: white;
    border: 2px solid var(--spectrum-blue-600);
    border-radius: var(--spectrum-corner-radius-300);
    color: var(--spectrum-blue-600);
    font-size: var(--spectrum-font-size-75);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .section-btn:hover {
    background: var(--spectrum-blue-600);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--spectrum-transparent-black-500);
  }
  
  .custom-section-form {
    display: flex;
    gap: var(--spectrum-spacing-100);
  }
  
  .custom-section-input {
    flex: 1;
    padding: var(--spectrum-spacing-200) var(--spectrum-spacing-400);
    border: 2px solid var(--spectrum-gray-200);
    border-radius: var(--spectrum-corner-radius-100);
    font-size: var(--spectrum-font-size-200);
    transition: border-color 0.2s ease;
  }
  
  .custom-section-input:focus {
    outline: none;
    border-color: var(--spectrum-blue-600);
  }

  .dice-btn {
    padding: var(--spectrum-spacing-200) var(--spectrum-spacing-300);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: var(--spectrum-corner-radius-100);
    font-size: var(--spectrum-font-size-300);
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px var(--spectrum-transparent-black-400);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dice-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px var(--spectrum-transparent-black-500);
  }

  .dice-btn:active {
    transform: translateY(0);
  }
`;

