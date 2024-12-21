import express from "express";
import { postCadastro, getLogin, getCadastros, updateCadastro, getSuperUser } from "../../controllers/cadastro.js";
import isAuthorized from '../../middleware/auth.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         password:
 *           type: string
 *           format: password
 *           description: Senha do usuário (mínimo 8 caracteres)
 *     LoginCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 */

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints de autenticação e gestão de usuários
 */

const router = express.Router();

/**
 * @swagger
 * /api/v1/createsuperuser:
 *   post:
 *     summary: Cria o primeiro usuário super admin
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Super usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Não autorizado - Super usuário já existe
 */
router.post("/createsuperuser", getSuperUser);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       200:
 *         description: Login bem sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", getLogin);

/**
 * @swagger
 * /api/v1/cadastro:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: Conflito - Email já existe
 */
router.post("/cadastro", isAuthorized, postCadastro);

/**
 * @swagger
 * /api/v1/cadastros:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 */
router.get("/cadastros", isAuthorized, getCadastros);

/**
 * @swagger
 * /api/v1/cadastro/{uuid}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: Conflito na atualização
 */
router.put("/cadastro/:uuid", isAuthorized, updateCadastro);

export default router;
