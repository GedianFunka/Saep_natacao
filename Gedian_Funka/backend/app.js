const express = require('express');
const cors = require('cors');
const connection = require('./db');

const server = express();
server.use(cors());
server.use(express.json());

const CHAVE = 'chave123' //A mesma usada ano AES_ENCRYPT do script SQL

//LOGIN
server.post('/login', (req,res) => {
    const {login, senha} = req.body;

    const sql = 'SELECT id_usuarios, nome, login FROM Usuarios WHERE login = ? AND senha = SHA2(?,256)';

    connection.query(sql, [login, senha], (erro, resultados) => {
        if(erro)
            return res.status(500).json({sucesso: false, mensagem: erro.message});

        if(resultados.length == 0){
            return res.json({sucesso : false, mensagem: 'Login ou senha inválidos.'})
        }

        res.json({sucesso: true, usuario: resultados[0]});

    });
});

//Etapas 6,7 e 8

server.get('/Responsavel', (req, res) => {
    const sql = 'SELECT id_responsavel, nome, email, telefone FROM Responsavel ORDER BY nome';

    connection.query(sql,(erro, resultados) => {
        if(erro)
            return res.status(500).json({ mensagem: erro.message});
            res.json(resultados);
    });
});

server.get('/Responsavel/busca/:termo', (req, res) => {
    const sql = 'SELECT id_responsavel, nome, email, telefone FROM Responsavel WHERE nome like ? OR email like ? OR telefone like ? ORDER BY nome';

    connection.query(sql, ['%' + req.params.termo + '%', '%' + req.params.termo + '%', '%' + req.params.termo + '%'], (erro,resultados) => {
        if(erro) 
            return res.status(500).json({mensagem: erro.message});
            res.json(resultados);
    });
});

server.get('/Responsavel/:id', (req, res) => {
    const sql = `SELECT id_responsavel, CAST(AES_DECRYPT(CPF, ?) AS CHAR) AS CPF, email, telefone FROM Responsavel WHERE id_responsavel = ?`;

    connection.query(sql, [CHAVE, req.params.id], (erro, resultados) => {
        if(erro) 
            return res.status(500).json({mensagem : erro.message});
            res.json(resultados[0]);
    });
});

server.post('/')

//Servidor
const PORT = 3025;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
});