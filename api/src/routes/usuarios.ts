import { Router } from "express";
import jwt from "jsonwebtoken";
import { usuariosBD, type UsuarioBD } from "../data/usuarios.js";

const usuariosRouter = Router();

// Rota de Cadastro
usuariosRouter.post("/registrar", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: "Email e senha são obrigatórios" });
    }

    const usuarioExiste = usuariosBD.find((u: UsuarioBD) => u.email === email);
    if (usuarioExiste) {
        return res.status(400).json({ mensagem: "Usuário já cadastrado" });
    }

    // No mundo real, aqui usaríamos bcrypt para hashear a senha
    usuariosBD.push({ email, senha });

    res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
});

// Rota de Login (substituindo a antiga)
usuariosRouter.post("/login", (req, res) => {
    const { email, senha } = req.body;
    const segredo = process.env.JWT_SECRET;

    if (!segredo) {
        return res.status(500).json({ mensagem: "Erro: JWT_SECRET não configurado" });
    }

    const usuario = usuariosBD.find((u: UsuarioBD) => u.email === email && u.senha === senha);

    if (!usuario) {
        return res.status(401).json({ mensagem: "Email ou senha incorretos" });
    }

    // Gerando o token apenas com o e-mail (seguro)
    const token = jwt.sign({ email: usuario.email }, segredo, { expiresIn: "1h" });
    
    // Configura o cookie HttpOnly
    res.cookie('jwt_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hora
    });

    res.status(200).json({ mensagem: "Login realizado com sucesso!" });
});

// Rota de Logout
usuariosRouter.post("/logout", (req, res) => {
    res.clearCookie('jwt_token');
    res.json({ mensagem: "Logout realizado e cookie removido!" });
});

export default usuariosRouter;
