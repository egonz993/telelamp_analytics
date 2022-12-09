import fetch from 'node-fetch';
import auth from '../auth.js';
import readline from 'readline'

const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

var devicesList = []

const now = new Date()
let year = now.getFullYear()
let month = now.getMonth() < 10 ? "0" + now.getMonth() + 1 : String(now.getMonth() + 1)
let day = now.getDate() < 10 ? "0" + now.getDate() : String(now.getDate())

const today = new Date(year + "-" + month + "-" + day)
const time = now.getTime() - today.getTime()
const todaySeconds = Math.ceil(time / 1000)
const todayUplinks = Math.ceil(todaySeconds / 600)


async function getActiveDevices(limit = 2000) {
    console.log("fetching data... ")

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
        let devices = data.map(async (device) => {

            let result = {
                deveui: device.deveui ? device.deveui : null,
                comment: device.comment ? device.comment : null
            }

            return result
        })

        return Promise.all(devices)

    } catch (error) {
        return error
    }
}

async function getPayloads(deveui) {
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

async function DataAnalyzer(callback) {
    let activeDevices = await getActiveDevices()
    console.log(`\nProcessing data for ${activeDevices.length} devices`)
    console.log(`This may take a few minutes, please wait\n`)
    activeDevices.map(async (device) => {

        let deveui = device.deveui ? device.deveui : null
        let comment = device.comment ? device.comment : null

        let uplinks = await getPayloads(device.deveui)

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

        if (uplinks.length >= 1) {

            packets = uplinks.length
            timestamps = uplinks.map(packet => Math.trunc(new Date(packet.timestamp).getTime() / 1000)).sort()
            interval = timestamps.map((timestamp, idx, arr) => (arr[idx + 1] - timestamp) / 60).filter(x => x)
            avg_interval = Math.trunc(interval.reduce((a, b) => a + b, 0) / (interval.length - 1))
            std_deviation = Math.trunc(Math.sqrt(interval.reduce((a, b) => a + Math.pow((b - avg_interval), 2), 0) / (interval.length - 1)))
            rssi = Math.trunc((uplinks.map(packet => packet.rssi).reduce((a, b) => a + b, 0)) / packets)
            snr = Math.trunc((uplinks.map(packet => packet.snr).reduce((a, b) => a + b, 0)) / packets)
            sf_used = uplinks.map(packet => packet.sf_used).sort().filter((x, idx, arr) => arr[idx + 1] != x)
            time_on_air_ms = Math.trunc((uplinks.map(packet => packet.time_on_air_ms).reduce((a, b) => a + b, 0)) / packets)
            FER = Math.ceil(packets / todayUplinks * 100) + "%"

            status = "OK"
            if (Math.ceil(packets / todayUplinks * 100) > 150) status = "WARNING"
            if (Math.ceil(packets / todayUplinks * 100) > 200) status = "DANGER"
            if (Math.ceil(packets / todayUplinks * 100) > 300) status = "ERROR"
            if (Math.ceil(packets / todayUplinks * 100) < 50) status = "WARNING"
            if (Math.ceil(packets / todayUplinks * 100) < 25) status = "DANGER"
            if (Math.ceil(packets / todayUplinks * 100) < 10) status = "ERROR"

            description = "OK"
            if (Math.ceil(packets / todayUplinks * 100) < 50) description = "UNDERFLOW"
            if (Math.ceil(packets / todayUplinks * 100) > 150) description = "OVERFLOW"

            if (status == "OK" && Math.ceil(std_deviation) > 15) {
                description = "INTERMITENCE"
                if (Math.ceil(std_deviation) > 15) status = "WARNING"
                if (Math.ceil(std_deviation) > 20) status = "DANGER"
                if (Math.ceil(std_deviation) > 30) status = "ERROR"
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

        let progress = Math.floor(100 * devicesList.length / activeDevices.length)
        const printProgress = (progress) =>{
            readline.clearLine(process.stdout, 0);
            readline.cursorTo(process.stdout, 0, null);
            let text = `Running Data Analyzer... ${progress}%`;
            process.stdout.write(text);
        }
        
        printProgress(progress)
        if(devicesList.length == activeDevices.length)  callback(devicesList)

        return result
    })

}

export const analyzer = async () => {
    DataAnalyzer(devices => {
        // console.table(devices)
    
        let rak3172_devices = devices.filter(device => device.deveui.includes("ac1f09fffe"))
        let rak4260_devices = devices.filter(device => device.deveui.includes("60c5a8fffe"))
        let elemon_devices = devices.filter(device => !device.deveui.includes("ac1f09fffe") && !device.deveui.includes("60c5a8fffe"))
        
        let working = devices.filter(device => device.description == 'OK')
    
        let underflows = devices.filter(device => device.description == 'UNDERFLOW')
        let underflows_warning = underflows.filter(device => device.status == 'WARNING')
        let underflows_danger = underflows.filter(device => device.status == 'DANGER')
        let underflows_error = underflows.filter(device => device.status == 'ERROR')
        
        let overflows = devices.filter(device => device.description == 'OVERFLOW')
        let overflows_warning = overflows.filter(device => device.status == 'WARNING')
        let overflows_danger = overflows.filter(device => device.status == 'DANGER')
        let overflows_error = overflows.filter(device => device.status == 'ERROR')
    
        let intermitence = devices.filter(device => device.description == 'INTERMITENCE')
        let intermitence_warning = intermitence.filter(device => device.status == 'WARNING')
        let intermitence_danger = intermitence.filter(device => device.status == 'DANGER')
        let intermitence_error = intermitence.filter(device => device.status == 'ERROR')
        
        let undefined = devices.filter(device => device.description == 'UNDEFINED')
    
    
        //RAK3172 DEVICES
        let rak3172_working = rak3172_devices.filter(device => device.description == 'OK')
        let rak3172_undefined= rak3172_devices.filter(device => device.description == 'UNDEFINED')
    
        let rak3172_underflows = rak3172_devices.filter(device => device.description == 'UNDERFLOW')
        let rak3172_underflows_warning = rak3172_underflows.filter(device => device.status == 'WARNING')
        let rak3172_underflows_danger = rak3172_underflows.filter(device => device.status == 'DANGER')
        let rak3172_underflows_error = rak3172_underflows.filter(device => device.status == 'ERROR')
    
        let rak3172_overflows = rak3172_devices.filter(device => device.description == 'OVERFLOW')
        let rak3172_overflows_warning = rak3172_overflows.filter(device => device.status == 'WARNING')
        let rak3172_overflows_danger = rak3172_overflows.filter(device => device.status == 'DANGER')
        let rak3172_overflows_error = rak3172_overflows.filter(device => device.status == 'ERROR')
    
        let rak3172_intermitence = rak3172_devices.filter(device => device.description == 'INTERMITENCE')
        let rak3172_intermitence_warning = rak3172_intermitence.filter(device => device.status == 'WARNING')
        let rak3172_intermitence_danger = rak3172_intermitence.filter(device => device.status == 'DANGER')
        let rak3172_intermitence_error = rak3172_intermitence.filter(device => device.status == 'ERROR')
    
    
        //RAK4260 DEVICES
        let rak4260_working = rak4260_devices.filter(device => device.description == 'OK')
        let rak4260_undefined= rak4260_devices.filter(device => device.description == 'UNDEFINED')
    
        let rak4260_underflows = rak4260_devices.filter(device => device.description == 'UNDERFLOW')
        let rak4260_underflows_warning = rak4260_underflows.filter(device => device.status == 'WARNING')
        let rak4260_underflows_danger = rak4260_underflows.filter(device => device.status == 'DANGER')
        let rak4260_underflows_error = rak4260_underflows.filter(device => device.status == 'ERROR')
    
        let rak4260_overflows = rak4260_devices.filter(device => device.description == 'OVERFLOW')
        let rak4260_overflows_warning = rak4260_overflows.filter(device => device.status == 'WARNING')
        let rak4260_overflows_danger = rak4260_overflows.filter(device => device.status == 'DANGER')
        let rak4260_overflows_error = rak4260_overflows.filter(device => device.status == 'ERROR')
    
        let rak4260_intermitence = rak4260_devices.filter(device => device.description == 'INTERMITENCE')
        let rak4260_intermitence_warning = rak4260_intermitence.filter(device => device.status == 'WARNING')
        let rak4260_intermitence_danger = rak4260_intermitence.filter(device => device.status == 'DANGER')
        let rak4260_intermitence_error = rak4260_intermitence.filter(device => device.status == 'ERROR')
    
    
        //elemon DEVICES
        let elemon_working = elemon_devices.filter(device => device.description == 'OK')
        let elemon_undefined= elemon_devices.filter(device => device.description == 'UNDEFINED')
    
        let elemon_underflows = elemon_devices.filter(device => device.description == 'UNDERFLOW')
        let elemon_underflows_warning = elemon_underflows.filter(device => device.status == 'WARNING')
        let elemon_underflows_danger = elemon_underflows.filter(device => device.status == 'DANGER')
        let elemon_underflows_error = elemon_underflows.filter(device => device.status == 'ERROR')
    
        let elemon_overflows = elemon_devices.filter(device => device.description == 'OVERFLOW')
        let elemon_overflows_warning = elemon_overflows.filter(device => device.status == 'WARNING')
        let elemon_overflows_danger = elemon_overflows.filter(device => device.status == 'DANGER')
        let elemon_overflows_error = elemon_overflows.filter(device => device.status == 'ERROR')
    
        let elemon_intermitence = elemon_devices.filter(device => device.description == 'INTERMITENCE')
        let elemon_intermitence_warning = elemon_intermitence.filter(device => device.status == 'WARNING')
        let elemon_intermitence_danger = elemon_intermitence.filter(device => device.status == 'DANGER')
        let elemon_intermitence_error = elemon_intermitence.filter(device => device.status == 'ERROR')
    
        
        /* RESUME */

        const analysis = {
            'all_devices': {
                working_ok: working.length,
                undefined: undefined.length,
                underflows: underflows.length,
                overflows: overflows.length,
                intermitence: intermitence.length
            },
            'rak3172': {
                working_ok: rak3172_working.length,
                undefined: rak3172_undefined.length,
                underflows: rak3172_underflows.length,
                overflows: rak3172_overflows.length,
                intermitence: rak3172_intermitence.length
            },
            'rak4260': {
                working_ok: rak4260_working.length,
                undefined: rak4260_undefined.length,
                underflows: rak4260_underflows.length,
                overflows: rak4260_overflows.length,
                intermitence: rak4260_intermitence.length
            },
            'elemon': {
                working_ok: elemon_working.length,
                undefined: elemon_undefined.length,
                underflows: elemon_underflows.length,
                overflows: elemon_overflows.length,
                intermitence: elemon_intermitence.length
            }
        }
        console.log('\n\nRESULTS\n')

        console.table(analysis)

        prompt.question('\n Would you like to print tables? (y) ', (x) => {
            if(x != 'n' && x != 'N'){
                //ALL DEVICES
                console.log("\n\n\nTOTAL DEVICES: ", devices.length)
                console.table(devices)

                console.log("\n- TOTAL WORKING OK:", working.length)
                console.table(working)

                console.log("\n- TOTAL UNDEFINED:", undefined.length)
                console.table(undefined)

                console.log("\n- TOTAL UNDERFLOW:", underflows.length, "\n--> Warning: ", underflows_warning.length, "\n--> Danger: ", underflows_danger.length, "\n--> Error: ", underflows_error.length)
                console.table(underflows)

                console.log("\n- TOTAL OVERFLOW:", overflows.length, "\n--> Warning: ", overflows_warning.length, "\n--> Danger: ", overflows_danger.length, "\n--> Error: ", overflows_error.length)
                console.table(overflows)

                console.log("\n- TOTAL INTERMITENCE:", intermitence.length, "\n--> Warning: ", intermitence_warning.length, "\n--> Danger: ", intermitence_danger.length, "\n--> Error: ", intermitence_error.length)
                console.table(intermitence)

            
                //RAK3172 DEVICES
                console.log("\n\n\nRAK3172 DEVICES: ", rak3172_devices.length)
                console.table(rak3172_devices)

                console.log("\n- RAK3172 WORKING OK:", rak3172_working.length)
                console.table(rak3172_working)

                console.log("\n- RAK3172 UNDEFINED:", rak3172_undefined.length)
                console.table(rak3172_undefined)

                console.log("\n- RAK3172 UNDERFLOW:", rak3172_underflows.length, "\n--> Warning: ", rak3172_underflows_warning.length, "\n--> Danger: ", rak3172_underflows_danger.length, "\n--> Error: ", rak3172_underflows_error.length)
                console.table(rak3172_underflows)

                console.log("\n- RAK3172 OVERFLOW:", rak3172_overflows.length, "\n--> Warning: ", rak3172_overflows_warning.length, "\n--> Danger: ", rak3172_overflows_danger.length, "\n--> Error: ", rak3172_overflows_error.length)
                console.table(rak3172_overflows)

                console.log("\n- RAK3172 INTERMITENCE:", rak3172_intermitence.length, "\n--> Warning: ", rak3172_intermitence_warning.length, "\n--> Danger: ", rak3172_intermitence_danger.length, "\n--> Error: ", rak3172_intermitence_error.length)
                console.table(rak3172_intermitence)

                
                //RAK4260 DEVICES
                console.log("\n\n\nRAK4260 DEVICES: ", rak4260_devices.length)
                console.table(rak4260_devices)

                console.log("\n- RAK4260 WORKING OK:", rak4260_working.length)
                console.table(rak4260_working)

                console.log("\n- RAK4260 UNDEFINED:", rak4260_undefined.length)
                console.table(rak4260_undefined)

                console.log("\n- RAK4260 UNDERFLOW:", rak4260_underflows.length, "\n--> Warning: ", rak4260_underflows_warning.length, "\n--> Danger: ", rak4260_underflows_danger.length, "\n--> Error: ", rak4260_underflows_error.length)
                console.table(rak4260_underflows)

                console.log("\n- RAK4260 OVERFLOW:", rak4260_overflows.length, "\n--> Warning: ", rak4260_overflows_warning.length, "\n--> Danger: ", rak4260_overflows_danger.length, "\n--> Error: ", rak4260_overflows_error.length)
                console.table(rak4260_overflows)

                console.log("\n- RAK4260 INTERMITENCE:", rak4260_intermitence.length, "\n--> Warning: ", rak4260_intermitence_warning.length, "\n--> Danger: ", rak4260_intermitence_danger.length, "\n--> Error: ", rak4260_intermitence_error.length)
                console.table(rak4260_intermitence)

                
                //ELEMON DEVICES
                console.log("\n\n\nELEMON DEVICES: ", elemon_devices.length)
                console.table(elemon_devices)

                console.log("\n- ELEMON WORKING OK:", elemon_working.length)
                console.table(elemon_working)

                console.log("\n- ELEMON UNDEFINED:", elemon_undefined.length)
                console.table(elemon_undefined)

                console.log("\n- ELEMON UNDERFLOW:", elemon_underflows.length, "\n--> Warning: ", elemon_underflows_warning.length, "\n--> Danger: ", elemon_underflows_danger.length, "\n--> Error: ", elemon_underflows_error.length)
                console.table(elemon_underflows)

                console.log("\n- ELEMON OVERFLOW:", elemon_overflows.length, "\n--> Warning: ", elemon_overflows_warning.length, "\n--> Danger: ", elemon_overflows_danger.length, "\n--> Error: ", elemon_overflows_error.length)
                console.table(elemon_overflows)

                console.log("\n- ELEMON INTERMITENCE:", elemon_intermitence.length, "\n--> Warning: ", elemon_intermitence_warning.length, "\n--> Danger: ", elemon_intermitence_danger.length, "\n--> Error: ", elemon_intermitence_error.length)
                console.table(elemon_intermitence)

            }
            process.exit(0)
        });

        

    })
}

