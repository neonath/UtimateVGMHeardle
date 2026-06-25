<template>
  <VueFinalModal class="modal" content-class="modal-content">
    <!-- <input name="search" placeholder="Chercher un jeu" type="text" class="input rounded-pills" @input="onInputChange"/> -->
    <div v-for="franchise in source" :key="franchise.name">
      <div class="block item sub-header">
        {{ franchise.name }}
      </div>
      <div v-for="game in franchise.games" :key="game.id" class="block item item--hover checkbox-item">
        <input type="checkbox" :id="game.id" :value="game.id" v-model="selectedGame" class="checkbox-item--checked"/>
        <label :for="game.id" class="sm-block__body">
          {{ game.name }}
        </label>
      </div>
    </div>
    <button @click="onClick" class="button rounded-pills">
      Valider
    </button>
  </VueFinalModal>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { VueFinalModal } from 'vue-final-modal';
const props = defineProps(['title','source']);
const emit = defineEmits(['filterClicked','confirm']);
const dropdownSelection = ref(null);
const selectedGame = ref([]);
let data = reactive({
    search: '',
    isOpen: false,
    results: []
});
console.log("selectedGame", selectedGame);

onMounted(() => {
    if(!window.localStorage.getItem("selected_game")){
      // Si aucune sélection de jeu n'est enregistrée, on fait rien et selectedGame reste un tableau vide
    }else{
       selectedGame.value = JSON.parse(window.localStorage.getItem("selected_game")); 
    }
    console.log("in GameSelection - selectedGame.value", selectedGame.value);
});

function onInputChange(event) {
    if(!props.source || !data.search) 
        return false;
    arrayLikeSearch(props.source);
}

function onClick() {
  emit('filterClicked', selectedGame.value);
  emit('confirm', selectedGame.value);
  let saveSelectedGame = window.localStorage.getItem("selected_game");
  if(!saveSelectedGame){
    if(selectedGame.value.length > 0){
      window.localStorage.setItem("selected_game", JSON.stringify(selectedGame.value));
    }
  }else{
    if(selectedGame.value.length > 0){
      window.localStorage.setItem("selected_game", JSON.stringify(selectedGame.value));
    }else{
      window.localStorage.removeItem("selected_game");
    }
  }
}

function arrayLikeSearch(value){
    data.results = items.filter((item) => {
        var filter = item.title.toLowerCase().indexOf(value) > -1 ||
                     item.game.toLowerCase().indexOf(value) > -1 ;
        return filter;
    });
}
</script>

<style>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius : 0.5rem;
  background-color: #141414;
  max-height: 80vh;
  overflow-y: auto;
}
</style>

<style scoped>

.layout-vflex {
  flex-direction: column;
  align-items: flex-start;
  display: flex;
}

.width-640px {
  width: 640px;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  border-color: #444;
  width: 100%;
}

.suggestion-list-item {
  padding: 8px 16px;
  border-bottom: 1px solid #444444;
  cursor: pointer;
  color: #fff;
}

.suggestion-list-item:hover {
  background-color: #333;
}

.input{
  display: flex;
  align-items: center;
  margin: .5rem 1rem;
  padding: .35rem .8rem;
  background-color: #333;
  transition: background-color .3s;
  min-width: 8rem;
  gap: .5rem;
}

.rounded-pills{
  border-radius: 50rem;
}

.item.sub-header{
  cursor: default;
  font-weight: 600;
  padding: .5rem 1rem;
  margin: 0;
  font-size: 1rem;
  color: #999;
}

.item{
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
}

.item--hover:hover{
  background-color: #333;
}

.block{
  display:flex;
  align-items: center;
  padding: .5rem;
  margin: 0 .5rem;
  font-size: 14px;
  gap: .5rem;
}

.checkbox-item--checked{
  display: inline-flex;
  align-items: flex-end;
  justify-content: center;
  width: 1.2rem;
  font-size: 1rem;
  height: 20px;
}

.button{
  display:inline-flex;
  align-items: center;
  padding: .5rem 1rem;
  background-color: #333;
  cursor: pointer;
  transition: all .3s;
  height: 30px;
  gap: .5rem;
  font-size: 500;
  width: fit-content;
}

.button__prepend, .button__body, .button__append{
  display: inline-flex;
  align-items: center;
}

.button__body{
  flex-grow: 1;
  line-height: 1.3;
  user-select: none;
  justify-content: center;
  color: #fff;
}

button.block{
  display: flex;
  flex-grow: 1;
  width: auto;
  margin: .5rem 1rem;
}

</style>