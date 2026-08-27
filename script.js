const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");


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

function gerarArreyAleatorio(quantidade) {
    
    let novaLista = [];

    for (let i = 0; i < quantidade; i++) {

        let valorSorteado = Math.floor(Math.random() * 350) + 10; // Gera um número aleatório entre 10 e 360

        novaLista.push(valorSorteado);// Adiciona o valor sorteado à lista
    }

    return novaLista;
}

let listaNumeros = gerarArreyAleatorio(9000); // crio uma lista com n numeros aleatorios entre 10 e 360
desenharTela(listaNumeros); // desenha a tela com a lista de numeros aleatorios