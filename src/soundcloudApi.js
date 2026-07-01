// soundcloudApi.js - API SoundCloud en JavaScript
// Intègre l'API SoundCloud pour rechercher et récupérer des musiques

const SOUNDCLOUD_API_BASE = 'https://api.soundcloud.com';
const SOUNDCLOUD_CLIENT_ID = import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID;
const SOUNDCLOUD_CLIENT_SECRET = "SD8MC241AjTEwXvtXb4mLHDOOhMOXOjB";
var authData = null;

/**
 * Classe pour gérer les requêtes à l'API SoundCloud
 */
class SoundCloudAPI {
  constructor(clientId = SOUNDCLOUD_CLIENT_ID) {
    if (!clientId) {
      console.warn('⚠️  VITE_SOUNDCLOUD_CLIENT_ID not configured');
    }
    this.clientId = clientId;
    this.baseURL = SOUNDCLOUD_API_BASE;
  }

  async authenticate() {
    if (!window.sessionStorage.getItem('soundcloud_auth')) {
      await fetch('https://secure.soundcloud.com/oauth/token', {
        method: 'POST',
        headers: {
          'accept': 'application/json; charset=utf-8',
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${SOUNDCLOUD_CLIENT_SECRET}`),
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials'
        })
      }).then(response => response.json())
        .then(data => {
          data.expirationTime = Date.now() + data.expires_in * 1000;
          authData = data;
          window.sessionStorage.setItem('soundcloud_auth', JSON.stringify(authData));
          console.log('✅ SoundCloud API authenticated', data);
        })
        .catch(error => {
          console.error('❌ SoundCloud API authentication error:', error);
          throw error;
        });
      setTimeout(() => this.refreshAuth(), (authData.expires_in - 60) * 1000); // Rafraîchir 1 minute avant expiration  
    } else {
      authData = JSON.parse(window.sessionStorage.getItem('soundcloud_auth'));
      console.log('✅ SoundCloud API already authenticated', authData);
      setTimeout(() => this.refreshAuth(), (authData.expirationTime - Date.now() - 60000)); // Rafraîchir 1 minute avant expiration
    }
  }

  async refreshAuth() {
    console.log('in refreshAuth - Current auth data:', authData);
    await fetch('https://secure.soundcloud.com/oauth/token', {
      method: 'POST',
      headers: {
        'accept': 'application/json; charset=utf-8',
        'content-type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'refresh_token',
        'client_id': this.clientId,
        'client_secret': SOUNDCLOUD_CLIENT_SECRET,
        'refresh_token': authData.refresh_token
      })
    }).then(response => response.json())
      .then(data => {
        data.expirationTime = Date.now() + data.expires_in * 1000;
        authData = data;
        window.sessionStorage.setItem('soundcloud_auth', JSON.stringify(authData));
        console.log('✅ SoundCloud API refreshed', data);
      })
      .catch(error => {
        console.error('❌ SoundCloud API refresh error:', error);
        throw error;
      });
    setTimeout(() => this.refreshAuth(), (authData.expirationTime - Date.now() - 60000)); // Rafraîchir 1 minute avant expiration
  }

  /**
   * Effectuer une requête à l'API SoundCloud
   * @param {string} endpoint - L'endpoint de l'API (ex: /tracks)
   * @param {object} params - Les paramètres de requête
   * @returns {Promise<object>} Réponse de l'API
   */
  async request(endpoint, params = {}) {
    try {
      if (!authData) {
        throw new Error('SoundCloud API not authenticated');
      }

      const url = new URL(`${this.baseURL}${endpoint}`);

      // Ajouter les paramètres
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${authData.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error(`SoundCloud API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('SoundCloud API request error:', error);
      throw error;
    }
  }

  /**
   * Rechercher des musiques sur SoundCloud
   * @param {string} query - Requête de recherche
   * @param {number} limit - Nombre de résultats (défaut: 10)
   * @returns {Promise<array>} Liste des tracks formatées
   */
  async searchTracks(query, limit = 10) {
    try {
      const data = await this.request('/tracks', {
        q: query,
        limit: Math.min(limit, 200), // Max 200
        linked_partitioning: 1
      });

      return data.collection.map(track => this.formatTrack(track));
    } catch (error) {
      console.error('Error searching tracks:', error);
      throw error;
    }
  }

  /**
   * Obtenir les détails d'une track spécifique
   * @param {number} trackId - ID de la track
   * @returns {Promise<object>} Détails de la track
   */
  async getTrack(trackId) {
    const ctx = new AudioContext();
    var trackFile = null;
    try {
      const track = await this.request(`/tracks/soundcloud:tracks:${trackId}/streams`);
      // console.log('in SoundCloudApi - Track details:', track);
      const trackBlob = await fetch(track.http_mp3_128_url, {
        headers: {
          'Authorization': `Bearer ${authData.access_token}`
        }}).then(res => res.blob());
      // console.log('in SoundCloudApi - Track file decoded', window.URL.createObjectURL(trackBlob));
      return window.URL.createObjectURL(trackBlob);
    } catch (error) {
      console.error('Error fetching track:', error);
      throw error;
    }
  }

  async getTrackDetails(trackId) {
    try {
      const track = await this.request(`/tracks/soundcloud:tracks:${trackId}`);
      return track;
    } catch (error) {
      console.error('Error fetching track details:', error);
      throw error;
    }
  }

  /**
   * Obtenir une track aléatoire
   * @param {string} genre - Genre de musique (défaut: aléatoire)
   * @returns {Promise<object>} Track formatée
   */
  async getRandomTrack(genre = '') {
    try {
      const genres = [
        'electronic', 'hip-hop', 'indie', 'pop', 'rock',
        'lo-fi', 'jazz', 'ambient', 'dubstep', 'house',
        'techno', 'drum and bass'
      ];

      const randomGenre = genre || genres[Math.floor(Math.random() * genres.length)];

      const data = await this.request('/tracks', {
        q: randomGenre,
        limit: 50,
        linked_partitioning: 1
      });

      if (!data.collection || data.collection.length === 0) {
        throw new Error('No tracks found');
      }

      const randomTrack = data.collection[Math.floor(Math.random() * data.collection.length)];
      return this.formatTrack(randomTrack);
    } catch (error) {
      console.error('Error fetching random track:', error);
      throw error;
    }
  }

  async getPlaylist(playlistId) {
    try {
      const playlist = await this.request(`/playlists/soundcloud:playlists:${playlistId}`);
      return playlist;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  }

  async getPlaylistTracks(playlistId) {
    try {
      const data = await this.request(`/playlists/soundcloud:playlists:${playlistId}/tracks`,{access: 'playable'});
      //console.log('in SoundCloudApi - Playlist tracks:', data);
      return data;
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      throw error;
    }
  }

  async getUserPlaylists(userId) {
    try {
      const data = await this.request(`/users/soundcloud:users:${userId}/playlists`, { limit: 200 });
      console.log('in SoundCloudApi - User playlists:', data);
      return data || [];
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      throw error;
    }
  }

  /**
   * Rechercher par utilisateur
   * @param {string} username - Nom d'utilisateur
   * @returns {Promise<array>} Liste des utilisateurs
   */
  async searchUsers(username) {
    try {
      const data = await this.request('/users', {
        q: username,
        limit: 10
      });

      return data.collection || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  /**
   * Obtenir les tracks d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {number} limit - Nombre de résultats
   * @returns {Promise<array>} Liste des tracks
   */
  async getUserTracks(userId, limit = 10) {
    try {
      const data = await this.request(`/users/${userId}/tracks`, {
        limit: Math.min(limit, 200)
      });

      return data.collection.map(track => this.formatTrack(track));
    } catch (error) {
      console.error('Error fetching user tracks:', error);
      throw error;
    }
  }

  /**
   * Effectuer une recherche avancée
   * @param {object} filters - Filtres de recherche
   * @returns {Promise<array>} Résultats de recherche
   */
  async advancedSearch(filters = {}) {
    try {
      const {
        query = '',
        genre = '',
        limit = 10,
        duration_from = 0,
        duration_to = 0
      } = filters;

      const params = {
        q: query,
        limit: Math.min(limit, 200),
        linked_partitioning: 1
      };

      if (genre) params.q = `${params.q} genre:${genre}`.trim();
      if (duration_from) params.duration_from = duration_from;
      if (duration_to) params.duration_to = duration_to;

      const data = await this.request('/tracks', params);

      return data.collection.map(track => this.formatTrack(track));
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  /**
   * Formater une track pour l'utilisation dans l'app
   * @private
   * @param {object} track - Objet track brut de l'API
   * @returns {object} Track formatée
   */
  formatTrack(track) {
    return {
      id: track.id,
      title: track.title || 'Unknown Title',
      artist: track.user?.username || 'Unknown Artist',
      artwork: track.artwork_url?.replace('-large.', '-t500x500.') || null,
      duration: track.duration || 0,
      url: track.permalink_url || '',
      streamUrl: this.getStreamUrl(track),
      playable: this.isPlayable(track),
      description: track.description || '',
      plays: track.playback_count || 0,
      likes: track.likes_count || 0,
      genre: track.genre || '',
      released: track.released_at || null
    };
  }

  /**
   * Vérifier si une track est jouable
   * @private
   */
  isPlayable(track) {
    // Une track est jouable si elle n'a pas de restriction personnalisée
    return track.policy !== 'BLOCK' && track.downloadable !== false;
  }
}

// Exporter une instance singleton
export default new SoundCloudAPI();
