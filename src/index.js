import express from "express";
import { PrismaClient } from '@prisma/client'
import v1Router from './v1/routes/cadastro.js';
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// prisma
const prisma = new PrismaClient()

const app = express();

// Configuração do rate limiter global
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 requisições por IP
    message: {
        status: 429,
        message: "Muitas requisições deste IP, por favor tente novamente após 15 minutos"
    }
});

// Configuração do rate limiter específico para API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 3, // Limite mais restrito para rotas da API
    message: {
        status: 429,
        message: "Limite de requisições da API excedido, por favor tente novamente após 15 minutos"
    }
});

// middleware body parse funcionar
app.use(express.json());

// Secure settings
// https://helmetjs.github.io/
app.use(helmet());

// Aplicar rate limiting global
app.use(limiter);

// Aplicar rate limiting específico para rotas da API
app.use("/api", apiLimiter);


app.get("/", async (req, res) => {
        try {
                // só um teste se o servidor de dados esta OK
                await prisma.$connect();
                res.status(200).json({ status: "OK", message: 'marioANTUNES 2024', date: Date.now(), error: "None" });
        } catch (error) {
                res.status(200).json({ status: "OFF", message: 'marioANTUNES 2024', date: Date.now(), error: error });
        }
});

app.use("/api/v1", v1Router);

export default app
