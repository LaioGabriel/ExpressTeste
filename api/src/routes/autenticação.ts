import express from 'express';
import jwt from 'jsonwebtoken';
const loginFunction = (req:express.Request, res:express.Response) => {
    const {email, senha} = req.body;
    const emailFinal = "laio@mail.com"
    const senhaFinal = "senha"
    const segredo = process.env.JWT_SECRET

    if(email !== emailFinal || senha !== senhaFinal){
        return res.status(401).send("Email ou senha incorretos")
    }
    const token = jwt.sign({email}, segredo!, {expiresIn: "1h"})
    res.status(200).send(token)
    
}

export default loginFunction