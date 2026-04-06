export interface Genero {
    id: string;
    nome: string;
}

export interface Pessoa { // Base para Diretor e Ator, já que compartilham campos
    id: string;
    nome: string;
    nascimento: string;
    nacionalidade: string;
}

export interface Ator extends Pessoa {
    papel: string;
}

export interface Filme {
    id: string;
    titulo: string;
    ano: number;
    genero: Genero[];
    diretor: Pessoa;
    elenco: Ator[];
    sinopse: string;
}
