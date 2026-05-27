// soundcloudClient.js - Client pour utiliser l'API SoundCloud dans Vue.js
// Fourni une interface simple pour accéder à l'API SoundCloud

import soundCloudAPI from './soundcloudApi.js';

/**
 * Client API SoundCloud pour Vue.js
 */
class SoundCloudClient {
  async authenticate() {
    return soundCloudAPI.authenticate();
  }

  async refreshAuth() {
    return soundCloudAPI.refreshAuth();
  }

  /**
   * Rechercher des musiques
   * @param {string} query - Requête de recherche
   * @param {number} limit - Nombre de résultats
   * @example
   * const results = await soundCloudClient.search('lo-fi', 10);
   */
  async search(query, limit = 10) {
    return soundCloudAPI.searchTracks(query, limit);
  }

  /**
   * Obtenir les détails complètes d'une track
   * @param {number} trackId - ID de la track
   * @example
   * const track = await soundCloudClient.getTrack(123456);
   */
  async getTrack(trackId) {
    return soundCloudAPI.getTrack(trackId);
  }

  async getTrackDetails(trackId) {
    return soundCloudAPI.getTrackDetails(trackId);
  }

  async getPlaylist(playlistId) {
    return soundCloudAPI.getPlaylist(playlistId);
  }

  async getPlaylistTracks(playlistId) {
    return soundCloudAPI.getPlaylistTracks(playlistId);
  }

  async getPlaylistTitleTracks(playlistId){
    var tracks = await this.getPlaylistTracks(playlistId);
    const titles = tracks.map(track => track.title);
    //console.log('in SoundCloudClient - Titres des pistes de la playlist:', titles);
    return titles;
  }

  async getUserPlaylists(userId) {
    return soundCloudAPI.getUserPlaylists(userId);
  }

  /**
   * Obtenir une track aléatoire
   * @param {string} genre - Genre optionnel
   * @example
   * const track = await soundCloudClient.getRandomTrack();
   * const raindrop = await soundCloudClient.getRandomTrack('ambient');
   */
  async getRandomTrack(genre = '') {
    return soundCloudAPI.getRandomTrack(genre);
  }

  async getRandomTrackFromPlaylist(playlistId) {
    var playlist = await this.getPlaylist(playlistId);
    console.log('in SoundCloudClient - Playlist details:', playlist);
    var playlistTags = playlist.tags.split('\"');
    var tracks = playlist.tracks;
    const randomIndex = Math.floor(Math.random() * tracks.length);
    var randomTrackFile = await this.getTrack(tracks[randomIndex].id);
    var normalizedTitle = this.cleanTitle(tracks[randomIndex].title, playlistTags[3]);
    var randomTrack = {
      title: normalizedTitle,
      file: randomTrackFile
    };
    return randomTrack;
  }

  async getRandomTrackFromUser(userId) {
    var playlists = await this.getUserPlaylists(userId);
    //console.log('in SoundCloudClient - Playlists de l\'utilisateur:', playlists);
    const randomPlaylistIndex = Math.floor(Math.random() * playlists.length);
    var randomPlaylist = playlists[randomPlaylistIndex];
    // console.log('in SoundCloudClient - Playlist aléatoire sélectionnée:', randomPlaylist);
    var playlistTags = randomPlaylist.tags.split('\"');
    // console.log('in SoundCloudClient - Tags de la playlist:', playlistTags);
    const randomTrackIndex = Math.floor(Math.random() * randomPlaylist.tracks.length);
    var randomTrackFile = await this.getTrack(randomPlaylist.tracks[randomTrackIndex].id);
    var normalizedTitle = this.cleanTitle(randomPlaylist.tracks[randomTrackIndex].title, playlistTags[3]);
    var randomTrack = {
      franchise: playlistTags[1] || '',
      game : playlistTags[3] || '',
      title: normalizedTitle,
      file: randomTrackFile,
      id: randomPlaylist.tracks[randomTrackIndex].id
    };
    return randomTrack;
  }

  cleanTitle(title, playlistTag) {
    return title.replace(RegExp(playlistTag, 'i'), '').replace(/soundtrack|ost/i, '').replace(" - ", "").trim();
  }

  /**
   * Obtenir une correspondance partielle (pour les indices)
   * @param {string} userGuess - Réponse de l'utilisateur
   * @param {string} correctTitle - Titre correct
   * @returns {boolean} True si la réponse contient des mots clés
   * @example
   * const partialMatch = soundCloudClient.checkPartialMatch('chill', 'chill lo-fi beats');
   */
  checkPartialMatch(userGuess, correctTitle) {
    const normalize = (str) => str.toLowerCase().trim();
    const guess = normalize(userGuess).split(' ');
    const correct = normalize(correctTitle).split(' ');
    return guess.some(word => correct.some(correctWord => correctWord.includes(word)));
  }

  /**
   * Rechercher un utilisateur
   * @param {string} username - Nom d'utilisateur
   * @example
   * const users = await soundCloudClient.searchUsers('lo-fi beats');
   */
  async searchUsers(username) {
    return soundCloudAPI.searchUsers(username);
  }

  /**
   * Obtenir les tracks d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {number} limit - Nombre de résultats
   * @example
   * const tracks = await soundCloudClient.getUserTracks(12345, 20);
   */
  async getUserTracks(userId, limit = 10) {
    return soundCloudAPI.getUserTracks(userId, limit);
  }

  /**
   * Effectuer une recherche avancée
   * @param {object} filters - Filtres de recherche
   * @example
   * const results = await soundCloudClient.advancedSearch({
   *   query: 'music',
   *   genre: 'electronic',
   *   limit: 20
   * });
   */
  async advancedSearch(filters = {}) {
    return soundCloudAPI.advancedSearch(filters);
  }
}

export default new SoundCloudClient();
