import { LitElement, html } from 'lit';
import { SongStoreController } from '../store/index';
import { emailPromptStyles } from './styles.css.ts';

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
      <div class="overlay" @click=${() => this._handleSkip()}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="header">
            <h2>${hasExistingEmail ? '⚙️ Cloud Sync Settings' : '📧 Set Up Cloud Sync'}</h2>
            <p>${hasExistingEmail ? 'Change your email to sync with different devices' : 'Enter your email to sync songs across all your devices'}</p>
          </div>

          <form @submit=${this._handleSubmit}>
            <div class="form-group">
              <label for="email-input">Your Email</label>
              <input
                id="email-input"
                type="email"
                class="email-input"
                placeholder="your.email@example.com"
                .value=${this.email}
                @input=${this._handleInput}
                ?disabled=${this.isSubmitting}
                required
                autofocus
              />
              ${this.errorMessage ? html`
                <div class="error-message">${this.errorMessage}</div>
              ` : ''}
            </div>

            <div class="info-box">
              <strong>How it works:</strong>
              <ul>
                <li>We create a unique ID from your email (using SHA-256 hashing)</li>
                <li>Same email on any device = automatic sync ✨</li>
                <li>Your email is stored locally only, not sent to our servers</li>
                <li>We never send you emails or share your address</li>
              </ul>
            </div>

            <div class="button-group">
              <button
                type="submit"
                class="btn btn-primary"
                ?disabled=${this.isSubmitting}
              >
                ${this.isSubmitting ? '⏳ Saving...' : (hasExistingEmail ? '✓ Update Email' : '✓ Enable Sync')}
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                @click=${this._handleSkip}
                ?disabled=${this.isSubmitting}
              >
                ${hasExistingEmail ? 'Cancel' : 'Skip (Local Only)'}
              </button>
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

