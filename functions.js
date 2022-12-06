import fetch from 'node-fetch';
import auth from './auth.js';
import { deveuiList } from './devices.js'
import { gatewayName } from './gateways.js'



async function countPayloads(deveui, date){
    let url = `https://nst.au.saas.orbiwise.com:8443/rest/nodes/${deveui}/payloads/ul?data_format=hex&from_date=${date}`
    let params = {
        method: 'GET',
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


export async function getDataFrom(date){
    let result = []

    console.log("fetching data...\n\n")
    for(let i=0; i<deveuiList.length; i++){
        let deveui = deveuiList[i]

        let uplink = await countPayloads(deveui, date)
        let payloads = uplink.length
        
        let gateways = uplink.map(gateway => gateway.gtw_info)
        let gatewaysList = gateways.map(gtws => gtws.map(gtw => gatewayName[gtw.gtw_id])).flat().sort()
        let gatewaysListFiltered = gatewaysList.filter((item, index) => gatewaysList.indexOf(item) === index)
        let gtwQty = gatewaysListFiltered.length
        let gtwNames = gatewaysListFiltered

        result.push({deveui, payloads, gtwQty})

    }

    return result
}