
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { resposta_json } from '../services/json.js'
import { hashPassword, matchPassword } from '../services/crypto.js'
import Logs from '../services/logs.js'

dotenv.config();
const prisma = new PrismaClient()

const postCadastro = async (req, res) => {
    Logs("postCadastro")
    try {
        const hash = hashPassword(req.body.password)
        const createUser = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: hash
            }
        })
        return resposta_json(201, res, "POST cadastro Created", { Bearer: token, user: req.body });
    }
    catch (error) {
        return resposta_json(409, res, "POST cadastro Conflict", { error: error });
    }
};

const getLogin = async (req, res) => {
    Logs("getLogin")
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    })
    // Usuario validade com sucesso?
    if (user && matchPassword(password, user.password)) {
        let data = {
            id: user.id,
            email: user.email,
            password: user.password
        }
        // Gerar então token JWT 
        // expiresIn reduzido 15 minutos
        const jwt_token = jwt.sign(data, process.env.JWT_SECRET_KEY, { algorithm: 'HS512', expiresIn: "15m" });
        resposta_json(200, res, "POST login Authorized", { accessToken: jwt_token });
    }
    else {
        resposta_json(401, res, "POST login Unauthorized", { error: "user not authorized", });
    }
};

const getCadastros = async (req, res) => {
    Logs("getCadastros")
    try {
        const users = await prisma.user.findMany()
        return resposta_json(202, res, "GET cadastros Accepted", { users });
    }
    catch (error) {
        return resposta_json(409, res, "POST cadastros Conflict", { error: error });
    }
};

const updateCadastro = async (req, res) => {
    Logs("updateCadastro")
    try {
        const hash = hashPassword(req.body.password)
        const UpdateUser = await prisma.user.update({
            where: {
                id: req.params.uuid
            },
            data: {
                name: req.body.name,
                password: hash
            }
        })
        return resposta_json(201, res, "POST cadastro Updated", { hash: hash, user: req.body });
    }
    catch (error) {
        return resposta_json(409, res, "POST cadastro Update Conflict", { error: error });
    }
};

export { postCadastro, getLogin, getCadastros, updateCadastro };