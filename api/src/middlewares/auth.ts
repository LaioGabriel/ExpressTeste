import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ 
            mensagem: "Token não fornecido",
            detalhe: "Para acessar rotas protegidas, você precisa enviar um token JWT no header 'Authorization'."
        });
    }

    const [, token] = authHeader.split(" ");

    try {
        const segredo = process.env.JWT_SECRET || "fallback_secret";
        const decoded = jwt.verify(token, segredo as string);
        
        // Adiciona os dados do usuário ao request para uso posterior
        (req as any).usuario = decoded;
        
        next();
    } catch (error) {
        return res.status(401).json({ 
            mensagem: "Token inválido ou expirado",
            detalhe: "O token fornecido não é válido ou já passou do tempo de expiração de 1 hora."
        });
    }
};
