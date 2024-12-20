
import dotenv from 'dotenv'

dotenv.config();
const debug = process.env.DEBUG == "True"

export default function Logs(text) {
    if (debug) {
        let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        // Cor amarelo
        console.log('\x1b[33m' + date + " >> " + text + '\x1b[0m')
    }
}