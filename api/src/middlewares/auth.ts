import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { Usuario } from "../data/interfaces.ts";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ 
            mensagem: "Token não fornecido",
            detalhe: "Para acessar rotas protegidas, você precisa enviar um token JWT no header 'Authorization'."
        });
    }

    const [, token] = authHeader.split(" ");

    const segredo = process.env.JWT_SECRET;

    if (!segredo) {
        return res.status(500).json({ mensagem: "Erro: JWT_SECRET não configurado" });
    }

    try {
        const decoded = jwt.verify(token!, segredo) as Usuario;
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            mensagem: "Token inválido ou expirado",
            detalhe: "O token fornecido não é válido ou já expirou."
        });
    }
};
