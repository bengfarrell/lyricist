import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { emailPromptStyles } from './styles.css.ts';

// Spectrum Web Components
import '@spectrum-web-components/textfield/sp-textfield.js';
import '@spectrum-web-components/button/sp-button.js';

/**
 * Email prompt dialog for setting up cross-device sync
 */
export class EmailPrompt extends LitElement {
  static styles = emailPromptStyles;
  
  private store = new SongStoreController(this);
  private email = '';
  private isSubmitting = false;
  private errorMessage = '';

  connectedCallback() {
    super.connectedCallback();
    // Pre-fill with existing email if set
    this.email = this.store.userEmail || '';
  }

  private _handleInput(e: InputEvent): void {
    this.email = (e.target as HTMLInputElement).value;
    this.errorMessage = '';
    this.requestUpdate();
  }

  private async _handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.requestUpdate();
      return;
    }

    this.isSubmitting = true;
    this.requestUpdate();

    try {
      await this.store.setUserEmail(this.email);
      // Close the dialog
      this.store.setShowEmailPrompt(false);
    } catch (error) {
      console.error('Error setting email:', error);
      this.errorMessage = 'Failed to set email. Please try again.';
      this.isSubmitting = false;
      this.requestUpdate();
    }
  }

  private _handleSkip(): void {
    // Allow skip but warn user
    if (confirm('Without an email, your songs won\'t sync across devices. Continue anyway?')) {
      this.store.setShowEmailPrompt(false);
    }
  }

  render() {
    if (!this.store.showEmailPrompt) {
      return html``;
    }

    const hasExistingEmail = !!this.store.userEmail;

    return html`
      <div class="overlay" data-spectrum-pattern="underlay-open" @click=${() => this._handleSkip()}>
        <div 
          class="dialog" 
          role="dialog"
          aria-labelledby="email-dialog-title"
          data-spectrum-pattern="modal-open dialog" 
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div class="header">
            <h2 id="email-dialog-title" data-spectrum-pattern="dialog-heading">${hasExistingEmail ? 'Cloud Sync Settings' : 'Set Up Cloud Sync'}</h2>
            <p>${hasExistingEmail ? 'Change your email to sync with different devices' : 'Enter your email to sync songs across all your devices'}</p>
          </div>

          <form data-spectrum-pattern="form" @submit=${this._handleSubmit}>
            <div class="form-group" data-spectrum-pattern="form-item">
              <sp-textfield
                id="email-input"
                type="email"
                label="Your Email"
                data-spectrum-pattern="textfield ${this.errorMessage ? 'textfield-invalid' : ''}"
                placeholder="your.email@example.com"
                .value=${this.email}
                @input=${this._handleInput}
                ?disabled=${this.isSubmitting}
                ?invalid=${!!this.errorMessage}
                required
              ></sp-textfield>
              ${this.errorMessage ? html`
                <div class="error-message" data-spectrum-pattern="help-text-negative">${this.errorMessage}</div>
              ` : ''}
            </div>

            <div class="info-box" data-spectrum-pattern="dialog-content">
              <strong>How it works:</strong>
              <ul>
                <li>We create a unique ID from your email (using SHA-256 hashing)</li>
                <li>Same email on any device = automatic sync</li>
                <li>Your email is stored locally only, not sent to our servers</li>
                <li>We never send you emails or share your address</li>
              </ul>
            </div>

            <div class="button-group" data-spectrum-pattern="dialog-footer">
              <sp-button
                type="submit"
                variant="accent"
                data-spectrum-pattern="button-accent ${this.isSubmitting ? 'button-pending' : ''}"
                ?disabled=${this.isSubmitting}
                ?pending=${this.isSubmitting}
              >
                ${this.isSubmitting ? 'Saving...' : (hasExistingEmail ? '✓ Update Email' : '✓ Enable Sync')}
              </sp-button>
              <sp-button
                type="button"
                variant="secondary"
                data-spectrum-pattern="button-secondary"
                @click=${this._handleSkip}
                ?disabled=${this.isSubmitting}
              >
                ${hasExistingEmail ? 'Cancel' : 'Skip (Local Only)'}
              </sp-button>
            </div>
          </form>

          <div class="footer">
            <small>You can change this later in Settings</small>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('email-prompt', EmailPrompt);

