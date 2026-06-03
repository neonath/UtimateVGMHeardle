<template>
    <button class="img-button" @click="visible = true"><v-icon name="md-menu-outlined" scale="1.25" inverse class="image-2"/></button>
    <DialogModalBox 
        v-model:visible="visible" 
        :maxButton="false"
        :title="'Liste des musiques'"
        :customClass="'game-list'">

        <ul>
            <li v-for="music in props.source" :key="music.id">
                {{ music.title }} - {{ music.game }}
            </li>
        </ul>
    </DialogModalBox>
</template>

<script setup>
import { DialogModalBox } from 'v-dialogs';
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