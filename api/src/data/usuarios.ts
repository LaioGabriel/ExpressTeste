import type { Usuario } from "./interfaces.ts";

// Lista de usuários em memória (mockada)
export const usuarios: Usuario[] = [
    {
        email: "laio@mail.com",
        // senha: "senha" // Não guardamos senha no objeto que vai para o JWT, 
                           // mas para o banco mockado precisamos dela para validar o login.
    }
];

// Para simplificar o mock, vamos guardar as senhas separadamente ou adicionar um campo opcional
export interface UsuarioBD extends Usuario {
    senha: string;
}

export const usuariosBD: UsuarioBD[] = [
    {
        email: "laio@mail.com",
        senha: "senha"
    }
];
