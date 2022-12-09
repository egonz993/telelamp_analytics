import { DataAnalyzer } from './cmd/analyze.js'

DataAnalyzer(devices => {
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

    //OTHER DEVICES
    let other_working = other_devices.filter(device => device.description == 'OK')
    let other_undefined = other_devices.filter(device => device.description == 'UNDEFINED')

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
    console.log("\n\n")

    console.log("\nTOTAL DEVICES WORKING OK:", working.length)
    console.table(working)

    //All devices underflow
    console.log("\nTOTAL DEVICES UNDERFLOW:", underflows.length)
    console.table(underflows)
    
    //All devices overerflow
    console.log("\nTOTAL DEVICES OVERFLOW:", overflows.length)
    console.table(overflows)
    
    //All devices intermitence
    console.log("\nTOTAL DEVICES INTERMITENCE:", intermitence.length)
    console.table(intermitence)

    console.log("\nTOTAL DEVICES UNDEFINED", undefined.length)
    console.table(undefined)



    //RAK3172 devices underflows
    console.log("\n\n- RAK3172 DEVICES UNDERFLOW:", rak3172_underflows.length, "\n--> Warning: ", rak3172_underflows_warning.length, "\n--> Danger: ", rak3172_underflows_danger.length, "\n--> Error: ", rak3172_underflows_error.length)
    console.table(rak3172_underflows)

    //RAK3172 devices overerflows
    console.log("\n\n- RAK3172 DEVICES OVERFLOW:", rak3172_overflows.length, "\n--> Warning: ", rak3172_overflows_warning.length, "\n--> Danger: ", rak3172_overflows_danger.length, "\n--> Error: ", rak3172_overflows_error.length)
    console.table(rak3172_overflows)
    
    //RAK3172 intermitence
    console.log("\n\n- RAK3172 DEVICES INTERMITENCE:", rak3172_intermitence.length)
    console.table(rak3172_intermitence)
    
    //RAK3172 undefined
    console.log("\n\n- RAK3172 DEVICES UNDEFINED:", rak3172_undefined.length)
    console.table(rak3172_undefined)



    //OTHER devices underflows
    console.log("\n\n- OTHER DEVICES UNDERFLOW:", other_underflows.length, "\n--> Warning: ", other_underflows_warning.length, "\n--> Danger: ", other_underflows_danger.length, "\n--> Error: ", other_underflows_error.length)
    console.table(other_underflows)
    
    //OTHER devices overerflows
    console.log("\n\n- OTHER DEVICES OVERFLOW:", other_overflows.length, "\n--> Warning: ", other_overflows_warning.length, "\n--> Danger: ", other_overflows_danger.length, "\n--> Error: ", other_overflows_error.length)
    console.table(other_overflows)
    
    //RAKOTHER3172 intermitence
    console.log("\n- OTHER DEVICES INTERMITENCE:", other_intermitence.length)
    console.table(other_intermitence)
    
    //OTHER undefined
    console.log("\n- OTHER DEVICES UNDEFINED:", other_undefined.length)
    console.table(other_undefined)

    /* RESUME */
    
    //ALL DEVICES
    console.log("\n\n\nALL DEVICES: ", devices.length)
    console.log("\n- WORKING OK:", working.length)
    console.log("\n- UNDEFINED:", undefined.length)
    console.log("\n- UNDERFLOW:", underflows.length, "\n--> Warning: ", underflows_warning.length, "\n--> Danger: ", underflows_danger.length, "\n--> Error: ", underflows_error.length)
    console.log("\n- OVERFLOW:", overflows.length, "\n--> Warning: ", overflows_warning.length, "\n--> Danger: ", overflows_danger.length, "\n--> Error: ", overflows_error.length)
    console.log("\n- INTERMITENCE:", intermitence.length, "\n--> Warning: ", intermitence_warning.length, "\n--> Danger: ", intermitence_danger.length, "\n--> Error: ", intermitence_error.length)

    //RAK3172 DEVICES
    console.log("\n\n\nRAK3172 DEVICES: ", rak3172_devices.length)
    console.log("\n- WORKING OK:", rak3172_working.length)
    console.log("\n- UNDEFINED:", rak3172_undefined.length)
    console.log("\n- UNDERFLOW:", rak3172_underflows.length, "\n--> Warning: ", rak3172_underflows_warning.length, "\n--> Danger: ", rak3172_underflows_danger.length, "\n--> Error: ", rak3172_underflows_error.length)
    console.log("\n- OVERFLOW:", rak3172_overflows.length, "\n--> Warning: ", rak3172_overflows_warning.length, "\n--> Danger: ", rak3172_overflows_danger.length, "\n--> Error: ", rak3172_overflows_error.length)
    console.log("\n- INTERMITENCE:", rak3172_intermitence.length, "\n--> Warning: ", rak3172_intermitence_warning.length, "\n--> Danger: ", rak3172_intermitence_danger.length, "\n--> Error: ", rak3172_intermitence_error.length)

    //OTHER DEVICES
    console.log("\n\n\nOTHER DEVICES: ", other_devices.length)
    console.log("\n- WORKING OK:", other_working.length)
    console.log("\n- UNDEFINED:", other_undefined.length)
    console.log("\n- UNDERFLOW:", other_underflows.length, "\n--> Warning: ", other_underflows_warning.length, "\n--> Danger: ", other_underflows_danger.length, "\n--> Error: ", other_underflows_error.length)
    console.log("\n- OVERFLOW:", other_overflows.length, "\n--> Warning: ", other_overflows_warning.length, "\n--> Danger: ", other_overflows_danger.length, "\n--> Error: ", other_overflows_error.length)
    console.log("\n- INTERMITENCE:", other_intermitence.length, "\n--> Warning: ", other_intermitence_warning.length, "\n--> Danger: ", other_intermitence_danger.length, "\n--> Error: ", other_intermitence_error.length)

})