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
    overflow: hidden;
    touch-action: none;
    background-color: #fafafa;
    background-image:
      linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  .canvas.cursor-grab {
    cursor: grab;
  }

  .canvas.cursor-grabbing {
    cursor: grabbing;
  }

  .canvas-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-origin: 0 0;
    will-change: transform;
    pointer-events: none;
  }

  .canvas-content > * {
    pointer-events: auto;
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

  .selection-box {
    position: absolute;
    border: 2px solid #1f2937;
    background: rgba(0, 0, 0, 0.05);
    pointer-events: none;
    z-index: 10000;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .empty-state h2 {
      font-size: 20px;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .empty-state-icon {
      font-size: 40px;
      margin-bottom: 12px;
    }

    .empty-state h2 {
      font-size: 18px;
    }

    .empty-state p {
      font-size: 13px;
    }
  }
`;

