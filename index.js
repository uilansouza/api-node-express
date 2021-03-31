const customExmpress = require('./config/customExpress')
const conexao = require('./infraestrutura/database/conexao')
const Tabelas = require('./infraestrutura/database/tabelas')
conexao.connect((error =>{
    if (error){
        console.log(error)
    }else{
        console.log("conectado com sucesso")
        Tabelas.init(conexao)
        const app = customExmpress()
        app.listen(3000, ()=> console.log("Servidor rodando na porta 3000"))

    }
}))

