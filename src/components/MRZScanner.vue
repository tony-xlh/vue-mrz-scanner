<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref} from "vue";
import {CameraEnhancer, DrawingItem} from "dynamsoft-camera-enhancer";
import {DLRLineResult, LabelRecognizer} from "dynamsoft-label-recognizer";
const elRef: Ref<HTMLDivElement | null> = ref(null);
const defaultDCEEngineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@3.3.4/dist/";
const defaultDLRengineResourcePath  = "https://cdn.jsdelivr.net/npm/dynamsoft-label-recognizer@2.2.30/dist/";

const props = defineProps({
  license: String,
  scanning: Boolean,
  dceEngineResourcePath: String,
  dlrEngineResourcePath: String
})
const emit = defineEmits<{
  (e: 'scanned', results: DLRLineResult[]): void
  (e: 'initialized', dce:CameraEnhancer,dlr:LabelRecognizer): void
}>();

let dce:CameraEnhancer|null;
let dlr:LabelRecognizer|null;

onMounted(async()=>{
  LabelRecognizer.onResourcesLoadStarted = () => { console.log('load started...'); }
  LabelRecognizer.onResourcesLoadProgress = (_resourcesPath?:string, progress?:{ loaded:number, total:number })=>{console.log("Loading resources progress: " + progress!.loaded + "/" + progress!.total);};
  LabelRecognizer.onResourcesLoaded = async () => { console.log('load ended...');}

  try{
    if (LabelRecognizer.isWasmLoaded() === false) {
      CameraEnhancer.engineResourcePath = props.dceEngineResourcePath ?? defaultDCEEngineResourcePath;
      LabelRecognizer.engineResourcePath = props.dlrEngineResourcePath ?? defaultDLRengineResourcePath;
      LabelRecognizer.license = props.license ?? "DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="; //one-day trial
    }
    dce = await CameraEnhancer.createInstance();
    dlr = await LabelRecognizer.createInstance();
    await dce.setUIElement(elRef.value as HTMLDivElement);
    await dlr.setImageSource(dce, {resultsHighlightBaseShapes: DrawingItem});
    await dlr.updateRuntimeSettingsFromString("video-mrz");
    dce.setVideoFit("cover");
    // Callback to MRZ recognizing result
    dlr.onMRZRead = async (txt, results) => {
      console.log("MRZ results: \n", txt, "\n", results);
      emit("scanned",results);
    }
    emit("initialized", dce, dlr);
    if (props.scanning) {
      await dlr.startScanning(true);
    }
  } catch(ex:any) {
    let errMsg: string;
    if (ex.message.includes("network connection error")) {
        errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
    } else {
        errMsg = ex.message||ex;
    }
    console.error(errMsg);
    alert(errMsg);
  }
})

onUnmounted(async() => {
  if (dlr) {
    dlr.destroyContext();
  }
  if (dce) {
    dce.dispose(true);
  }
})
</script>

<template>
   <div ref="elRef">
      <svg class="dce-bg-loading" viewBox="0 0 1792 1792"><path d="M1760 896q0 176-68.5 336t-184 275.5-275.5 184-336 68.5-336-68.5-275.5-184-184-275.5-68.5-336q0-213 97-398.5t265-305.5 374-151v228q-221 45-366.5 221t-145.5 406q0 130 51 248.5t136.5 204 204 136.5 248.5 51 248.5-51 204-136.5 136.5-204 51-248.5q0-230-145.5-406t-366.5-221v-228q206 31 374 151t265 305.5 97 398.5z" /></svg>
      <svg class="dce-bg-camera" viewBox="0 0 2048 1792"><path d="M1024 672q119 0 203.5 84.5t84.5 203.5-84.5 203.5-203.5 84.5-203.5-84.5-84.5-203.5 84.5-203.5 203.5-84.5zm704-416q106 0 181 75t75 181v896q0 106-75 181t-181 75h-1408q-106 0-181-75t-75-181v-896q0-106 75-181t181-75h224l51-136q19-49 69.5-84.5t103.5-35.5h512q53 0 103.5 35.5t69.5 84.5l51 136h224zm-704 1152q185 0 316.5-131.5t131.5-316.5-131.5-316.5-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5z" /></svg>
      <div class="dce-video-container"></div>
      <div class="dce-scanarea">
          <div class="dce-scanlight"></div>
      </div>
      <div class="sel-container">
          <select class="dce-sel-camera"></select>
          <select class="dce-sel-resolution"></select>
          <select class="dlr-sel-minletter"></select>
      </div>
      <slot></slot>
  </div>
</template>

<style scoped>
@keyframes dce-rotate{from{transform:rotate(0turn);}to{transform:rotate(1turn);}}
@keyframes dce-scanlight{from{top:0;}to{top:97%;}}
.dce-bg-loading{animation:1s linear infinite dce-rotate;width:40%;height:40%;position:absolute;margin:auto;left:0;top:0;right:0;bottom:0;fill:#aaa;}
.dce-bg-camera{display:none;width:40%;height:40%;position:absolute;margin:auto;left:0;top:0;right:0;bottom:0;fill:#aaa;}
.dce-video-container{position:absolute;left:0;top:0;width:100%;height:100%;}
.dce-scanarea{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;}
.dce-scanarea .dce-scanlight{display:none;position:absolute;width:100%;height:3%;border-radius:50%;box-shadow:0px 0px 2vw 1px #00e5ff;background:#fff;animation:3s infinite dce-scanlight;user-select:none;}
.sel-container{position: absolute;left: 0;top: 0;}
.sel-container .dce-sel-camera{display:block;}
.sel-container .dce-sel-resolution{display:block;margin-top:5px;}
.sel-container .dlr-sel-minletter{display:block;margin-top:5px;}
</style>
