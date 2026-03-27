import express from "express";
import {configDotenv} from "dotenv";

configDotenv()
const porta = process.env.PORTA

const app = express();

app.listen(porta, () => {
    console.log(`Server is running on port ${porta}!!`);
});
app.get("/ping", (req, res) => {
    res.send("Hello World!");
});