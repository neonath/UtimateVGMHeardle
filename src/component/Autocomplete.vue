<template>
    <Dropdown :manual="true" ref="dropdown">
        <template #trigger>
            <input v-model="data.search" placeholder="Rechercher le titre/le jeu (minimum 3 caractères)" type="text" class="w-input" :name="props.name" @input="onInputChange">
        </template>
        <DropdownContent class="autocomplete-dropdown">
            <ul class="autocomplete-suggestion-list">
                <li class="autocomplete-suggestion-list-item" v-for="result in data.results" :key="result" @click="onItemClick(result,$event)">{{ result.title}} - {{ result.game }}</li>
            </ul>
        </DropdownContent>
    </Dropdown>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { Dropdown, DropdownContent } from 'v-dropdown';
const props = defineProps(['name','source']);
const emit = defineEmits(['itemClicked']);
const dropdown = ref(null);

let data = reactive({
    search: '',
    isOpen: false,
    results: []
});

function onInputChange(event) {
    if(!props.source || !data.search) 
        return false;
    if(event.target.value.length >= 3){
        arrayLikeSearch(props.source);
        dropdown.value.open();
    }else{
        dropdown.value.close();
    } 
}

function onItemClick(item,event) {
  console.log('in Autocomplete - Item clicked:', item);
  data.search = item.title+' - '+item.game;
  emit('itemClicked', item);
  dropdown.value.close();
}

function arrayLikeSearch(items){
    data.results = items.filter((item) => {
        var filter = item.title.toLowerCase().indexOf(data.search.toLowerCase()) > -1 ||
                     item.game.toLowerCase().indexOf(data.search.toLowerCase()) > -1 ;
        return filter;
    });
}
</script>

<style scoped>
.width-640px {
  width: 640px;
}

.background-black{
  background-color: #141414;
}

.autocomplete-dropdown {
  width: 640px;
  background-color: #141414;
}

.autocomplete-suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  border-color: #444;
  width: 100%;
}

.autocomplete-suggestion-list-item {
  padding: 8px 16px;
  border-bottom: 1px solid #444444;
  cursor: pointer;
  color: #fff;
}

.autocomplete-suggestion-list-item:hover {
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