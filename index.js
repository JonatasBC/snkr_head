const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const conn = require('./db/conn');
const bcrypt = require('bcrypt');
const Usuario = require('./models/Usuario');
const Produto = require('./models/Produto');

const PORT = 3000;
const hostname = 'localhost';

let log = false;
let usuario = '';
let adm = false;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.post('/perfil', async (req, res) => {
  const nome = req.body.usuario;
  const senha = req.body.senha;
  const msg = 'Informações Atualizadas';
  const msgB = 'Erro ao atualizar';
  const pesq = await Usuario.findOne({ raw: true, where: { usuario: usuario } });
  console.log(pesq);
  // const email = pesq.email
  // const telefone = pesq.telefone
  // const cpf = pesq.cpf
  // const tipo = pesq.tipo

  if (pesq != null && nome != '' && senha != '') {
    bcrypt.hash(senha, 10, async (err, hash) => {
      if (err) {
        console.error('Erro ao criar o hash da senha' + err);
        res.render('perfil', { log, usuario, adm, msgB });
        return;
      }
      try {
        const dados = {
          usuario: nome,
          senha: hash,
        };
        console.log(dados);
        await Usuario.update(dados, { where: { usuario: usuario } });

        const pesq = await Usuario.findOne({ raw: true, where: { usuario: nome, senha: hash } });
        console.log(pesq);
        log = true;
        usuario = nome;

        res.render('perfil', { log, usuario, adm, msg });
      } catch (error) {
        console.error('Erro ao criar a senha', error);
        res.render('perfil', { log, usuario, adm, msgB });
      }
    });
  } else {
    res.render('perfil', { log, usuario, adm, msgB });
  }
});

app.get('/perfil', (req, res) => {
  res.render('perfil', { log, usuario, adm });
});

app.post('/cadastro', async (req, res) => {
  const usuario = req.body.usuario;
  const email = req.body.email;
  const telefone = req.body.telefone;
  const cpf = req.body.cpf;
  const senha = req.body.senha;
  const tipo = 'usuario';

  console.log(usuario, email, telefone, senha);

  bcrypt.hash(senha, 10, async (err, hash) => {
    if (err) {
      console.error('Erro ao criar o hash da senha' + err);
      res.render('home', { log, usuario, adm });
      return;
    }
    try {
      await Usuario.create({ usuario: usuario, email: email, telefone: telefone, cpf: cpf, senha: hash, tipo: tipo, where: { usuario: usuario } });
      console.log('\n');
      console.log('Senha criptografada');
      console.log('\n');

      log = true;

      const pesq = await Usuario.findOne({ raw: true, where: { usuario: usuario, senha: hash } });
      console.log(pesq);

      res.render('home', { log, usuario, adm });
    } catch (error) {
      console.error('Erro ao criar a senha', error);
      res.render('home', { log, usuario, adm });
    }
  });
});

app.get('/cadastro', (req, res) => {
  res.render('cadastro', { log, usuario, adm });
});

app.get('/carrinho', (req, res) => {
  res.render('carrinho', { log, usuario, adm });
});

app.get('/produtos', async (req, res) => {
  const dados = await Produto.findAll({ raw: true });
  for (let x = 0; x < dados.length; x++) {
    if (dados[x].marca === 'Jordan') {
      dados[x].logoMarca = 'Air-Jordan-Logo.png';
    }
    if (dados[x].marca === 'Puma') {
      dados[x].logoMarca = 'Puma_Logo.png';
    }
    if (dados[x].marca === 'Adidas') {
      dados[x].logoMarca = 'Adidas_Logo.png';
    }
    if (dados[x].marca === 'Yeezy') {
      dados[x].logoMarca = 'Yeezy_Logo.png';
    }
    dados[x].novaPagina = (x + 1) % 3 == 0;
  }
  console.log(dados);
  res.render('produtos', { log, usuario, adm, dados });
});

// ====================== Acesso Gerente ======================
app.post('/apagarProduto', async (req, res) => {
  const id = req.body.id;
  const msg = 'Dados Apagados';
  const msgB = 'Erro ao apagar';
  const pesq = await Produto.findOne({ raw: true, where: { id: id } });
  if (pesq != null) {
    await Produto.destroy({ where: { id: id } });
    res.render('apagarProduto', { log, usuario, adm, msg });
  } else {
    res.render('apagarProduto', { log, usuario, adm, msgB });
  }
});

app.post('/consultaBProduto', async (req, res) => {
  const nome_produto = req.body.nome;
  console.log(nome_produto);
  const dados = await Produto.findAll({ raw: true, where: { nome: nome_produto } });
  console.log(dados);
  res.render('apagarProduto', { log, usuario, adm, dados });
});

app.get('/apagarProduto', (req, res) => {
  res.render('apagarProduto', { log, usuario, adm });
});

