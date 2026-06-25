<template>
  <VueFinalModal class="modal" content-class="modal-content">
    <ul>
      <li v-for="music in props.source" :key="music.id">
          {{ music.title }} - {{ music.game || music.franchise }}
      </li>
    </ul>
  </VueFinalModal>
</template>

<script setup>
import { VueFinalModal } from 'vue-final-modal';
import { ref } from 'vue';

const props = defineProps(['source']);
const visible = ref(false);
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