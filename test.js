import { getDataFrom } from './functions.js';
import { sendDownlinkGroup } from './downlink.js';
import { getAnalysis } from './cmd/analyze.js'





getAnalysis(50, 1, (devices) => {  
    console.log(devices)
}); 
