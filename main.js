import { getDataFrom } from './functions.js';
import { sendDownlinkGroup } from './downlink.js';
import { getAnalysis } from './cmd/analyze.js'





getAnalysis(20, 2000, (devices) => {         //getAnalysis(t, limit, callcack)
    // console.table(devices)

    let rak3172_devices = devices.filter(device => device.deveui.includes("ac1f09fffe"))
    let other_devices = devices.filter(device => !device.deveui.includes("ac1f09fffe"))
    
    
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



    //RAK3172 DEVICES
    let rak3172_working = rak3172_devices.filter(device => device.description == 'OK')

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

    //OTHER DEVICES
    let other_working = other_devices.filter(device => device.description == 'OK')

    let other_underflows = other_devices.filter(device => device.description == 'UNDERFLOW')
    let other_underflows_warning = other_underflows.filter(device => device.status == 'WARNING')
    let other_underflows_danger = other_underflows.filter(device => device.status == 'DANGER')
    let other_underflows_error = other_underflows.filter(device => device.status == 'ERROR')

    let other_overflows = other_devices.filter(device => device.description == 'OVERFLOW')
    let other_overflows_warning = other_overflows.filter(device => device.status == 'WARNING')
    let other_overflows_danger = other_overflows.filter(device => device.status == 'DANGER')
    let other_overflows_error = other_overflows.filter(device => device.status == 'ERROR')

    let other_intermitence = other_devices.filter(device => device.description == 'INTERMITENCE')
    let other_intermitence_warning = other_intermitence.filter(device => device.status == 'WARNING')
    let other_intermitence_danger = other_intermitence.filter(device => device.status == 'DANGER')
    let other_intermitence_error = other_intermitence.filter(device => device.status == 'ERROR')
    


    /* CONSOLE LOGS */

    console.log("\nWORKING OK:", working.length)
    console.table(working)

    //All devices underflow
    console.log("\nALL DEVICES UNDERFLOW:", underflows.length)
    console.table(underflows)
    
    //All devices overerflow
    console.log("\nALL DEVICES OVERFLOW:", overflows.length)
    console.table(overflows)
    
    //All devices intermitence
    console.log("\nALL DEVICES INTERMITENCE:", intermitence.length)
    console.table(intermitence)



    //RAK3172 devices underflows
    console.log("\n- RAK3172 DEVICES UNDERFLOW:", rak3172_underflows.length, "\n--> Warning: ", rak3172_underflows_warning.length, "| Danger: ", rak3172_underflows_danger.length, "| Error: ", rak3172_underflows_error.length)
    console.table(rak3172_underflows)

    //RAK3172 devices overerflows
    console.log("\n- RAK3172 DEVICES OVERFLOW:", rak3172_overflows.length, "\n--> Warning: ", rak3172_overflows_warning.length, "| Danger: ", rak3172_overflows_danger.length, "| Error: ", rak3172_overflows_error.length)
    console.table(rak3172_overflows)
    
    //All devices intermitence
    console.log("\n- RAK3172 DEVICES INTERMITENCE:", rak3172_intermitence.length)
    console.table(rak3172_intermitence)



    //OTHER devices underflows
    console.log("\n- OTHER DEVICES UNDERFLOW:", other_underflows.length, "\n--> Warning: ", other_underflows_warning.length, "| Danger: ", other_underflows_danger.length, "| Error: ", other_underflows_error.length)
    console.table(other_underflows)
    
    //OTHER devices overerflows
    console.log("\n- OTHER DEVICES OVERFLOW:", other_overflows.length, "\n--> Warning: ", other_overflows_warning.length, "| Danger: ", other_overflows_danger.length, "| Error: ", other_overflows_error.length)
    console.table(other_overflows)
    
    //All devices intermitence
    console.log("\OTHER DEVICES INTERMITENCE:", other_intermitence.length)
    console.table(other_intermitence)



    /* RESUME */
    
    //ALL DEVICES
    console.log("\nALL DEVICES")
    console.log("- WORKING OK:", working.length)
    console.log("- UNDERFLOW:", underflows.length, "--> Warning: ", underflows_warning.length, "| Danger: ", underflows_danger.length, "| Error: ", underflows_error.length)
    console.log("- INTERMITENCE:", intermitence.length, "--> Warning: ", intermitence_warning.length, "| Danger: ", intermitence_danger.length, "| Error: ", intermitence_error.length)

    //RAK3172 DEVICES
    console.log("\nRAK3172 DEVICES")
    console.log("- WORKING OK:", rak3172_working.length)
    console.log("- UNDERFLOW:", rak3172_underflows.length, "--> Warning: ", rak3172_underflows_warning.length, "| Danger: ", rak3172_underflows_danger.length, "| Error: ", rak3172_underflows_error.length)
    console.log("- INTERMITENCE:", rak3172_intermitence.length, "--> Warning: ", rak3172_intermitence_warning.length, "| Danger: ", rak3172_intermitence_danger.length, "| Error: ", rak3172_intermitence_error.length)

    //OTHER DEVICES
    console.log("\nOTHER DEVICES")
    console.log("- WORKING OK:", other_working.length)
    console.log("- UNDERFLOW:", other_underflows.length, "--> Warning: ", other_underflows_warning.length, "| Danger: ", other_underflows_danger.length, "| Error: ", other_underflows_error.length)
    console.log("- INTERMITENCE:", other_intermitence.length, "--> Warning: ", other_intermitence_warning.length, "| Danger: ", other_intermitence_danger.length, "| Error: ", other_intermitence_error.length)

}); 



// await sendDownlinkGroup('ac');
// await sendDownlinkGroup('e1');


// getPayloads();
// async function getPayloads(){
//     let date = new Date()

//     let yyyy = String(date.getFullYear())
//     let mm = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : String(date.getMonth() + 1)
//     let dd = date.getDate() < 10 ? "0" + date.getDate() : String(date.getDate())
    
//     let today = yyyy + "-" + mm + "-" + dd + "T00:00:00"
//     let payloads = await getDataFrom(today)
    
//     console.table(payloads)
// }




//edited -->    node_modules\node-fetch\src\body.js