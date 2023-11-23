const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario')
const Produto = require('./models/Produto')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

const PORT = 3000
const hostname = 'localhost'
// --------------------------------------------------------------- \\
app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    let msg = 'Usuario não encontrado'
    const pesq = await Usuario.findOne({raw: true, where:{email:email}})
    console.log(pesq)
    if(pesq == null){
        console.log('Usuário não encontrado')        
        res.status(200).render('principal')
    }else{
        // comparando a senha com o uso de hash
        bcrypt.compare(senha, pesq.senha, (err,resultado)=>{
           if(err){
                console.error('Erro ao comparar a senha',err)
                res.render('principal', {log})
           }else if(resultado){
            console.log('Cliente existente')
            if(pesq.tipo == 'admin'){
                log = 'true'
                res.render('gerenciador')
            }else if(pesq.tipo == 'cliente'){
                log = true
                res.render('home')
            }
            log = true
            res.render('home', {log, nome: pesq.nome})
           }else{
            console.log('senha incorreta')
            res.render('principal', {msg, log})
           }
        })
    }
})

app.get('/login', (req,res)=>{
    res.render('principal', {log})
})


app.post('/cadastro', async(req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const senha = req.body.senha

    console.log(nome,email,telefone,senha)

    bcrypt.hash(senha, 10, async (err,hash)=>{
        if(err){
            console.error('Erro ao criar o hash da senha'+err)
            res.render('home', {log})
            return
        }
        try{
            await Usuario.create({nome: nome, email: email, telefone: telefone, senha: hash})
            console.log('\n')
            console.log('Senha criptografada')
            console.log('\n')

            log = true

            const pesq = await Usuario.findOne({ raw: true, where:{ nome:nome, senha: hash}})
            console.log(pesq)

            res.render('home', {log})
        }catch(error){
            console.error('Erro ao criar a senha',error)
            res.render('home', {log})
        }
    })
})

app.get('/cadastro', (req,res)=>{
    res.render('cadastro', {log})
})

app.get('/', (req,res)=>{
    res.render('home', {log})
})
// --------------------------------------------------------------- \\
conn.sync().then(() => {
    app.listen(PORT, hostname, () => {
        console.log(`Servidor Rodando em ${hostname}:${PORT}`)
    })
}).catch((error) => {
    console.error('Erro de conexão com o banco de dados!' + error)
})
