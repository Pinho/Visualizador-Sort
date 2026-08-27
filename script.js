const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");
const botaoGerar = document.getElementById("btn-gerar");
const sliderQuantidade = document.getElementById("slider-quantidade");
const sliderVelocidade = document.getElementById("slider-velocidade");


function desenharTela(array) {

    pincel.clearRect(0, 0, tela.width, tela.height);// limpo a tela antes de desenhar

    const espaco = 2; // espaço entre as barras
    const larguraBarra = (tela.width / array.length) - espaco;// largura de cada barra muda dependendo da quantidade de numeros na lista
    
    pincel.fillStyle = "black";// cor das barras

    for (let i = 0; i < array.length; i++) {
    
        let altura = array[i];
        let posX = i * (larguraBarra + espaco);
        let posY = tela.height - altura;

    pincel.fillRect(posX, posY, larguraBarra, altura);
    }
}

function gerarArrayAleatorio(quantidade) {
    
    let novaLista = [];

    for (let i = 0; i < quantidade; i++) {

        let valorSorteado = Math.floor(Math.random() * 350) + 10; // Gera um número aleatório entre 10 e 360

        novaLista.push(valorSorteado);// Adiciona o valor sorteado à lista
    }

    return novaLista;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

sliderQuantidade.addEventListener("input", function() {
    
    // Pegamos o número atual onde a bolinha parou (ele vem como texto, 
    // então usamos parseInt para transformar em número matemático)
    let novaQuantidade = parseInt(sliderQuantidade.value);
    listaNumeros = gerarArrayAleatorio(novaQuantidade);
    desenharTela(listaNumeros);

    // O SEU DESAFIO AQUI:
    // O que você precisa fazer com essa "novaQuantidade" para que a 
    // tela se atualize em tempo real enquanto você arrasta o slider?

});

let listaNumeros = gerarArrayAleatorio(parseInt(sliderQuantidade.value)); 
desenharTela(listaNumeros); // desenha a tela com a lista de numeros aleatorios



botaoGerar.addEventListener("click", function() {
    // Atualizamos a nossa variável com uma nova lista sorteada
    listaNumeros = gerarArrayAleatorio(listaNumeros.length); 
    
    // Mandamos o pintor desenhar essa nova lista
    desenharTela(listaNumeros);
});

const botaoOrdenar = document.getElementById("btn-ordenar");


botaoOrdenar.addEventListener("click", async function() {
    
    for (let i =0; i < listaNumeros.length; i++) {
        for (let j =0; j < listaNumeros.length - i - 1; j++) {
            await sleep(parseInt(sliderVelocidade.value)); 
            if (listaNumeros[j] > listaNumeros[j+1]){
                let temp = listaNumeros[j];
                listaNumeros[j] = listaNumeros[j+1];
                listaNumeros[j+1] = temp;

                desenharTela(listaNumeros);
            }
    }
}
    
});