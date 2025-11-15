import { css } from 'lit';

export const lyricCanvasStyles = css`
  :host {
    display: block;
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .canvas {
    width: 100%;
    height: 100%;
    position: relative;
    background: linear-gradient(90deg, #f8f9fa 1px, transparent 1px),
                linear-gradient(#f8f9fa 1px, transparent 1px);
    background-size: 40px 40px;
    overflow: hidden;
  }

  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #9ca3af;
  }

  .empty-state-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  .empty-state h2 {
    font-size: 24px;
    margin: 0 0 10px 0;
    font-weight: 600;
  }

  .empty-state p {
    font-size: 16px;
    margin: 0;
  }
`;

