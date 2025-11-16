import { css } from 'lit';

export const appControlsStyles = css`
  :host {
    display: block;
  }

  .controls {
    padding: 20px 30px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    gap: 15px;
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
    gap: 10px;
    align-items: center;
  }

  .lyric-input {
    flex: 1;
    padding: 12px 20px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s ease;
  }

  .lyric-input:focus {
    outline: none;
    border-color: #667eea;
  }

  .btn {
    padding: 12px 24px;
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
    background: #6c757d;
    color: white;
  }
  
  .btn-secondary:hover {
    background: #5a6268;
  }
  
  .group-creator {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .group-header {
    margin-bottom: 8px;
  }
  
  .group-title {
    font-weight: 600;
    color: #495057;
    font-size: 13px;
  }

  .lyric-creator {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .lyric-header {
    margin-bottom: 8px;
  }
  
  .lyric-title {
    font-weight: 600;
    color: #495057;
    font-size: 13px;
  }
  
  .section-buttons {
    display: flex;
    gap: 6px;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .section-btn {
    padding: 6px 12px;
    background: white;
    border: 2px solid #667eea;
    border-radius: 6px;
    color: #667eea;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  .section-btn:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }
  
  .custom-section-form {
    display: flex;
    gap: 10px;
  }
  
  .custom-section-input {
    flex: 1;
    padding: 12px 20px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.2s ease;
  }
  
  .custom-section-input:focus {
    outline: none;
    border-color: #667eea;
  }

  .dice-btn {
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dice-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }

  .dice-btn:active {
    transform: translateY(0);
  }
`;

