
import fetch from 'node-fetch';
import auth from './auth.js';
import { deveuiList } from './devices.js'


export async function sendDownlinkGroup(payload){
    console.log("fetching data...\n\n")

    for(let i=0; i<deveuiList.length; i++){
       await downlink(deveuiList[i], payload).then(result => console.log(result))
       await downlink(deveuiList[i], payload).then(result => console.log(result))
    }
}

async function downlink(deveui, body){
    let url = `https://nst.au.saas.orbiwise.com:8443/rest/nodes/${deveui}/payloads/dl?port=1&data_format=hex`
    let params = {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
          }
    }

    try {
        let result = await fetch(url, params)
        let data = await result.json()
        return data
    } catch (error) {
        return error     
    }
}