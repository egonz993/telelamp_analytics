import fetch from 'node-fetch';
import auth from '../auth.js';

var devicesList = []
let activeDevices = []

export async function getActiveDevices(limit){
    console.log("fetching data... ")

    const now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth() < 10 ? "0" + now.getMonth() + 1 : String(now.getMonth() + 1)
    let day = now.getDate() < 10 ? "0" + now.getDate() : String(now.getDate())
    
    const today = new Date(year + "-" + month + "-" + day)
    const time = now.getTime() - today.getTime()
    const todaySeconds = Math.ceil(time/1000)
    const todayUplinks = Math.ceil(todaySeconds/600)
    
    let url = `https://nst.au.saas.orbiwise.com:8443/rest/nodes?from_date=${year}-${month}-${day}T00:00:00&limit=${limit}`
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
            
            let uplinks =  await getPayloads(device.deveui)

            let timestamps = 0
            let interval = 0
            let packets = 0
            let avg_interval = 0
            let std_deviation = 0
            let rssi = 0
            let snr = 0 
            let sf_used = 0 
            let time_on_air_ms = 0 
            let FER = 0
            let status = "UNDEFINED"
            let description = "UNDEFINED"

            if(uplinks.length >= 1){

                packets = uplinks.length
                timestamps =  uplinks.map( packet => Math.trunc(new Date(packet.timestamp).getTime()/1000)).sort()
                interval = timestamps.map( (timestamp, idx, arr) => (arr[idx+1]-timestamp)/60).filter(x => x)
                avg_interval = Math.trunc(interval.reduce((a, b) => a+b, 0) / (interval.length - 1))
                std_deviation = Math.trunc(Math.sqrt(interval.reduce((a, b) => a + Math.pow((b-avg_interval),2), 0) / (interval.length - 1)))
                rssi = Math.trunc((uplinks.map(packet => packet.rssi).reduce( (a, b) => a+b, 0)) / packets)
                snr = Math.trunc((uplinks.map(packet => packet.snr).reduce( (a, b) => a+b, 0)) / packets)
                sf_used = uplinks.map(packet => packet.sf_used).sort().filter( (x, idx, arr) => arr[idx+1] != x)
                time_on_air_ms = Math.trunc((uplinks.map(packet => packet.time_on_air_ms).reduce( (a, b) => a+b, 0)) / packets)
                FER = Math.ceil(packets/todayUplinks*100) + "%"

                status = "OK"
                if(Math.ceil(packets/todayUplinks*100)>150)     status = "WARNING"
                if(Math.ceil(packets/todayUplinks*100)>200)     status = "DANGER"
                if(Math.ceil(packets/todayUplinks*100)>300)     status = "ERROR"
                if(Math.ceil(packets/todayUplinks*100)<50)      status = "WARNING"
                if(Math.ceil(packets/todayUplinks*100)<25)      status = "DANGER"
                if(Math.ceil(packets/todayUplinks*100)<10)      status = "ERROR"
                
                description = "OK"
                if(Math.ceil(packets/todayUplinks*100)<50)      description = "UNDERFLOW"
                if(Math.ceil(packets/todayUplinks*100)>150)     description = "OVERFLOW"
                
                if(status == "OK" && Math.ceil(std_deviation) > 15){
                    description = "INTERMITENCE"
                    if(Math.ceil(std_deviation) > 15)   status = "WARNING"
                    if(Math.ceil(std_deviation) > 20)   status = "DANGER"
                    if(Math.ceil(std_deviation) > 30)   status = "ERROR"
                }
            }
            
            let result = {
                deveui,
                comment,
                packets,
                avg_interval,
                std_deviation,
                rssi,
                snr,
                sf_used,
                time_on_air_ms,
                FER,
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
        return data
    } catch (error) {
        return error     
    }
}

export async function getAnalysis(callcack){
    
    const t = 200
    const limit = 2000
    
    let cont = 0;
    let interval = {}
    activeDevices = await getActiveDevices(limit)
    let time = activeDevices.length*t > 1000 ? activeDevices.length*t : 1000
    
    console.log("Rendering table for " + activeDevices.length + " devices\n")
    
    interval = setInterval( () => {
        cont += 1000;
        let percentage = Math.floor(cont*100/time) < 100 ? Math.ceil(cont*100/time) : 100
        console.log("fetching data...", percentage +"%")

        if(cont >= time) {
            clearInterval(interval)
            
            if(devicesList.length < activeDevices.length){
                callcack(devicesList)
                console.error("\n\nERROR", "You need to incremment the waiting time (const t) for function getAnalysis(callcack)\n\n")
            }
            else{
                callcack(devicesList)
            }
        }
    }, 1000)
}