import MRZScanner from './components/MRZScanner.vue'
const install = (app:any) => {
  app.component('mrz-scanner', MRZScanner);
}

export default MRZScanner;

const plugin = {
  install
};

export { plugin };