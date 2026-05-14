import express from 'express';
import jwt from 'jsonwebtoken';
const loginFunction = (req: express.Request, res: express.Response) => {
    const { email, senha } = req.body;
    const emailFinal = "laio@mail.com";
    const senhaFinal = "senha";
    
    const segredo = process.env.JWT_SECRET;

    if (!segredo) {
        return res.status(500).json({ mensagem: "Configuração do servidor incompleta (JWT_SECRET ausente)" });
    }

    if (email !== emailFinal || senha !== senhaFinal) {
        return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    const token = jwt.sign({ email }, segredo, { expiresIn: "1h" });
    
    // Configura o cookie HttpOnly
    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hora em ms
    });

    res.status(200).json({ mensagem: "Login realizado com sucesso!" });
};



export default loginFunction