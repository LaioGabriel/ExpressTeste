import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { Usuario } from "../data/interfaces.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt_token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);

    if (!token) {
        return res.status(401).json({ 
            mensagem: "Token não fornecido",
            detalhe: "Sua sessão expirou ou você não está logado (Cookie 'jwt_token' não encontrado)."
        });
    }

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
