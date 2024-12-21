import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite de 5 tentativas
    message: {
        status: 429,
        error: 'Demasiadas tentativas de login. Por favor, tente novamente mais tarde.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
