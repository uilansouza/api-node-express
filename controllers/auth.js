
const jwt = require('jsonwebtoken')
const SECRET = 'UILAN'

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token']
    jwt.verify(token, SECRET,(error, decoded)=>{
        if(error) return res.status(401).end()

        req.userId = decoded.userId
        next()
    })

}

module.exports = app =>{
    app.post('/login', (req, res)=> {
        if (req.body.user==='uilan' && req.body.password==='123456'){
            const token = jwt.sign({userId:1}, SECRET, {expiresIn: 300})
            return res.status(200).json({auth:true,token})
        }else{
        res.status(400).json({"message":"Dados incorretos"})}
    })

    app.get('/clientes', verifyJWT, (req, res)=> {
        console.log(req.userId + " fez a chamada")
        res.json({"nome":"Joao", "senha":123456})
    })
    app.post('/logout',(req, res)=>{
        console.log("Fez logout e cancelou o token!");
        res.status(200).send({ auth: false, token: null }); 
    })
}