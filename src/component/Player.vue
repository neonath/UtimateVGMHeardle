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
        <!-- <audio ref="audioTag" @loadedmetadata="initPlayer" @timeupdate="onTimeupdate"></audio> -->
        <iframe id="iframeTag" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay;encrypted-media;unload" :src="soundUrl" @load="initPlayer" class="display-none">
        </iframe>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps({
    soundUrl : String,
    guessNumber : Number,
    answerState : String
})
const emit = defineEmits(['PlayerSCReady']);
const currentTime = ref("00:00");
const endTime = ref("00:00");
const progressMaxValue = ref(100);
const progressValue = ref(0);
const state = ref('play');
const muteState = ref('unmute');
let PlayerSC = null;

// onMounted(async () => {
    
// });

function play(){
    if(state.value === 'play'){
        PlayerSC.play();
        state.value = 'pause';
    } else {
        PlayerSC.pause();
        state.value = 'play';
    }
}

function mute(){
    if(muteState.value === 'unmute'){
        PlayerSC.setVolume(0);
        muteState.value = 'mute';
    } else {
        PlayerSC.setVolume(100);
        muteState.value = 'unmute';
    }
}

function initPlayer(){
    console.log("in Player - SoundUrl:", props.soundUrl);
    var duration = 0;
    const iframeTag = document.getElementById('iframeTag');

    PlayerSC = window.SC.Widget(iframeTag);
    PlayerSC.bind(SC.Widget.Events.READY, function() {
        console.log("in Player - PlayerSC ready");
        emit('PlayerSCReady');
        PlayerSC.bind(SC.Widget.Events.PLAY_PROGRESS, onTimeupdate);
    });

    if(props.answerState != "title"){
        duration = 16;
        displayAudioDuration(duration);
        setSliderMax(Math.floor(duration));
    }
    else{
        PlayerSC.getDuration(function(value) {
            duration = value / 1000;
            displayAudioDuration(duration);
            setSliderMax(Math.floor(duration));
        });
    }
    
}

function displayAudioDuration(duration){
    endTime.value = calculateTime(duration);
}

function setSliderMax(duration){
    progressMaxValue.value = duration;
}

function onTimeupdate(soundData){
    console.log("in Player - onTimeupdate - soundData:", soundData);
    let currentPosition = soundData.currentPosition / 1000;
    progressValue.value = currentPosition;
    currentTime.value = calculateTime(currentPosition);

    if (props.answerState == "title" || props.answerState == "failed"){
        PlayerSC.getDuration(function(value) {
            let duration = value / 1000;
            displayAudioDuration(duration);
            setSliderMax(Math.floor(duration));
        });
    }else{
        switch(props.guessNumber){
            case 0:
                if(currentPosition >= 1){
                    stop();
                }
                break;
            case 1:
                if(currentPosition >= 2){
                    stop();
                }
                break;
            case 2:
                if(currentPosition  >= 4){
                    stop();
                }
                break;
            case 3:
                if(currentPosition >= 7){
                    stop();
                }
                break;
            case 4:
                if(currentPosition >= 11){
                    stop();
                }
                break;
            case 5:
                if(currentPosition >= 16){
                    stop();
                }
                break;
        }
    }
}

function stop(){
    PlayerSC.pause();
    PlayerSC.seekTo(0);
    state.value = 'play';
}

function onInput(event){
    PlayerSC.setVolume(event.target.value);
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

.display-none {
  display: none;
}

</style>