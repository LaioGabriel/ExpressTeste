import express from "express";
import {configDotenv} from "dotenv";
import { filmes } from "./data/filmes.ts";

configDotenv()
const porta = process.env.PORTA

const app = express();

app.listen(porta, () => {
    console.log(`Server is running on port ${porta}!!`);
});

app.use((req, res, next) => {
    console.log("Query params:", req.query);
    next();
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});

app.get("/filmes", (req, res) => {
    res.json(filmes);
});

app.get("/filmes/:id", (req, res) => {
    const id = req.params.id;
    const { ignorar } = req.query;
    const filme = filmes.find((filme) => filme.id === id);
    if (!filme) {
        return res.status(404).send("Filme não encontrado");
    }

    const copia = { ...filme } as any;
    if (typeof ignorar === "string") {
        ignorar.split(",").forEach((campo) => {
            delete copia[campo.trim()];
        });
    }

    res.json(copia);
});