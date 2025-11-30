import { css } from 'lit';

export const appNavbarStyles = css`
  :host {
    display: block;
  }

  .navbar {
    background: linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%);
    border-bottom: 1px solid #d1d1d6;
    min-height: var(--spectrum-action-bar-height);
    display: flex;
    align-items: center;
    padding: var(--spectrum-spacing-75) var(--spectrum-spacing-200);
    font-size: 13px;
    color: #1d1d1f;
    user-select: none;
    gap: var(--spectrum-spacing-200);
  }

  /* Ensure action-group fills height properly */
  sp-action-group.navbar-right {
    min-height: var(--spectrum-action-bar-height);
    align-items: center;
  }

  .navbar-menu {
    display: flex;
    gap: 8px;
  }

  .navbar-btn {
    background: transparent;
    border: none;
    padding: 4px 12px;
    font-size: 13px;
    color: #1d1d1f;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.15s ease;
  }

  .navbar-btn:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .navbar-btn:active {
    background: rgba(0, 0, 0, 0.1);
  }

  .navbar-tabs {
    display: flex;
    gap: 2px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    padding: 2px;
    flex-shrink: 0;
  }

  sp-action-button.navbar-tab {
    --mod-actionbutton-background-color-default: transparent;
    --mod-actionbutton-background-color-hover: rgba(0, 0, 0, 0.05);
    --mod-actionbutton-border-color: transparent;
    padding: 3px 12px;
    font-size: 12px;
    color: #1d1d1f;
    border-radius: 4px;
    font-weight: 500;
    min-height: auto;
    height: auto;
  }

  sp-action-button.navbar-tab.active {
    --mod-actionbutton-background-color-default: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .navbar-tab-group {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 4px;
    border-radius: 4px;
    transition: all 0.15s ease;
  }

  .navbar-tab-group.active {
    background: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .navbar-tab-group sp-action-button.navbar-tab {
    padding: 3px 8px;
  }

  .navbar-select {
    background: transparent;
    border: 1px solid rgba(0, 0, 0, 0.15);
    padding: 2px 6px;
    font-size: 11px;
    color: #1d1d1f;
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.15s ease;
    font-weight: 500;
  }

  .navbar-select:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .navbar-select:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.3);
  }

  .navbar-title {
    flex: 1;
    text-align: center;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.01em;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 5px;
    transition: background 0.15s ease;
    color: #1d1d1f;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .navbar-title:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .align-btn {
    background: transparent;
    border: none;
    padding: 4px 8px;
    font-size: 14px;
    color: #1d1d1f;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.15s ease;
    line-height: 1;
    opacity: 0.5;
  }

  .align-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    opacity: 1;
  }

  .align-btn.active {
    opacity: 1;
    background: rgba(0, 0, 0, 0.08);
  }

  .align-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .align-btn:disabled:hover {
    background: transparent;
  }

  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .navbar {
      padding: 0 8px;
      gap: 8px;
      height: 36px;
    }

    .navbar-menu {
      gap: 4px;
    }

    .navbar-btn {
      padding: 4px 8px;
      font-size: 12px;
    }

    .navbar-tabs {
      gap: 1px;
      padding: 1px;
    }

    sp-action-button.navbar-tab {
      padding: 4px 8px;
      font-size: 11px;
    }

    .navbar-tab-group sp-action-button.navbar-tab {
      padding: 4px 6px;
    }

    .navbar-title {
      font-size: 12px;
      padding: 4px 8px;
      max-width: 60%;
    }
  }

  @media (max-width: 480px) {
    .navbar {
      padding: 0 6px;
      gap: 4px;
      height: 40px;
      flex-wrap: nowrap;
      overflow-x: auto;
    }

    .navbar-btn {
      padding: 6px 10px;
      font-size: 11px;
      white-space: nowrap;
    }

    sp-action-button.navbar-tab {
      padding: 6px 10px;
      font-size: 10px;
      min-width: 44px;
      min-height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .navbar-tab-group sp-action-button.navbar-tab {
      padding: 6px 8px;
    }

    .navbar-title {
      font-size: 11px;
      padding: 6px;
      max-width: 50%;
    }

    .navbar-select {
      padding: 4px 8px;
      font-size: 10px;
      min-height: 32px;
    }
  }
`;

