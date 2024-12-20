import express from "express";
import { PrismaClient } from '@prisma/client'
import v1Router from './v1/routes/cadastro.js';
import helmet from 'helmet'

// prisma
const prisma = new PrismaClient()

const app = express();

// middleware body parse funcionar
app.use(express.json());

// Secure settings
// https://helmetjs.github.io/
app.use(helmet());


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
