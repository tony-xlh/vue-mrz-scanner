<script setup lang="ts">
import { ref } from 'vue';
import MRZScanner from './components/MRZScanner.vue'
import { DLRLineResult } from 'dynamsoft-label-recognizer';

const scanning = ref(false);
const showScanner = ref(false);
const MRZLineResults = ref<DLRLineResult[]>([]);
const confirmed = ref(false);
const showConfirmation = ref(false);

const startScanner = () => {
  confirmed.value = false;
  showConfirmation.value = false;
  scanning.value = true;
  showScanner.value = true;
}

const stopScanner = () => {
  showConfirmation.value = false;
  scanning.value = false;
  showScanner.value = false;
}

const onScanned = (results:DLRLineResult[]) => {
  MRZLineResults.value = results;
  showConfirmation.value = true;
}

const MRZString = () => {
  let str = "";
  for (let index = 0; index < MRZLineResults.value.length; index++) {
    const lineResult = MRZLineResults.value[index];
    str = str + lineResult.text;
    if (index != MRZLineResults.value.length - 1) {
      str = str + "\n";
    }
  }
  return str;
}

const correct = () => {
  confirmed.value = true;
  scanning.value = false;
  showScanner.value = false;
}

const rescan = () => {
  showConfirmation.value = false;
  //scanning.value = true;
}

</script>

<template>
  <div v-if="!showScanner">
    <h2>MRZ Scanner</h2>
    <button @click="startScanner">Start Scanning MRZ</button>
    <pre v-if="confirmed">{{ MRZString() }}</pre>
  </div>
  <div v-if="showScanner">
    <MRZScanner 
      :scanning="scanning"
      @scanned="(results)=>onScanned(results)"
    >
      <button class="close-button" @click="stopScanner">Close</button>
      <div v-if="showConfirmation" class="confirmation modal">
        <pre>{{MRZString()}}</pre>
        <button @click="correct">Correct</button>
        <button @click="rescan">Rescan</button>
      </div>
    </MRZScanner>
  </div>
</template>

<style scoped>
.close-button {
  position: absolute;
  top: 0;
  right: 0;
}

.modal {
  position: absolute;
  left: 50%;
  top: 50px;
  transform: translateX(-50%);
  z-index: 99999;
  background: #fff;
  padding: 10px;
  border: thick double black;
  border-radius: 5px;
  font-family: sans-serif;
}
.confirmation {
  text-align: center;
}

@media screen and (max-device-width: 600px){
  .confirmation {
    width: 90%;
  }
}

.confirmation pre {
  white-space: break-spaces;
  word-break: break-all;
}
</style>
