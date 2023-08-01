# vue-mrz-scanner

A Vue component to scan MRZ on passports, visa cards, etc. It is based on [Dynamsoft Label Recognizer](https://www.dynamsoft.com/label-recognition/overview/).

[Online demo](https://joyful-kangaroo-d877bb.netlify.app/)

[demo video](https://github.com/tony-xlh/react-mrz-scanner/assets/5462205/d201bca5-4ae2-43f9-adc9-b532f67e919e)

## Installation

```bash
npm install vue-mrz-scanner
```
   
## Usage


1. Import the library along with its css:

   ```ts
   import MRZScanner from 'vue-mrz-scanner';
   import '../node_modules/vue-mrz-scanner/dist/style.css';
   ```

2. Use the component in template:

   ```html
   <MRZScanner 
     license="DLS2eyJoYW5kc2hha2VDb2RlIjoiMjAwMDAxLTE2NDk4Mjk3OTI2MzUiLCJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSIsInNlc3Npb25QYXNzd29yZCI6IndTcGR6Vm05WDJrcEQ5YUoifQ=="
     :scanning="true"
     @scanned="(results)=>console.log(results)"
   >
   </MRZScanner>
   ```

## Product License

You need to pass a license for Dynamsoft Label Recognizer. You can apply for one [here](https://www.dynamsoft.com/customer/license/trialLicense?product=dlr). A one-day trial license will be used by default if you do not specify one.
