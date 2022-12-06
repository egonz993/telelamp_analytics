import fetch from 'node-fetch';
import auth from './auth.js';


getActiveDevices().then( (data) => {
    let devices = data
    console.log(devices)
})


async function getActiveDevices(){
    let url = `https://nst.au.saas.orbiwise.com:8443/rest/nodes?from_date=2022-06-22T00:00:00&limit=2`
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
