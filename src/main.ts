import './lyricist-app';
import { registerSW } from 'virtual:pwa-register';

// Spectrum Web Components Theme Setup
import '@spectrum-web-components/theme/sp-theme.js';
import '@spectrum-web-components/theme/src/themes.js';
import '@spectrum-web-components/theme/scale-medium.js';
import '@spectrum-web-components/theme/theme-light.js';
import '@spectrum-web-components/theme/theme-dark.js';

// Register service worker with update prompt
const updateSW = registerSW({
  onNeedRefresh() {
    // Show update available notification
    if (confirm('New version available! Click OK to update.')) {
      updateSW(true); // Update and reload
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});