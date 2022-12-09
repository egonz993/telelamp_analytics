// writefile.js

import { writeFile, readFile } from 'fs';

const now = new Date()
let year =  now.getFullYear()
let month =  now.getMonth() < 10 ? "0" +  now.getMonth() + 1 : String( now.getMonth() + 1)
let day =  now.getDate() < 10 ? "0" +  now.getDate() : String( now.getDate())
let hours =  now.getHours() < 10 ? "0" +  now.getHours() : String( now.getHours())
let minutes =  now.getMinutes() < 10 ? "0" +  now.getMinutes() : String( now.getMinutes())
let seconds =  now.getSeconds() < 10 ? "0" +  now.getSeconds() : String( now.getSeconds())

let  timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`

export function writeToFile(content){
    writeFile(`logs/analytics ${timestamp}.json`, content, (err) => {
        if (err) throw err;
        //console.log(`\n\nASYNC: Data stored succesfully: ./logs/analytics ${timestamp}.json`);
    });
}

export function readFromFile(fileName, callback) {
    readFile(fileName, 'utf8', (err, content) => {
        if (err) throw err;
        callback(JSON.parse(content))
    });
}