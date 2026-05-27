# 🎵 API SoundCloud - Intégration JavaScript

API JavaScript simple pour accéder à SoundCloud directement depuis votre application. Zéro dépendances back-end !

## 🚀 Installation

### 1. Configurer l'environnement

Copier `.env.example` en `.env` :
```bash
cp .env.example .env
```

Ajouter votre SoundCloud Client ID dans `.env` :
```
VITE_SOUNDCLOUD_CLIENT_ID=your_client_id_here
```

**Obtenir un Client ID gratuit :** https://soundcloud.com/you/apps

### 2. Utiliser dans votre app

```javascript
import soundCloudClient from '@/soundcloudClient.js';

// Rechercher des musiques
const results = await soundCloudClient.search('lo-fi beats', 10);

// Obtenir une track aléatoire
const track = await soundCloudClient.getRandomTrack();

// Obtenir les détails d'une track
const trackDetails = await soundCloudClient.getTrack(123456);
```

---

## 📚 API Complète

### `search(query, limit = 10)`
Rechercher des musiques
```javascript
const results = await soundCloudClient.search('chill', 15);
// Retourne: [{ id, title, artist, artwork, duration, ... }, ...]
```

### `getTrack(id)`
Obtenir les détails d'une track
```javascript
const track = await soundCloudClient.getTrack(123456);
// Retourne: { id, title, artist, artwork, duration, plays, likes, ... }
```

### `getRandomTrack(genre = '')`
Obtenir une track aléatoire
```javascript
const track = await soundCloudClient.getRandomTrack();
const ambientTrack = await soundCloudClient.getRandomTrack('ambient');
```

### `checkAnswer(userGuess, correctTitle)`
Vérifier une réponse (comparaison exacte)
```javascript
const isCorrect = soundCloudClient.checkAnswer('lo-fi beats', 'Lo-Fi Beats');
// Retourne: true (case-insensitive)
```

### `checkPartialMatch(userGuess, correctTitle)`
Vérifier une correspondance partielle (pour les indices)
```javascript
const hasMatch = soundCloudClient.checkPartialMatch('lo-fi', 'Chill Lo-Fi Beats');
// Retourne: true
```

### `searchUsers(username)`
Rechercher des utilisateurs
```javascript
const users = await soundCloudClient.searchUsers('lo-fi beats');
// Retourne: [{ id, username, ... }, ...]
```

### `getUserTracks(userId, limit = 10)`
Obtenir les tracks d'un utilisateur
```javascript
const tracks = await soundCloudClient.getUserTracks(12345, 20);
// Retourne: [{ id, title, ... }, ...]
```

### `advancedSearch(filters)`
Recherche avancée avec filtres
```javascript
const results = await soundCloudClient.advancedSearch({
  query: 'music',
  genre: 'electronic',
  limit: 20
});
```

---

## 💾 Structure retournée d'une Track

```javascript
{
  id: 123456,
  title: "Chill Lo-Fi Beat",
  artist: "lo-fi beats",
  artwork: "https://...",           // URL image 500x500
  duration: 180000,                 // Durée en millisecondes
  url: "https://soundcloud.com/...", // Lien SoundCloud
  streamUrl: "https://...",         // URL de stream audio
  playable: true,                   // Peut être joué
  description: "...",
  plays: 50000,                     // Nombre de lectures
  likes: 1200,                      // Nombre de likes
  genre: "lo-fi",
  released: "2023-01-15"            // Date de publication
}
```

---

## 🎮 Exemple d'utilisation dans Vue.js

```vue
<script setup>
import { ref, onMounted } from 'vue';
import soundCloudClient from '@/soundcloudClient.js';

const currentTrack = ref(null);
const userGuess = ref('');
const message = ref('');
const isLoading = ref(false);

onMounted(async () => {
  try {
    isLoading.value = true;
    currentTrack.value = await soundCloudClient.getRandomTrack();
  } catch (error) {
    message.value = '❌ Erreur: ' + error.message;
  } finally {
    isLoading.value = false;
  }
});

async function submitGuess() {
  if (!userGuess.value || !currentTrack.value) return;
  
  const isCorrect = soundCloudClient.checkAnswer(
    userGuess.value,
    currentTrack.value.title
  );
  
  message.value = isCorrect ? '✅ Correct!' : '❌ Incorrect';
}

async function skipTrack() {
  try {
    isLoading.value = true;
    currentTrack.value = await soundCloudClient.getRandomTrack();
    userGuess.value = '';
    message.value = '';
  } catch (error) {
    message.value = '❌ Erreur: ' + error.message;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="game">
    <h1>🎵 Heardle</h1>
    
    <div v-if="currentTrack" class="player">
      <img v-if="currentTrack.artwork" :src="currentTrack.artwork" alt="Album art" />
      <audio :src="currentTrack.streamUrl" controls />
    </div>

    <div class="form">
      <input 
        v-model="userGuess" 
        placeholder="Entrez le titre de la musique..."
        @keyup.enter="submitGuess"
      />
      <button @click="submitGuess" :disabled="isLoading">Soumettre</button>
      <button @click="skipTrack" :disabled="isLoading">Passer</button>
    </div>

    <div v-if="message" :class="['result', message.includes('✅') ? 'success' : 'error']">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.game {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
}

.player {
  margin: 30px 0;
}

.player img {
  max-width: 300px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.player audio {
  width: 100%;
  max-width: 300px;
}

.form {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.form input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form button {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result {
  padding: 15px;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 20px;
}

.result.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.result.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
```

---

## ⚠️ Important

- **Client ID gratuit** - Accès limité à l'API SoundCloud
- **CORS** - Attention aux restrictions cross-origin en production
- **Licence** - Respectez les conditions d'utilisation de SoundCloud

---

## 🐛 Troubleshooting

### Erreur: "SoundCloud Client ID not configured"
→ Vérifiez que `.env` contient `VITE_SOUNDCLOUD_CLIENT_ID`

### Tracks non jouables
→ Vérifiez que `track.playable === true` avant de jouer

### Pas de résultats
→ Vérifiez votre Client ID sur https://soundcloud.com/you/apps

---

## 📁 Fichiers

- `src/soundcloudApi.js` - API principale
- `src/soundcloudClient.js` - Client pour Vue.js
- `.env.example` - Configuration exemple
