import { analyzer_file } from '../analysis.js'

console.log("*************************************************")
console.log("                   STRAIVOT                      ")
console.log("   Strong AI | Artificial Intelligence for IoT   ")
console.log("*************************************************")

/**analyzer_file(fileName)
 * 
 * Run the Data Analyzer Function to process all uplinks
 * stored into the json file @fileName
 * 
 * @fileName    name of file to process
 */
analyzer_file('analytics 20221209_133045.json')