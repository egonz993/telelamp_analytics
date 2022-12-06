import { getDataFrom } from './functions.js';
import { sendDownlinkGroup } from './downlink.js';

// await sendDownlinkGroup('b7');

getPayloads();

async function getPayloads(){
    let date = new Date()

    let yyyy = String(date.getFullYear())
    let mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : String(date.getMonth() + 1)
    let dd = date.getDate() < 10 ? "0" + date.getDate() : String(date.getDate())
    
    let today = yyyy + "-" + mm + "-" + dd + "T00:00:00"
    let payloads = await getDataFrom(today)
    
    console.table(payloads)
}




//edited -->    node_modules\node-fetch\src\body.js