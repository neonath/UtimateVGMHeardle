<template>
  <VueFinalModal class="modal" content-class="modal-content">
    <div>Franchises: {{ source.length }}</div>
    <div>Games: {{ count.game }}</div>
    <div>Musics: {{ count.music }}</div>
    <div v-for="franchise in source" :key="franchise.name">
      <h2 class="block item sub-header">
        {{ franchise.name }}
      </h2>
      <div v-for="game in franchise.games" :key="game.id" class="block item item--hover checkbox-item">
        <h3 class="sm-block__body">
          {{ game.name }}
        </h3>
        <ul>
          <li v-for="music in game.musics" :key="music.id">
            {{ music.title }}
          </li>
        </ul>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal';
import { ref } from 'vue';

const props = defineProps(['source','count']);
const visible = ref(false);
const franchiseCount = ref(0);
const gameCount = ref(0);
</script>

<style scoped>

.img-button {
  background: none;
  border: none;
  cursor: pointer;
}

.image, .image-2 {
  width: 24px;
  height: 24px;
}
</style>