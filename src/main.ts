import './lyricist-app';
import { registerSW } from 'virtual:pwa-register';

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