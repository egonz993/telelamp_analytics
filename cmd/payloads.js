import fetch from 'node-fetch';
import auth from '../auth.js';
var devicesList = []

let activeDevices = await getActiveDevices()


loadingTable(20, (devices) => {         //param $time is the waiting time to get payloads qty
    console.table(devices)
});   

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
            
            let uplinks = await getPayloads(device.deveui)
            let packets = uplinks.length
            let FER = Math.ceil(packets/todayUplinks*100) + "%"
            
            let status = "OK"
            if(Math.ceil(packets/todayUplinks*100)>150)     status = "WARNING"
            if(Math.ceil(packets/todayUplinks*100)>200)     status = "DANGER"
            if(Math.ceil(packets/todayUplinks*100)>300)     status = "ERROR"
            if(Math.ceil(packets/todayUplinks*100)<50)      status = "WARNING"
            if(Math.ceil(packets/todayUplinks*100)<25)      status = "DANGER"
            if(Math.ceil(packets/todayUplinks*100)<10)      status = "ERROR"

            let description = "OK"
            if(Math.ceil(packets/todayUplinks*100)<75)      description = "UNDERFLOW"
            if(Math.ceil(packets/todayUplinks*100)>120)     description = "OVERFLOW"

            let timestamps = uplinks.map( packet => Math.trunc(new Date(packet.timestamp).getTime()/1000)).sort()
            let interval = timestamps.map( (timestamp, idx, arr) => (arr[idx+1]-timestamp)/60).filter(x => x)
            let average_time = Math.trunc(interval.reduce((a, b) => a+b, 0) / (interval.length - 1))
            
            let std_deviation = Math.trunc(Math.sqrt(interval.reduce((a, b) => a + Math.pow((b-average_time),2), 0) / (interval.length - 1)))
            
            let result = {
                deveui,
                comment,
                packets,
                average_time,
                std_deviation,
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
        return data
    } catch (error) {
        return error     
    }
}

function loadingTable(t, callcack){
    let cont = 0;
    let interval = {}
    let time = activeDevices.length*t > 1000 ? activeDevices.length*t : 1000
    
    console.log("Rendering table for " + activeDevices.length + " devices\n")
    
    interval = setInterval( () => {
        cont += 1000;
        let percentage = Math.floor(cont*100/time) < 100 ? Math.ceil(cont*100/time) : 100
        console.log("fetching data...", percentage +"%")

        if(cont >= time) {
            clearInterval(interval)
            
            if(devicesList.length < activeDevices.length)
                console.error("\n\nERROR", "You need to incremment the waiting time for function loadingTable(t, callcack)\n\n")
            else{
                callcack(devicesList)
                console.log("Devices rendered " + devicesList.length)
                console.log("Total Devices: ", activeDevices.length)
            }
        }
    }, 1000)
}


