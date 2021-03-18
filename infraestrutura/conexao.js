const mysql = require('mysql')

const conexao = mysql.createConnection({
    host: 'localhost',
    port:3307,
    user: 'root',
    password: '39411434',
    database: 'agenda_petshop'
})
module.exports = conexao