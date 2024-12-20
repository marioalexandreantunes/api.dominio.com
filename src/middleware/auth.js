import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { resposta_json } from '../services/json.js'
import Logs from '../services/logs.js'

dotenv.config();

export default function isAuthorized(req, res, next) {
    Logs('isAuthorized')
    try {
        const token = req.header(process.env.TOKEN_HEADER_KEY);
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!verified) {
            return resposta_json(401, res, "Error", { error: "Faça login!" })
        }
        next();
    } catch (error) {
        return resposta_json(412, res, "Error", { error: error })
    }
}
