import { rateLimit } from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 5, // Limita cada IP a 5 solicitações de login por janela (15 minutos)
    message: {
        mensagem: "Muitas tentativas de login a partir deste IP, tente novamente após 15 minutos"
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    limit: 100, // Limita cada IP a 100 solicitações por minuto
    message: {
        mensagem: "Muitas solicitações, tente novamente mais tarde"
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
