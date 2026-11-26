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
    const sql = 'SELECT id_responsavel, nome, email, telefone FROM Responsavel WHERE nome LIKE ? OR email LIKE ? OR telefone LIKE ? ORDER BY nome';

    connection.query(sql, ['%' + req.params.termo + '%', '%' + req.params.termo + '%', '%' + req.params.termo + '%'], (erro, resultados) => {
        if (erro)
            return res.status(500).json({ mensagem: erro.message });
        res.json(resultados);
    });
});

server.get('/Responsavel/:id', (req, res) => {
    const sql = `SELECT id_responsavel,nome, CAST(AES_DECRYPT(CPF, ?) AS CHAR) AS CPF, email, telefone FROM Responsavel WHERE id_responsavel = ?`;

    connection.query(sql, [CHAVE, req.params.id], (erro, resultados) => {
        if(erro) 
            return res.status(500).json({mensagem : erro.message});
            res.json(resultados[0]);
    });
});

server.post('/Responsavel', (req, res) => {

    const {nome, CPF, email, telefone} = req.body;

    const sql = 'INSERT INTO Responsavel (nome, CPF, email, telefone) VALUES (?, AES_ENCRYPT(?,?), ?, ?)';

    connection.query(sql, [nome, CPF, CHAVE, email, telefone] , (erro, resultado) => {
        if(erro){
            if(erro.code == 'ER_DUP_ENTRY') {
                return res.status(400).json({mensagem: 'CPF já cadastrado'});
            }
            return res.status(500).json({mensagem: erro.message});
        }
        res.json({mensagem: 'Responsavel cadastrado com sucesso!', id_responsavel: resultado.insertId});
    });
});

server.put('/Responsavel/:id', (req, res) => {
    const {nome, CPF, email, telefone} = req.body;

    const sql = 'UPDATE Responsavel SET nome = ?, CPF = AES_ENCRYPT(?,?), email = ?, telefone = ? WHERE id_responsavel = ?';

    connection.query(sql, [nome, CPF, CHAVE, email, telefone, req.params.id], (erro, resultado) => {
        if(erro)
            return res.status(500).json({mensagem: erro.message});
        res.json({mensagem: 'Responsável atualizado com sucesso!'});
    });
});

server.delete('/Responsavel/:id', (req,res) => {
    connection.query('DELETE FROM Responsavel WHERE id_responsavel = ?', [req.params.id], (erro) => {
        if(erro){
            if(erro.code == 'ER_ROW_IS_REFERENCED_2') {
                return res.status(400).json({mensagem: 'Responsavel possui filhos e não pode ser excluído.'});
            }
            return res.status(500).json({mensagem: erro.message});
        }
        res.json({mensagem: 'Responsavel removido com sucesso!'});
    });
});

server.post('/Filho', (req, res) => {
    const {id_responsavel, nome, data_nascimento, nivel_natacao} = req.body;

    if(!id_responsavel){
        return res.status(400).json({mensagem: "O filho tem que estar associado a um responsável"});
    }

    const sql = 'INSERT INTO Filho (id_responsavel, nome, data_nascimento, nivel_natacao) VALUES(?,?,?,?)';

    connection.query(sql, [id_responsavel, nome, data_nascimento, nivel_natacao], (erro, resultado) => {
        if(erro) return res.status(500).json({mensagem: erro.message});
        res.json({mensagem: 'Filho cadastrado com sucesso!', id: resultado.insertId});
        });
    });

server.get('/Aulas', (req,res) => {
    const sql = `
    SELECT a.id_aulas, a.nome_professor, a.horario,
        f.nome AS Filho_nome, f.data_nascimento, f.nivel_natacao,
        r.nome AS Responsavel_nome, CAST(AES_DECRYPT(r.CPF,?) AS CHAR) AS Responsavel_CPF,
        r.email AS Responsavel_email, r.telefone AS Responsavel_telefone
    FROM Aulas a
    INNER JOIN Filho f ON f.id_filho = a.id_filho
    INNER JOIN Responsavel r ON r.id_responsavel = f.id_responsavel
    ORDER BY a.horario 
    `;

    connection.query(sql, [CHAVE], (erro, resultado) => {
        if(erro) return res.status(500).json({mensagem: erro.message});
        res.json(resultado);
    });
});

server.get('/Aulas/:id', (req, res) => {
    connection.query('SELECT * FROM Aulas WHERE id_aulas = ?', [req.params.id], (erro, resultado) => {
        if(erro) return res.status(500).json({mensagem: erro.message});
        return res.json(resultado[0]);
    });
});

server.put('/Aulas/:id', (req,res) => {
    const {horario} =req.body;

    const sql = 'UPDATE Aulas SET horario = ? WHERE id_aulas = ?';

    connection.query(sql, [horario, req.params.id], (erro, resultado) => {
        if(erro) return res.status(500).json({mensagem: erro.message});
        res.json({mensagem: 'Data atualizada com sucesso'});
    });
});

//Servidor
const PORT = 3025;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
});