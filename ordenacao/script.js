const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");
const botaoGerar = document.getElementById("btn-gerar");
const sliderQuantidade = document.getElementById("slider-quantidade");
const sliderVelocidade = document.getElementById("slider-velocidade");
const seletorAlgoritmo = document.getElementById("seletor-algoritmo");
const botaoOrdenar = document.getElementById("btn-ordenar");

const valorQuantidade = document.getElementById("valor-quantidade");
const valorVelocidade = document.getElementById("valor-velocidade");
const contadorComparacoes = document.getElementById("contador-comparacoes");
const contadorAcessos = document.getElementById("contador-acessos");
const teoriaTitulo = document.getElementById("teoria-titulo");
const teoriaTempo = document.getElementById("teoria-tempo");
const teoriaEspaco = document.getElementById("teoria-espaco");

let ordenando = false;
let comparacoes = 0;
let acessos = 0;

const dadosTeoria = {
    bubble: { titulo: "Bubble Sort", tempo: "O(n²)", espaco: "O(1)" },
    selection: { titulo: "Selection Sort", tempo: "O(n²)", espaco: "O(1)" },
    insertion: { titulo: "Insertion Sort", tempo: "O(n²)", espaco: "O(1)" },
    quick: { titulo: "Quick Sort", tempo: "O(n log n)", espaco: "O(log n)" },
    merge: { titulo: "Merge Sort", tempo: "O(n log n)", espaco: "O(n)" }
};

function atualizarEstatisticas() {
    contadorComparacoes.innerText = comparacoes;
    contadorAcessos.innerText = acessos;
}

function resetarEstatisticas() {
    comparacoes = 0;
    acessos = 0;
    atualizarEstatisticas();
}

seletorAlgoritmo.addEventListener("change", function() {
    const alg = dadosTeoria[this.value];
    teoriaTitulo.innerText = `[ ${alg.titulo} ]`;
    teoriaTempo.innerText = alg.tempo;
    teoriaEspaco.innerText = alg.espaco;
});

sliderQuantidade.addEventListener("input", function() {
    valorQuantidade.innerText = this.value; 
    if (ordenando) {
        this.value = listaNumeros.length;
        valorQuantidade.innerText = this.value;
        return; 
    }
    listaNumeros = gerarArrayAleatorio(parseInt(this.value));
    desenharTela(listaNumeros);
    resetarEstatisticas();
});

sliderVelocidade.addEventListener("input", function() {
    valorVelocidade.innerText = this.value; 
});

function desenharTela(array, indice1 = -1, indice2 = -1, indiceVerde = -1) {
    pincel.clearRect(0, 0, tela.width, tela.height);
    const espaco = 2; 
    const larguraBarra = (tela.width / array.length) - espaco;
    
    for (let i = 0; i < array.length; i++) {
        if (i === indiceVerde) pincel.fillStyle = "#00ff00"; 
        else if (i === indice1 || i === indice2) pincel.fillStyle = "#ff0000"; 
        else pincel.fillStyle = "#ffffff"; 

        let altura = array[i];
        let posX = i * (larguraBarra + espaco);
        let posY = tela.height - altura;
        
        pincel.fillRect(posX, posY, larguraBarra, altura);
        pincel.lineWidth = 1;
        pincel.strokeStyle = "#00ff41";
        pincel.strokeRect(posX, posY, larguraBarra, altura);
    } 
}

