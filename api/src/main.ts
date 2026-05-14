import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {configDotenv} from "dotenv";
import { filmes } from "./data/filmes.js";
import type { Filme } from "./data/interfaces.js";
import router from "./routes/rota.js";

configDotenv()
const porta = process.env.PORTA

const app = express();

function limpar(filme: Filme, ignorar: string[]) {
    const copia: Partial<Filme> & Record<string, any> = { ...filme };
    ignorar.forEach((campo) => {
        delete copia[campo.trim()];
    });
    return copia;
}

app.use(cors({
    origin: [
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
        "http://localhost:5175", "http://127.0.0.1:5175"
    ],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Log request details for debugging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - Status: ${res.statusCode} - ${duration}ms`);
        if (req.method === 'POST') {
            console.log('  Body:', JSON.stringify(req.body));
        }
    });
    next();
});

// Root route
app.get("/", (req, res) => {
    res.send("API de Filmes está rodando! Acesse /filmes para ver a lista.");
});

app.use(router);

app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.get("/filmes", (req, res) => {
    const { ignorar } = req.query;

    if (typeof ignorar === "string") {
        const campos = ignorar.split(",");
        const filmesLimpos = filmes.map((filme) => limpar(filme, campos));
        return res.json(filmesLimpos);
    }

    res.json(filmes);
});

app.get("/filmes/:id", (req, res) => {
    const id = req.params.id;
    const { ignorar } = req.query;
    const filme = filmes.find((filme) => filme.id === id);

    if (!filme) {
        return res.status(404).send("Filme não encontrado");
    }

    if (typeof ignorar === "string") {
        const campos = ignorar.split(",");
        return res.json(limpar(filme, campos));
    }

    res.json(filme);
    
});

app.post("/filmes", (req, res) => {
    const corpo = req.body;

    if (!corpo.titulo || !corpo.ano) {
		return res.status(400).send("Título e ano são obrigatórios");
	}

    // Gerar o próximo ID automaticamente
    const ultimoFilme = filmes[filmes.length - 1];
    const ultimoId = ultimoFilme ? ultimoFilme.id : "FIL000";
    const numeroId = parseInt(ultimoId.replace("FIL", "")) + 1;
    const novoId = `FIL${String(numeroId).padStart(3, "0")}`;

    const novoFilme: Filme = {
        ...corpo,
        id: novoId
    };

    filmes.push(novoFilme);
    res.status(201).json({
        mensagem: "Filme adicionado com sucesso",
        filme: novoFilme
    });
});

app.listen(porta, () => {
    console.log(`Server is running on http://localhost:${porta} !!`);
});
