const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");
const inputValor = document.getElementById("input-valor");

const btnPush = document.getElementById("btn-push");
const btnPop = document.getElementById("btn-pop");
const btnEnqueue = document.getElementById("btn-enqueue");
const btnDequeue = document.getElementById("btn-dequeue");

let pilha = [];
let fila = [];

function desenharTela() {
    pincel.clearRect(0, 0, tela.width, tela.height);
    pincel.font = "bold 18px Courier New";
    
    pincel.fillStyle = "#00ff41";
    pincel.fillText("[ PILHA (LIFO) ]", 100, 40);
    pincel.fillText("[ FILA (FIFO) ]", 450, 40);

    const larguraBloco = 60;
    const alturaBloco = 30;
    const espaco = 5;

    for (let i = 0; i < pilha.length; i++) {
        let posX = 130;
        let posY = tela.height - 20 - (i * (alturaBloco + espaco)) - alturaBloco;

        pincel.fillStyle = "#000000";
        pincel.fillRect(posX, posY, larguraBloco, alturaBloco);
        pincel.strokeStyle = "#00ff41";
        pincel.strokeRect(posX, posY, larguraBloco, alturaBloco);

        pincel.fillStyle = "#ffffff";
        pincel.fillText(pilha[i], posX + 15, posY + 22);
    }

    for (let j = 0; j < fila.length; j++) {
        let posX = 450 + (j * (larguraBloco + espaco));
        let posY = tela.height / 2;

        pincel.fillStyle = "#000000";
        pincel.fillRect(posX, posY, larguraBloco, alturaBloco);
        pincel.strokeStyle = "#00ff41";
        pincel.strokeRect(posX, posY, larguraBloco, alturaBloco);

        pincel.fillStyle = "#ffffff";
        pincel.fillText(fila[j], posX + 15, posY + 22);
    }
}


desenharTela();

btnPush.addEventListener("click", function() {
    let valor = parseInt(inputValor.value);
    pilha.push(valor);
    desenharTela();
});

btnPop.addEventListener("click", function() {
    pilha.pop();
    desenharTela();
});

btnEnqueue.addEventListener("click", function() {
    let valor = parseInt(inputValor.value);
    fila.push(valor);
    desenharTela();
});

btnDequeue.addEventListener("click", function() {
    fila.shift();
    desenharTela();
});