const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");
const botaoGerar = document.getElementById("btn-gerar");
const sliderQuantidade = document.getElementById("slider-quantidade");
const sliderVelocidade = document.getElementById("slider-velocidade");
const seletorAlgoritmo = document.getElementById("seletor-algoritmo");


function desenharTela(array, indice1 = -1, indice2 = -1, indiceVerde = -1) {

    pincel.clearRect(0, 0, tela.width, tela.height);
    const espaco = 2; 
    const larguraBarra = (tela.width / array.length) - espaco;
    
    // O for abre aqui
    for (let i = 0; i < array.length; i++) {
        
        
        if (i === indiceVerde){
            pincel.fillStyle = "green";
        } 
        else if (i === indice1 || i === indice2 ) {
            pincel.fillStyle = "red"; 
        } 
        else {
            pincel.fillStyle = "black"; 
        }

        // Tudo isso fica DENTRO do for
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


let ordenando = false;
botaoGerar.addEventListener("click", function() {
    if (ordenando) return;
    listaNumeros = gerarArrayAleatorio(listaNumeros.length); 
    desenharTela(listaNumeros);
});

const botaoOrdenar = document.getElementById("btn-ordenar");


botaoOrdenar.addEventListener("click", async function() {
    if (ordenando) return;
    ordenando = true;
    const algoritmoEscolhido = seletorAlgoritmo.value;
    if (algoritmoEscolhido === "bubble") {
        for (let i =0; i < listaNumeros.length; i++) {
            for (let j =0; j < listaNumeros.length - i - 1; j++) {

                tocarSom(listaNumeros[j]);
                await sleep(parseInt(sliderVelocidade.value)); 
                if (listaNumeros[j] > listaNumeros[j+1]){
                    let temp = listaNumeros[j];
                    listaNumeros[j] = listaNumeros[j+1];
                    listaNumeros[j+1] = temp;

                    desenharTela(listaNumeros, j, j+1, -1);
                }
            }
        }
    }

    if (algoritmoEscolhido === "selection") {
        for (let i = 0; i < listaNumeros.length; i++) {
            
            let menorIndice = i; 
            
            // Varremos o resto do array (i + 1) para a direita
            for (let j = i + 1; j < listaNumeros.length; j++) {
                
                // Toca som e freia para podermos ver a varredura
                tocarSom(listaNumeros[j]);
                await sleep(parseInt(sliderVelocidade.value)); 
                
                desenharTela(listaNumeros, menorIndice, j, -1);
                
                // Se encontrarmos um número menor, atualizamos quem é o menor índice
                if (listaNumeros[j] < listaNumeros[menorIndice]) {
                    menorIndice = j;
                }
            }

            if (menorIndice !== i) {
            let temp = listaNumeros[i];
            listaNumeros[i] = listaNumeros[menorIndice];
            listaNumeros[menorIndice] = temp;

            }
        }
    }

    for (let w = 0; w < listaNumeros.length; w++) {

    tocarSom(listaNumeros[w]);
    desenharTela(listaNumeros, -1, -1, w);
    await sleep(30); 
    }

    desenharTela(listaNumeros);
    ordenando = false;
}

    
);