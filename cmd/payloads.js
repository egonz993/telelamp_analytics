import fetch from 'node-fetch';
import auth from '../auth.js';

var devicesList = []
let activeDevices = await getActiveDevices()
loadingTable(10);


async function getActiveDevices(){
    console.log("fetching data... ")

    const now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() < 10 ? "0" + now.getMonth() + 1 : String(now.getMonth() + 1)
    let day = now.getDate() < 10 ? "0" + now.getDate() : String(now.getDate())
    
    const today = new Date(year + "-" + month + "-" + day)
    const time = now.getTime() - today.getTime()
    const todaySeconds = Math.ceil(time/1000)
    const todayUplinks = Math.ceil(todaySeconds/600)
    

    let url = `https://nst.au.saas.orbiwise.com:8443/rest/nodes?from_date=${year}-${month}-${day}T00:00:00&limit=2000`
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
        let devices = await data.map( async (device) => {

            let deveui = device.deveui ? device.deveui : null
            let comment = device.comment ? device.comment : null
            let last_reception = device.last_reception ? device.last_reception : null
            let uplinks = await getPayloads(deveui)
            let FER = Math.ceil(uplinks/todayUplinks*100) + "%"
            
            let status = "OK"
            if(Math.ceil(uplinks/todayUplinks*100)>200)     status = "ERROR"
            if(Math.ceil(uplinks/todayUplinks*100)>150)     status = "DANGER"
            if(Math.ceil(uplinks/todayUplinks*100)>150)     status = "WARNING"
            if(Math.ceil(uplinks/todayUplinks*100)<75)      status = "WARNING"
            if(Math.ceil(uplinks/todayUplinks*100)<50)      status = "DANGER"
            if(Math.ceil(uplinks/todayUplinks*100)<25)      status = "ERROR"

            let description = "OK"
            if(Math.ceil(uplinks/todayUplinks*100)>200)     description = "OVERFLOW"
            if(Math.ceil(uplinks/todayUplinks*100)>150)     description = "OVERFLOW"
            if(Math.ceil(uplinks/todayUplinks*100)>150)     description = "OVERFLOW"
            if(Math.ceil(uplinks/todayUplinks*100)<75)      description = "LOW SIGNAL"
            if(Math.ceil(uplinks/todayUplinks*100)<50)      description = "LOW SIGNAL"
            if(Math.ceil(uplinks/todayUplinks*100)<25)      description = "LOW SIGNAL"

            let result = {
                deveui,
                comment,
                // last_reception,
                uplinks,
                "%err": FER,
                status,
                description,
            }
            
            devicesList.push(result)
            return result
        })

        return devices

    } catch (error) {
        return error     
    }
}

async function getPayloads(deveui){
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() < 10 ? "0" + date.getMonth() + 1 : String(date.getMonth() + 1)
    let day = date.getDate() < 10 ? "0" + date.getDate() : String(date.getDate())

    let url = `https://nst.au.saas.orbiwise.com:8443/rest/nodes/${deveui}/payloads/ul?data_format=hex&from_date=${year}-${month}-${day}T00:00:00`
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
        return data.length
    } catch (error) {
        return error     
    }
}

function loadingTable(mills){
    let cont = 0;
    let interval = {}
    let time = activeDevices.length*mills > 1000 ? activeDevices.length*mills : 1000
    
    console.log("Rendering table for " + activeDevices.length + " devices\n")
    
    interval = setInterval( () => {
        cont += 1000;
        let percentage = Math.floor(cont*100/time) < 100 ? Math.ceil(cont*100/time) : 100
        console.log("fetching data...", percentage +"%")

        if(cont >= time) {
            clearInterval(interval)
            console.table(devicesList)
            console.log("Devices rendered " + devicesList.length)
            console.log("Total Devices: ", activeDevices.length)
        }
    }, 1000)
}


