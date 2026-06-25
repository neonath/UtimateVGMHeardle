<template>
    <SelectMenuDropdown ref="dropdownSelection">
        <template #trigger>
            <button class="img-button"><v-icon name="md-filteralt-outlined" scale="1.25" inverse class="image"/></button>
        </template>
        <template #default="{ close }">
        <SelectMenuBody>
          <SelectMenuInput placeholder="Chercher un jeu" @search="arrayLikeSearch"/>
          <SelectMenuCheckboxGroup v-model="selectedGame">
            <div v-for="franchise in props.source" :key="franchise.name">
              <SelectMenuSubHeader>
                {{ franchise.name }}
              </SelectMenuSubHeader>
              <SelectMenuCheckboxItem v-for="game in franchise.games" :key="game.id" :value="game.id">
                {{ game.name }}
              </SelectMenuCheckboxItem>
            </div>
          </SelectMenuCheckboxGroup>
          <SelectMenuButton @click="onClick(close)">
            Valider
          </SelectMenuButton>
        </SelectMenuBody>
        </template>
    </SelectMenuDropdown>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { SelectMenuBody, SelectMenuCheckboxGroup, SelectMenuDropdown, SelectMenuInput, SelectMenuCheckboxItem, SelectMenuRow, SelectMenuSubHeader, SelectMenuSection, SelectMenuChildLevel, SelectMenuButton } from 'v-selectmenu';
const props = defineProps(['name','source']);
const emit = defineEmits(['filterClicked']);
const dropdownSelection = ref(null);
const selectedGame = ref([]);
let data = reactive({
    search: '',
    isOpen: false,
    results: []
});

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

function onClick(close) {
  emit('filterClicked', selectedGame.value);
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
  close();
}

function arrayLikeSearch(value){
    data.results = items.filter((item) => {
        var filter = item.title.toLowerCase().indexOf(value) > -1 ||
                     item.game.toLowerCase().indexOf(value) > -1 ;
        return filter;
    });
}
</script>

<style scoped>
.layout-vflex {
  flex-direction: column;
  align-items: flex-start;
  display: flex;
}

.img-button {
  background: none;
  border: none;
  cursor: pointer;
}

.width-640px {
  width: 640px;
}

.background-black{
  background-color: #141414;
}

.dropdown {
  width: 640px;
  background-color: #141414;
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

.w-input, .w-select {
  color: #333;
  vertical-align: middle;
  background-color: #fff;
  border: 1px solid #ccc;
  width: 100%;
  height: 38px;
  margin-bottom: 10px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.42857;
  display: block;
}

.w-input::placeholder, .w-select::placeholder {
  color: #999;
}

.w-input:focus, .w-select:focus {
  border-color: #3898ec;
  outline: 0;
}

.w-input[disabled], .w-select[disabled], .w-input[readonly], .w-select[readonly], fieldset[disabled] .w-input, fieldset[disabled] .w-select {
  cursor: not-allowed;
}

.w-input[disabled]:not(.w-input-disabled), .w-select[disabled]:not(.w-input-disabled), .w-input[readonly], .w-select[readonly], fieldset[disabled]:not(.w-input-disabled) .w-input, fieldset[disabled]:not(.w-input-disabled) .w-select {
  background-color: #eee;
}

</style>