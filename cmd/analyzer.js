import { analyzer } from '../analysis.js'

console.log("*************************************************")
console.log("                   STRAIVOT                      ")
console.log("   Strong AI | Artificial Intelligence for IoT   ")
console.log("*************************************************")

/**analyzer(days)
 * 
 * Run the Data Analyzer Function to process all uplinks
 * received from LoRaWAN devices since @days ago
 * 
 * @days    number of days to analyze
 */
analyzer(1)