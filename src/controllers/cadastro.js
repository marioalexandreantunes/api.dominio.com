
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { resposta_json } from '../services/json.js'
import { hashPassword, matchPassword } from '../services/crypto.js'
import Logs from '../services/logs.js'
import validator from 'validator'

dotenv.config();
const prisma = new PrismaClient()

// Função de validação de dados
const validateUserData = (data) => {
    const errors = [];
    
    // Validação de email
    if (!validator.isEmail(data.email)) {
        errors.push('Email inválido');
    }
    
    // Validação de senha
    if (!validator.isLength(data.password, { min: 8 })) {
        errors.push('A senha deve ter no mínimo 8 caracteres');
    }
    
    // Validação de nome
    if (!validator.isLength(data.name, { min: 2, max: 50 })) {
        errors.push('O nome deve ter entre 2 e 50 caracteres');
    }
    if (!validator.matches(data.name, /^[a-zA-ZÀ-ÿ\s]*$/)) {
        errors.push('O nome deve conter apenas letras e espaços');
    }
    
    return errors;
};

const getSuperUser = async (req, res) => {
    Logs("getSuperUser")
    const { email, password, name } = req.body;
    
    // Validação dos dados
    const validationErrors = validateUserData({ email, password, name });
    if (validationErrors.length > 0) {
        return resposta_json(400, res, "Dados inválidos", { errors: validationErrors });
    }
    const user = await prisma.user.findMany()
    //Não existe usuários?
    Logs('users ' + user.length)
    if (user.length == 0) {
        // Criar Primeiro Usuario
        const hash = hashPassword(req.body.password)
        const createUser = await prisma.user.create({
            data: {
                email: req.body.email,
                name: req.body.name,
                password: hash
            }
        })
        // Criar JTW de imediato
        let data = {
            id: req.body.email,
            email: req.body.name,
            password: req.body.password
        }
        // expiresIn reduzido 15 minutos
        const jwt_token = jwt.sign(data, process.env.JWT_SECRET_KEY, { algorithm: 'HS512', expiresIn: "15m" });
        resposta_json(200, res, "POST Create SUser Authorized", { accessToken: jwt_token });
    }
    else {
        resposta_json(401, res, "POST Create SUser Unauthorized", { error: "user not authorized", });
    }
};

const postCadastro = async (req, res) => {
    Logs("postCadastro")
    try {
        // Validação dos dados
        const validationErrors = validateUserData(req.body);
        if (validationErrors.length > 0) {
            return resposta_json(400, res, "Dados inválidos", { errors: validationErrors });
        }
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
    
    // Validação básica de login
    if (!validator.isEmail(email)) {
        return resposta_json(400, res, "Email inválido", { error: "Formato de email inválido" });
    }
    
    if (!validator.isLength(password, { min: 8 })) {
        return resposta_json(400, res, "Senha inválida", { error: "Senha deve ter no mínimo 8 caracteres" });
    }
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
        // Validação dos dados de atualização
        const validationErrors = validateUserData({
            email: req.body.email || 'dummy@dummy.com', // Se email não for atualizado
            password: req.body.password,
            name: req.body.name
        });
        if (validationErrors.length > 0) {
            return resposta_json(400, res, "Dados inválidos", { errors: validationErrors });
        }
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

export { postCadastro, getLogin, getCadastros, updateCadastro, getSuperUser };
