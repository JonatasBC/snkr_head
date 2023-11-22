const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

const PORT = 3000
const hostname = 'localhost'
// --------------------------------------------------------------- \\
app.post('/login', async (req, res) => {
    const email = req.body.email
    const senha = req.body.senha
    console.log(email, senha)
    const pesq = await Usuario.findOne({ raw: true, where: { email: email, senha: senha } })
    console.log(pesq)
    let msg = 'Usuário não Cadastrado'
    if (pesq == null) {
        res.render('home', { msg })
    } else if (email == pesq.email && senha == pesq.senha && pesq.tipo === 'admin') {
        log = true
        usuario = pesq.usuario
        tipoUsuario = pesq.tipo
        console.log(tipoUsuario)
        res.render('gerenciador', { log, usuario, tipoUsuario })
    } else if (email == pesq.email && senha == pesq.senha && pesq.tipo === 'usuario') {
        log = true
        usuario = pesq.usuario
        tipoUsuario = pesq.tipo
        console.log(usuario)
        res.render('home', { log, usuario, tipoUsuario })

    } else {
        res.render('home', { msg })
    }
    // res.redirect('/')
})

app.get('/login', (req, res) => {
    log = false
    usuario = ''
    res.render('login', { log, usuario })
})

app.get('/logout', (req, res) => {
    log = false
    usuario = ''
    res.render('home', { log, usuario })
})
app.get('/', (req, res) => {
    log = false
    usuario = ''
    res.render('home', { log, usuario })
})

// --------------------------------------------------------------- \\
conn.sync().then(() => {
    app.listen(PORT, hostname, () => {
        console.log(`Servidor Rodando em ${hostname}:${PORT}`)
    })
}).catch((error) => {
    console.error('Erro de conexão com o banco de dados!' + error)
})
