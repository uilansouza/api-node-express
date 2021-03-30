const conexao = require('../infraestrutura/conexao')
const uploadDeArquivo = require('../arquivos/uploadDeArquivos')

class Pet {
    adiciona(pet, res){
        const sql = 'INSERT INTO pets SET ?'
        uploadDeArquivo(pet.imagem, pet.nome,(error,novoCaminho)=>{
            if (error){
                res.status(400).json({error})

            }else{ 
                const novoPet ={nome: pet.nome, imagem: novoCaminho}
                conexao.query(sql, novoPet, error =>{
                if (error){
                    console.log(error)
                    res.status(400).json(error)
                }else{
                    res.status(200).json(novoPet)
                }
    
            })}    
           

        })
    }
}

module.exports = new Pet()