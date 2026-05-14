import { Router } from "express";
import usuariosRouter from "./usuarios.js";
import { authMiddleware } from "../middlewares/auth.ts";

export const router = Router();

router.use(usuariosRouter);


// Rota protegida para demonstração
router.get("/perfil", authMiddleware, (req, res) => {
    const usuario = req.usuario;
    res.json({
        mensagem: "Você acessou uma rota protegida!",
        usuario,
        explicação: "Este dado só é retornado porque o servidor validou seu token JWT com sucesso."
    });
});

export default router;