app.post('/editarProduto', async (req, res) => {
  const id = req.body.id;
  const nome = req.body.nome;
  const modelo = req.body.modelo;
  const marca = req.body.marca;
  const tamanho = req.body.tamanho;
  const quantidadeEstoque = Number(req.body.quantidadeEstoque);
  const preco = Number(req.body.preco);
  console.log(id, nome, marca, tamanho, quantidadeEstoque, preco);
  const pesq = await Produto.findOne({ raw: true, where: { id: id } });
  const dados = {
    nome: nome,
    modelo: modelo,
    marca: marca,
    tamanho: tamanho,
    quantidadeEstoque: quantidadeEstoque,
    preco: preco,
  };
  const msg = 'Dados Alterados';
  const msgB = 'Erro';
  console.log(dados);
  if (pesq != null) {
    await Produto.update(dados, { where: { id: id } });
    res.render('editarProduto', { log, usuario, adm, msg });
  } else {
    res.render('editarProduto', { log, usuario, adm, msgB });
  }
});

app.post('/consultaProduto', async (req, res) => {
  const nome_produto = req.body.nome;
  console.log(nome_produto);
  const dados = await Produto.findAll({ raw: true, where: { nome: nome_produto } });
  console.log(dados);
  res.render('editarProduto', { log, usuario, adm, dados });
});

app.get('/editarProduto', (req, res) => {
  res.render('editarProduto', { log, usuario, adm });
});

app.get('/listarUsuario', async (req, res) => {
  const dados = await Usuario.findAll({ raw: true });
  console.log(dados);
  res.render('listarUsuario', { log, usuario, adm, dados });
});

app.get('/listarProduto', async (req, res) => {
  const dados = await Produto.findAll({ raw: true });
  console.log(dados);
  res.render('listarProduto', { log, usuario, adm, valores: dados });
});

app.post('/cadastrarProduto', async (req, res) => {
  const nome = req.body.nome;
  const modelo = req.body.modelo;
  const marca = req.body.marca;
  const tamanho = req.body.tamanho;
  const quantidadeEstoque = req.body.quantidadeEstoque;
  const preco = req.body.preco;
  console.log(nome, marca, tamanho, quantidadeEstoque, preco);
  let msg = 'Dados Cadastrados';
  if (quantidadeEstoque != '' && preco != '') {
    await Produto.create({ nome: nome, modelo: modelo, marca: marca, tamanho: tamanho, quantidadeEstoque: quantidadeEstoque, preco: preco });
    res.render('cadastrarProduto', { log, usuario, adm, msg });
  } else {
    res.render('cadastrarProduto', { log, usuario, adm, msgB });
  }
});

app.get('/cadastrarProduto', (req, res) => {
  res.render('cadastrarProduto', { log, usuario, adm });
});

app.get('/gerenciador', (req, res) => {
  res.render('gerenciador', { log, usuario, adm });
});

// ===================== Compra/Carrinho ========================
app.post('/comprar', async (req, res) => {
  const dados_carrinho = req.body;
  console.log(dados_carrinho);

  const atualiza_promise = [];
  for (const item of dados_carrinho) {
    const produto = await Produto.findByPk(item.cod_prod, { raw: true });
    console.log(produto);
    if (!produto || produto.quantidadeEstoque < item.qtde) {
      return res.status(400).json({ message: 'Produto não Disponível' + produto.quantidadeEstoque });
    }
    const atualiza_promessas = await Produto.update({ quantidadeEstoque: produto.quantidadeEstoque - item.qtde }, { where: { id: item.cod_prod } });
    atualiza_promise.push(atualiza_promessas);
  }
  try {
    await Promise.all(atualiza_promise);
    res.status(200).json({ message: 'Compra Realizada!' });
  } catch (error) {
    console.error('Erro ao atualizar os dados ' + error);
    res.status(500).json({ message: 'Erro ao processar a compra' });
  }
});

// ====================== Login/Logout =======================
app.post('/login', async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;
  console.log(email, senha);
  const pesq = await Usuario.findOne({ raw: true, where: { email: email } });
  console.log(pesq);
  let msg = 'Usuário não Cadastrado';
  if (pesq == null) {
    res.render('login', { msg });
  } else {
    // comparando a senha com o uso de hash
    bcrypt.compare(senha, pesq.senha, (err, resultado) => {
      if (err) {
        console.error('Erro ao comparar a senha', err);
        res.render('home', { log, usuario, adm });
      } else if (resultado) {
        console.log('Usuario existente');
        if (pesq.tipo === 'admin') {
          log = true;
          usuario = pesq.usuario;
          adm = true;
          console.log(adm);
          res.render('gerenciador', { log, usuario, adm });
        } else if (pesq.tipo === 'usuario') {
          log = true;
          usuario = pesq.usuario;
          adm = false;
          console.log(usuario);
          res.render('home', { log, usuario, adm });
        }
      } else {
        console.log('senha incorreta');
        res.render('home', { log, usuario, adm });
      }
    });
  }
});

app.get('/login', (req, res) => {
  log = false;
  usuario = '';
  res.render('login', { log, usuario, adm });
});

app.get('/logout', (req, res) => {
  log = false;
  usuario = '';
  res.render('home', { log, usuario, adm });
});

// ==================== Rota Padrão ========================
app.get('/', (req, res) => {
  res.render('home', { log, usuario, adm });
});
/* ------------------------------------------------- */
conn
  .sync()
  .then(() => {
    app.listen(PORT, hostname, () => {
      console.log(`Servidor Rodando em ${hostname}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro de conexão com o banco de dados!' + error);
  });
