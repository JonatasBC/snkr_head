const itens_carrinho = document.getElementById("itens-carrinho")
const qtde_total = document.getElementById("qtde-total")
const total_carrinho = document.getElementById("total-carrinho")
const limpar_carrinho = document.getElementById("limpar-carrinho")

const carrinho = JSON.parse(localStorage.getItem("carrinho")) || []
console.log(carrinho)

// exibir os itens do carrinho em uma lista
carrinho.forEach((item)=>{
    const list_item = document.createElement("li")
    list_item.innerHTML = `&nbsp;&nbsp;&nbsp;${item.nome} | quantidade = ${item.qtde} | R$ ${item.preco}`
    itens_carrinho.appendChild(list_item)
})

// calcular o total dos itens e do preço final
const total = carrinho.reduce((total,item)=> total + item.preco,0)
const qtde_item = carrinho.reduce((total_item,item)=> total_item + item.qtde, 0)
console.log(total)
console.log(qtde_item)

qtde_total.textContent = qtde_item
total_carrinho.textContent = total.toFixed(2)

// limpando o carrinho, ou seja, o localStorage
limpar_carrinho.addEventListener("click", ()=>{

    // apaga o localStorage
    localStorage.removeItem("carrinho")

    // atualiza o ícone do carrinho
    const carrinho_icone = document.getElementById("carrinho-icon")
    carrinho_icone.src = "./assets/img/carrinho_vazio.png"

    // limpa a lista do carrinho e total da página
    itens_carrinho.innerHTML = ""
    qtde_total.textContent = "0"
    total_carrinho.textContent = "0.0"

})

