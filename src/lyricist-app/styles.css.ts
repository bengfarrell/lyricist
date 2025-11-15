import { css } from 'lit';

export const lyricistAppStyles = css`
  :host {
    display: block;
    width: 95vw;
    height: 95vh;
    max-width: 1400px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .panel-divider {
    width: 8px;
    background: #e9ecef;
    flex-shrink: 0;
    position: relative;
    transition: background 0.2s ease;
    cursor: ew-resize;
  }

  .panel-divider:hover {
    background: #d1d5db;
  }

  .panel-divider::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 40px;
    background: #9ca3af;
    border-radius: 1px;
  }
`;
