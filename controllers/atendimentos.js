const Atendimento = require ('../models/atendimentos')
const jwt = require('jsonwebtoken')
const { json } = require('body-parser')
const SECRET = 'UILAN'
TIME_EXPIRATION = 300

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET,(error, decoded)=>{
        if(error) return res.status(401).json({message:"Token Invalido ou expirado"}).end()

        req.userId = decoded.userId
        next()
    })

}

module.exports = app =>{
    app.post('/auth', (req, res)=> {
        if (req.body.user==='uilan' && req.body.password==='123456'){
            const token = jwt.sign({userId:1}, SECRET, {expiresIn: TIME_EXPIRATION})
            return res.status(200).json({auth:true,token})
        }
        res.status(401).json({message:"Dados Incorretos"})
    })
    const  blacklist_token=[]    
    
    app.get('/atendimentos', (req, res)=> {
        Atendimento.lista(res)
    })
    app.get('/atendimentos/:id', (req,res)=>{
        const id = parseInt(req.params.id)
        Atendimento.buscaPorId(id, res)
        
    })
    app.post('/atendimentos', (req, res)=> {
        const atendimento = req.body
        Atendimento.adiciona(atendimento, res)
        
    })
    
    app.patch('/atendimentos/:id',  (req, res)=>{
        const id = parseInt(req.params.id)
        const valores = req.body
        Atendimento.altera(id, valores, res)

    })

    app.delete('/atendimentos/:id',verifyJWT,(req, res)=>{
        const id =  parseInt(req.params.id)
        Atendimento.deleta(id, res)
    })
}