function gerarArrayAleatorio(quantidade) {
    let novaLista = [];
    for (let i = 0; i < quantidade; i++) {
        novaLista.push(Math.floor(Math.random() * 350) + 10);
    }
    return novaLista;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function quickSort(arr, inicio, fim) {
    if (inicio >= fim) return; 
    let indicePivo = await partition(arr, inicio, fim);
    await quickSort(arr, inicio, indicePivo - 1);
    await quickSort(arr, indicePivo + 1, fim);
}

async function partition(arr, inicio, fim) {
    let valorPivo = arr[fim];
    acessos++; 
    let indiceTroca = inicio;
    
    for (let i = inicio; i < fim; i++) {
        desenharTela(arr, i, fim, -1);
        if (typeof tocarSom === 'function') tocarSom(arr[i]);
        await sleep(parseInt(sliderVelocidade.value));
        
        comparacoes++;
        acessos++; 
        if (arr[i] < valorPivo) {
            let tmp = arr[i];
            arr[i] = arr[indiceTroca];
            arr[indiceTroca] = tmp;
            acessos += 4; 
            indiceTroca++; 
        }
        atualizarEstatisticas();
    }
    let temp = arr[indiceTroca];
    arr[indiceTroca] = arr[fim];
    arr[fim] = temp;
    acessos += 4; 
    atualizarEstatisticas();

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
    
    for (let i = 0; i < n1; i++) { esquerda[i] = arr[inicio + i]; acessos += 2; }
    for (let j = 0; j < n2; j++) { direita[j] = arr[meio + 1 + j]; acessos += 2; }
    
    let i = 0, j = 0, k = inicio; 
    while (i < n1 && j < n2) {
        desenharTela(arr, inicio + i, meio + 1 + j, -1);
        if (typeof tocarSom === 'function') tocarSom(arr[k]);
        await sleep(parseInt(sliderVelocidade.value));
        
        comparacoes++;
        acessos += 2; 
        if (esquerda[i] <= direita[j]) {
            arr[k] = esquerda[i];
            i++;
        } else {
            arr[k] = direita[j];
            j++;
        }
        acessos++; 
        k++; 
        atualizarEstatisticas();
    }
    
    while (i < n1) {
        arr[k] = esquerda[i]; acessos++;
        desenharTela(arr, k, k, -1);
        await sleep(parseInt(sliderVelocidade.value));
        i++; k++; atualizarEstatisticas();
    }
    
    while (j < n2) {
        arr[k] = direita[j]; acessos++;
        desenharTela(arr, k, k, -1);
        await sleep(parseInt(sliderVelocidade.value));
        j++; k++; atualizarEstatisticas();
    }
}

let listaNumeros = gerarArrayAleatorio(parseInt(sliderQuantidade.value)); 
desenharTela(listaNumeros);
seletorAlgoritmo.dispatchEvent(new Event('change')); 

botaoGerar.addEventListener("click", function() {
    if (ordenando) return;
    listaNumeros = gerarArrayAleatorio(parseInt(sliderQuantidade.value)); 
    desenharTela(listaNumeros);
    resetarEstatisticas();
});

botaoOrdenar.addEventListener("click", async function() {
    if (ordenando) return;
    ordenando = true;
    resetarEstatisticas();
    const algoritmoEscolhido = seletorAlgoritmo.value;
    
    if (algoritmoEscolhido === "bubble") {
        for (let i = 0; i < listaNumeros.length; i++) {
            for (let j = 0; j < listaNumeros.length - i - 1; j++) {
                if (typeof tocarSom === 'function') tocarSom(listaNumeros[j]);
                await sleep(parseInt(sliderVelocidade.value)); 
                
                comparacoes++;
                acessos += 2; 
                if (listaNumeros[j] > listaNumeros[j+1]){
                    let temp = listaNumeros[j];
                    listaNumeros[j] = listaNumeros[j+1];
                    listaNumeros[j+1] = temp;
                    acessos += 4; 
                    desenharTela(listaNumeros, j, j+1, -1);
                }
                atualizarEstatisticas();
            }
        }
    }
    else if (algoritmoEscolhido === "selection") {
        for (let i = 0; i < listaNumeros.length; i++) {
            let menorIndice = i; 
            for (let j = i + 1; j < listaNumeros.length; j++) {
                if (typeof tocarSom === 'function') tocarSom(listaNumeros[j]);
                await sleep(parseInt(sliderVelocidade.value)); 
                desenharTela(listaNumeros, menorIndice, j, -1);
                
                comparacoes++;
                acessos += 2;
                if (listaNumeros[j] < listaNumeros[menorIndice]) {
                    menorIndice = j;
                }
                atualizarEstatisticas();
            }
            if (menorIndice !== i) {
                let temp = listaNumeros[i];
                listaNumeros[i] = listaNumeros[menorIndice];
                listaNumeros[menorIndice] = temp;
                acessos += 4; 
                atualizarEstatisticas();
            }
        }
    }
    else if (algoritmoEscolhido === "insertion") {
        for (let i = 1; i < listaNumeros.length; i++) {
            let chave = listaNumeros[i];
            acessos++; 
            let j = i - 1;

            while (j >= 0) {
                comparacoes++;
                acessos++; 
                if (listaNumeros[j] > chave) {
                    if (typeof tocarSom === 'function') tocarSom(listaNumeros[j]);
                    desenharTela(listaNumeros, j, j + 1, -1);
                    await sleep(parseInt(sliderVelocidade.value));

                    listaNumeros[j + 1] = listaNumeros[j];
                    acessos += 2; 
                    j--;
                    atualizarEstatisticas();
                } else {
                    atualizarEstatisticas();
                    break;
                }
            }
            listaNumeros[j + 1] = chave;
            acessos++; 
            atualizarEstatisticas();
        }
    }
    else if (algoritmoEscolhido === "quick") {
        await quickSort(listaNumeros, 0, listaNumeros.length - 1);
    }
    else if (algoritmoEscolhido === "merge") {
        await mergeSort(listaNumeros, 0, listaNumeros.length - 1);
    }

    for (let w = 0; w < listaNumeros.length; w++) {
        if (typeof tocarSom === 'function') tocarSom(listaNumeros[w]);
        desenharTela(listaNumeros, -1, -1, w);
        await sleep(30); 
    }

    desenharTela(listaNumeros);
    ordenando = false;
});