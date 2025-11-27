import { css } from 'lit';

export const lyricistAppStyles = css`
  :host {
    display: block;
    width: 100vw;
    height: 100vh;
    background: white;
    overflow: hidden;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    position: relative;
  }

  .main-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
    background: white;
    background-image: linear-gradient(90deg, #f8f9fa 1px, transparent 1px),
                      linear-gradient(#f8f9fa 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
  }

  .panel.visible {
    opacity: 1;
    visibility: visible;
    z-index: 1;
  }

  .panel.hidden {
    opacity: 0;
    visibility: hidden;
    z-index: 0;
    pointer-events: none;
  }

  /* Overlay panels for hybrid canvas + lyrics views */
  .panel-overlay {
    position: absolute;
    z-index: 0;
    opacity: 1;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }

  .panel-overlay-left {
    left: 0;
    top: 0;
    width: 50%;
    height: 100%;
  }

  .panel-overlay-right {
    right: 0;
    top: 0;
    left: auto;
    width: 50%;
    height: 100%;
  }

  .panel-overlay-top {
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
  }

  .panel-overlay-bottom {
    bottom: 0;
    left: 0;
    top: auto;
    width: 100%;
    height: 50%;
  }

  .panel-overlay.visible {
    visibility: visible;
  }
`;
