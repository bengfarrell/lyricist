import { SavedSong } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Validate that API URL is configured
if (!API_BASE_URL) {
  console.warn('⚠️ VITE_API_URL not configured. Cloud sync will not work. See env.template for setup instructions.');
}

export class CloudSyncService {
  /**
   * Save a song to the cloud (DynamoDB)
   */
  async saveSong(song: SavedSong): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save song to cloud');
      }

      console.log('✅ Song saved to cloud:', song.name);
    } catch (error) {
      console.error('❌ Cloud sync error (save):', error);
      throw error;
    }
  }

  /**
   * Get all songs for a user from the cloud
   */
  async getSongs(userId: string): Promise<SavedSong[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/songs?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get songs from cloud');
      }

      const data = await response.json();
      console.log('✅ Retrieved songs from cloud:', data.songs.length);
      return data.songs || [];
    } catch (error) {
      console.error('❌ Cloud sync error (get):', error);
      throw error;
    }
  }

  /**
   * Delete a song from the cloud
   */
  async deleteSong(userId: string, songId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/songs/${encodeURIComponent(userId)}/${encodeURIComponent(songId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete song from cloud');
      }

      console.log('✅ Song deleted from cloud');
    } catch (error) {
      console.error('❌ Cloud sync error (delete):', error);
      throw error;
    }
  }

  /**
   * Sync local songs to cloud
   * Uploads all songs from localStorage to DynamoDB
   */
  async syncToCloud(songs: SavedSong[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const song of songs) {
      try {
        await this.saveSong(song);
        success++;
      } catch (error) {
        console.error(`Failed to sync song: ${song.name}`, error);
        failed++;
      }
    }

    console.log(`📤 Cloud sync complete: ${success} success, ${failed} failed`);
    return { success, failed };
  }

  /**
   * Check if cloud sync is available (simple connectivity test)
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Try to fetch with a test userId - if it returns without network error, we're good
      const response = await fetch(`${API_BASE_URL}/songs?userId=test`, {
        method: 'GET',
      });
      return response.ok || response.status < 500; // Any response means API is reachable
    } catch (error) {
      console.warn('Cloud sync not available:', error);
      return false;
    }
  }
}

export const cloudSyncService = new CloudSyncService();

