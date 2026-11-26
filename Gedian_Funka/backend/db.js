const mysql = require('mysql2');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Gedian7476',
    database:'Saep_teste',
    dateStrings:true
});

connection.connect((erro) => {
if (erro) {
    console.log('Erro ao conectar:', erro);
    return;
    }

console.log('Banco conectado com sucesso!');
});

module.exports = connection;