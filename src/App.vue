<script setup lang="ts">
import { ref } from 'vue';
import MRZScanner from './components/MRZScanner.vue'
import { DLRLineResult } from 'dynamsoft-label-recognizer';

const scanning = ref(false);
const showScanner = ref(false);

const startScanner = () => {
  scanning.value = true;
  showScanner.value = true;
}

const stopScanner = () => {
  scanning.value = false;
  showScanner.value = false;
}

const onScanned = (results:DLRLineResult[]) => {
  console.log(results);
}

</script>

<template>
  <div v-if="!showScanner">
    <h2>MRZ Scanner</h2>
    <button @click="startScanner">Start Scanning MRZ</button>
  </div>
  <div v-if="showScanner">
    <MRZScanner 
      :scanning="scanning"
      @scanned="(results)=>onScanned(results)"
    >
      <button class="close-button" @click="stopScanner">Close</button>
    </MRZScanner>
  </div>
</template>

<style scoped>
.close-button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
