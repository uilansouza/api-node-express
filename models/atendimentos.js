const conexao = require('../infraestrutura/conexao')
const moment = require('moment')
const axios = require('axios')
class Atendimento {
    adiciona(atendimento,res){
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')
        const data = moment(atendimento.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')

        const dataEhvalida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhvalido = atendimento.cliente.length >= 5

        const validacoes =[
            {
                nome: 'data',
                valido: dataEhvalida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhvalido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ]
        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length
        if (existemErros){
            res.status(400).json(erros)
        }else{
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            const sql = 'INSERT INTO atendimentos SET ?'
            conexao.query(sql, atendimentoDatado, (error, resultados)=>{
                if(error){
                    res.status(400).json(error)
                }else{
                    res.status(201).json(atendimento)
                }
            })
        }

    }
    lista(res){
        const sql = 'SELECT * FROM atendimentos'
        conexao.query(sql,(error, resultados)=>{
            if (error){
                res.status(400).json(error)
            }else{
                res.status(200).json(resultados)
            }
        })
    }
    buscaPorId(id, res){
        const sql = `SELECT * FROM atendimentos WHERE id = ${id}`
        conexao.query(sql, async (error, resultados)=>{
            const atendimento = resultados[0]
            const cpf = atendimento.cliente
            if (error){
                res.status(400).json(error)
            }else{
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)
                atendimento.cliente = data
                res.status(200).json(atendimento)
            }
        })
    }
    altera(id, valores, res){
        if(valores.data){
             valores.data = moment(valores.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss')
        }

        const sql ='UPDATE atendimentos SET ? WHERE id=?'
        conexao.query(sql, [valores, id],(error, resultados)=>{
            if (error){
                res.status(200).json(error)
            }else{
                res.status(400).json({...valores, id})
            }

        })
        
    }
    deleta(id, res){
        const sql = 'DELETE FROM atendimentos WHERE id =?'
        conexao.query(sql, id,(error, resultados)=>{
            if(error){
                res.status(400).json(error)
            }else{
                res.status(200).json(resultados)
            }
        })
    }
}
module.exports = new Atendimento;