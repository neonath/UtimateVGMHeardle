<template>
    <div class="player width-640px">
        <div class="w-layout-hflex flex-block">
            <div class="form-2">
              <button @click="mute" class="img-button">
                <v-icon v-if="muteState === 'mute'" name="md-volumemute-outlined" scale="1.25" inverse/>
                <v-icon v-else name="md-volumeup-outlined" scale="1.25" inverse/>
              </button>
              <input type="range" class="input" max="100" value="100" @input="onInput">
            </div>
            <button @click="play" class="img-button">
                <v-icon v-if="state === 'play'" name="md-playcircle-outlined" scale="3.75" inverse/>
                <v-icon v-else name="md-pausecircle-outlined" scale="3.75" inverse/>
            </button>
        </div>
        <progress :max=progressMaxValue :value=progressValue class="progress"></progress>
        <div class="w-layout-hflex width-640px space-between">
            <div class="text-block">{{ currentTime }}</div>
            <div class="text-block">{{ endTime }}</div>
        </div>
        <audio :src="file" ref="audioTag" @loadedmetadata="initPlayer" @timeupdate="onTimeupdate"/>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    file : String,
    guessNumber : Number,
    answerState : String
})
const audioTag = ref(null);
const currentTime = ref("00:00");
const endTime = ref("00:00");
const progressMaxValue = ref(100);
const progressValue = ref(0);
const state = ref('play');
const muteState = ref('unmute');

function play(){
    if(state.value === 'play'){
        audioTag.value.play();
        state.value = 'pause';
    } else {
        audioTag.value.pause();
        state.value = 'play';
    }
}

function mute(){
    if(muteState.value === 'unmute'){
        audioTag.value.muted = true;
        muteState.value = 'mute';
    } else {
        audioTag.value.muted = false;
        muteState.value = 'unmute';
    }
}

function initPlayer(){
    var duration = 0;
    if(props.answerState != "title"){
        duration = 16;
    }
    else{
        duration = audioTag.value.duration;
    }
    displayAudioDuration(duration);
    setSliderMax(Math.floor(duration));
}

function displayAudioDuration(duration){
    endTime.value = calculateTime(duration);
}

function setSliderMax(duration){
    progressMaxValue.value = duration;
}

function onTimeupdate(){
    const audio = audioTag.value;
    progressValue.value = audio.currentTime;
    currentTime.value = calculateTime(audio.currentTime);

    if (props.answerState == "title" || props.answerState == "failed"){
        displayAudioDuration(audio.duration);
        setSliderMax(Math.floor(audio.duration));
    }else{
        switch(props.guessNumber){
            case 0:
                if(audio.currentTime >= 1){
                    stop();
                }
                break;
            case 1:
                if(audio.currentTime >= 2){
                    stop();
                }
                break;
            case 2:
                if(audio.currentTime >= 4){
                    stop();
                }
                break;
            case 3:
                if(audio.currentTime >= 7){
                    stop();
                }
                break;
            case 4:
                if(audio.currentTime >= 11){
                    stop();
                }
                break;
            case 5:
                if(audio.currentTime >= 16){
                    stop();
                }
                break;
        }
    }
}

function stop(){
    audioTag.value.pause();
    audioTag.value.currentTime = 0;
    state.value = 'play';
}

function onInput(event){
    const audio = audioTag.value;
    audio.volume = event.target.value / 100;
}

function calculateTime(seconds){
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

</script>

<style scope>

.player {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.img-button {
  background: none;
  border: none;
  cursor: pointer;
}

.progress {
  flex-flow: row;
  justify-content: center;
  align-items: center;
  width: 640px;
  height: 10px;
  display: block;
  margin: 8px;
}

.input[type="range"] {
  margin: 0px;
}

.w-layout-hflex {
  flex-direction: row;
  align-items: flex-start;
  display: flex;
}

.flex-block {
  justify-content: center;
  align-items: center;
}

.form-2 {
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  display: flex;
}

.space-between {
  justify-content: space-between;
}

.width-640px {
 width: 640px;
}

.text-block {
  color: #fff;
}

</style>