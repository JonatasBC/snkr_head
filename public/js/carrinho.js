const itens_carrinho = document.getElementById('itens-carrinho');
const qtde_total = document.getElementById('qtde-total');
const total_carrinho = document.getElementById('total-carrinho');
const limpar_carrinho_botao = document.getElementById('limpar-carrinho');

// Recupere os itens do carrinho do Local Storage
const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Exiba os itens no carrinho
carrinho.forEach((item) => {
  const listItem = document.createElement('li');
  listItem.innerHTML = `&nbsp;&nbsp;&nbsp;${item.nome} |  quantidade = ${item.qtde} | R$ ${item.preco}`;
  itens_carrinho.appendChild(listItem);
});

// Calcule e exiba o total do carrinho
const total = carrinho.reduce((total, item) => total + item.preco, 0);
const qtde_item = carrinho.reduce((total_item, item) => total_item + item.qtde, 0);
qtde_total.textContent = qtde_item;
total_carrinho.textContent = total.toFixed(2);

// Adicione um ouvinte de evento de clique ao botão "Limpar Carrinho"
limpar_carrinho_botao.addEventListener('click', () => {
  // Limpe os itens do carrinho no Local Storage
  localStorage.removeItem('carrinho');

  // Limpe a lista de itens no carrinho e o total na página
  itens_carrinho.innerHTML = '';
  qtde_total.textContent = '0';
  total_carrinho.textContent = '0.00';
});

//fazendo a compra
const botao_comprar = document.getElementById('botao-comprar');

botao_comprar.addEventListener('click', () => {
  // Recupere os dados do carrinho do Local Storage
  const carrinho = JSON.parse(localStorage.getItem('carrinho'));
  console.log(carrinho);

  // Envie os dados do carrinho para o servidor
  fetch('/comprar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carrinho),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      // Exibe a mensagem de retorno no elemento HTML
      const mensagemCompra = document.getElementById('mensagem-compra');
      mensagemCompra.textContent = data.message;

      // Limpar o carrinho local após a compra.
      localStorage.removeItem('carrinho');
      itens_carrinho.innerHTML = '';
      qtde_total.textContent = '0';
      total_carrinho.textContent = '0.00';
    })
    .catch((error) => {
      console.error('Erro ao enviar dados do carrinho: ', error);
    });
});
