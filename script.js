const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");
const botaoGerar = document.getElementById("btn-gerar");
const sliderQuantidade = document.getElementById("slider-quantidade");
const sliderVelocidade = document.getElementById("slider-velocidade");
const seletorAlgoritmo = document.getElementById("seletor-algoritmo");
const botaoOrdenar = document.getElementById("btn-ordenar");

// Variável de controle global movida para o topo
let ordenando = false;

async function quickSort(arr, inicio, fim) {
    if (inicio >= fim) return; 
    let indicePivo = await partition(arr, inicio, fim);
    await quickSort(arr, inicio, indicePivo - 1);
    await quickSort(arr, indicePivo + 1, fim);
}

async function partition(arr, inicio, fim) {
    let valorPivo = arr[fim];
    let indiceTroca = inicio;
    
    for (let i = inicio; i < fim; i++) {
        desenharTela(arr, i, fim, -1);
        tocarSom(arr[i]);
        await sleep(parseInt(sliderVelocidade.value));
        
        if (arr[i] < valorPivo) {
            let tmp = arr[i];
            arr[i] = arr[indiceTroca];
            arr[indiceTroca] = tmp;
            indiceTroca++; 
        }
    }
    let temp = arr[indiceTroca];
    arr[indiceTroca] = arr[fim];
    arr[fim] = temp;

    desenharTela(arr, indiceTroca, fim, -1);
    return indiceTroca; 
}

async function mergeSort(arr, inicio, fim) {
    if (inicio >= fim) return; 
    let meio = Math.floor((inicio + fim) / 2);
    await mergeSort(arr, inicio, meio);
    await mergeSort(arr, meio + 1, fim);
    await merge(arr, inicio, meio, fim);
}

async function merge(arr, inicio, meio, fim) {
    let n1 = meio - inicio + 1;
    let n2 = fim - meio;
    
    let esquerda = new Array(n1);
    let direita = new Array(n2);
    
    for (let i = 0; i < n1; i++) esquerda[i] = arr[inicio + i];
    for (let j = 0; j < n2; j++) direita[j] = arr[meio + 1 + j];
    
    let i = 0, j = 0;
    let k = inicio; 

    while (i < n1 && j < n2) {
        desenharTela(arr, inicio + i, meio + 1 + j, -1);
        tocarSom(arr[k]);
        await sleep(parseInt(sliderVelocidade.value));
        
        if (esquerda[i] <= direita[j]) {
            arr[k] = esquerda[i];
            i++;
        } else {
            arr[k] = direita[j];
            j++;
        }
        k++; 
    }
    
    while (i < n1) {
        arr[k] = esquerda[i];
        desenharTela(arr, k, k, -1);
        await sleep(parseInt(sliderVelocidade.value));
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = direita[j];
        desenharTela(arr, k, k, -1);
        await sleep(parseInt(sliderVelocidade.value));
        j++;
        k++;
    }
}

function desenharTela(array, indice1 = -1, indice2 = -1, indiceVerde = -1) {
    pincel.clearRect(0, 0, tela.width, tela.height);
    const espaco = 2; 
    const larguraBarra = (tela.width / array.length) - espaco;
    
    for (let i = 0; i < array.length; i++) {
        
        if (i === indiceVerde) {
            pincel.fillStyle = "#00ff00"; // Verde para os elementos já ordenados
        } 
        else if (i === indice1 || i === indice2) {
            pincel.fillStyle = "#ff0000"; // Vermelho bem vermelho (puro)
        } 
        else {
            pincel.fillStyle = "#ffffff"; // Colunas brancas
        }

        let altura = array[i];
        let posX = i * (larguraBarra + espaco);
        let posY = tela.height - altura;

        pincel.fillRect(posX, posY, larguraBarra, altura);
    } 
}

function gerarArrayAleatorio(quantidade) {
    let novaLista = [];
    for (let i = 0; i < quantidade; i++) {
        let valorSorteado = Math.floor(Math.random() * 350) + 10; 
        novaLista.push(valorSorteado);
    }
    return novaLista;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// SOLUÇÃO DO DESAFIO AQUI
sliderQuantidade.addEventListener("input", function() {
    // Se estiver ordenando, não deixamos mudar a quantidade para não bugar a tela
    if (ordenando) {
        this.value = listaNumeros.length;
        return; 
    }
    
    let novaQuantidade = parseInt(sliderQuantidade.value);
    listaNumeros = gerarArrayAleatorio(novaQuantidade);
    desenharTela(listaNumeros);
});

let listaNumeros = gerarArrayAleatorio(parseInt(sliderQuantidade.value)); 
desenharTela(listaNumeros);

botaoGerar.addEventListener("click", function() {
    if (ordenando) return;
    listaNumeros = gerarArrayAleatorio(parseInt(sliderQuantidade.value)); 
    desenharTela(listaNumeros);
});

botaoOrdenar.addEventListener("click", async function() {
    if (ordenando) return;
    ordenando = true;
    const algoritmoEscolhido = seletorAlgoritmo.value;
    
    if (algoritmoEscolhido === "bubble") {
        for (let i = 0; i < listaNumeros.length; i++) {
            for (let j = 0; j < listaNumeros.length - i - 1; j++) {
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
            for (let j = i + 1; j < listaNumeros.length; j++) {
                tocarSom(listaNumeros[j]);
                await sleep(parseInt(sliderVelocidade.value)); 
                desenharTela(listaNumeros, menorIndice, j, -1);
                
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

    if (algoritmoEscolhido === "insertion") {
        for (let i = 1; i < listaNumeros.length; i++) {
            let chave = listaNumeros[i];
            let j = i - 1;
            while (j >= 0 && listaNumeros[j] > chave) {
                tocarSom(listaNumeros[j]);
                desenharTela(listaNumeros, j, j + 1, -1);
                await sleep(parseInt(sliderVelocidade.value));

                if(listaNumeros[j] > chave) {
                    let temp = listaNumeros[j];
                    listaNumeros[j] = listaNumeros[j + 1];
                    listaNumeros[j + 1] = temp;
                    j--;
                }
            }
            listaNumeros[j + 1] = chave;
        }
    }

    if (algoritmoEscolhido === "quick") {
        await quickSort(listaNumeros, 0, listaNumeros.length - 1);
    }

    if (algoritmoEscolhido === "merge") {
        await mergeSort(listaNumeros, 0, listaNumeros.length - 1);
    }

    // Animação final: varredura verde indicando sucesso
    for (let w = 0; w < listaNumeros.length; w++) {
        tocarSom(listaNumeros[w]);
        desenharTela(listaNumeros, -1, -1, w);
        await sleep(30); 
    }

    desenharTela(listaNumeros);
    ordenando = false;
});