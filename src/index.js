import express from "express";
import { PrismaClient } from '@prisma/client'
import v1Router from './v1/routes/cadastro.js';
import helmet from 'helmet'
import swaggerUi from 'swagger-ui-express'
import specs from './swagger.js'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import expressSanitizer from 'express-sanitizer'

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
    max: 10, // Limite mais restrito para rotas da API
    message: {
        status: 429,
        message: "Limite de requisições da API excedido, por favor tente novamente após 15 minutos"
    }
});

// middleware body parse funcionar
app.use(express.json());
app.use(expressSanitizer());

// Middleware para sanitizar todos os inputs
app.use((req, res, next) => {
    if (req.body) {
        // Sanitiza recursivamente todos os campos do body
        const sanitizeObj = (obj) => {
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = req.sanitize(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObj(obj[key]);
                }
            }
        };
        sanitizeObj(req.body);
    }

    if (req.query) {
        // Sanitiza parâmetros da query
        for (let key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.sanitize(req.query[key]);
            }
        }
    }

    if (req.params) {
        // Sanitiza parâmetros da URL
        for (let key in req.params) {
            if (typeof req.params[key] === 'string') {
                req.params[key] = req.sanitize(req.params[key]);
            }
        }
    }
    next();
});

// Configuração CORS
const corsOptions = {
    origin: ['https://domain.pt', 'https://www.domain.pt', 'http://127.0.0.1'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600 // 10 minutos em segundos
};
app.use(cors(corsOptions));

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Configurações de Segurança com Helmet
app.use(helmet({
    // Permitir que o Swagger UI seja carregado corretamente
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https:"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            "style-src": ["'self'", "'unsafe-inline'"]
        }
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: []
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true
}));

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
