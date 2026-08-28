const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");
const inputValor = document.getElementById("input-valor");
const btnInserir = document.getElementById("btn-inserir");


class No {
    constructor(valor, x, y) {
        this.valor = valor;
        this.x = x;
        this.y = y;
        this.esquerda = null;
        this.direita = null;
    }
}

class ArvoreBinaria {
    constructor() {
        this.raiz = null;
    }

    inserir(valor) {
        
        if (this.raiz === null) {
            this.raiz = new No(valor, tela.width / 2, 50);
            return;
        }
        
        
        this._inserirRecursivo(this.raiz, valor, tela.width / 2, 50, tela.width / 4);
    }

    _inserirRecursivo(noAtual, valor, x, y, espacamentoX) {
        // O SEU DESAFIO LÓGICO ESTÁ AQUI:
        // A regra da BST é: Menores vão para a ESQUERDA. Maiores vão para a DIREITA.

        if (valor < noAtual.valor) {
            // Se for menor, olhamos para a esquerda
            if (noAtual.esquerda === null) {

                // Achamos um espaço vazio! Crie um novo 'No' aqui.
                // A posição Y desce 60 pixels (y + 60)
                // A posição X vai para a esquerda (x - espacamentoX)
                
                // ESCREVA AQUI A CRIAÇÃO DO NÓ DA ESQUERDA:
                new No(valor, x - espacamentoX, y + 60); 
                noAtual.esquerda = new No(valor, x - espacamentoX, y + 60);
                
            } else {
                // Se já tem alguém lá, continuamos descendo recursivamente
                this._inserirRecursivo(noAtual.esquerda, valor, x - espacamentoX, y + 60, espacamentoX / 2);
            }
        } 
        else if (valor > noAtual.valor) {
            // Se for maior, olhamos para a direita
            if (noAtual.direita === null) {
                
                // ESCREVA AQUI A CRIAÇÃO DO NÓ DA DIREITA:
                new No(valor, x + espacamentoX, y + 60); 
                noAtual.direita = new No(valor, x + espacamentoX, y + 60);                
            } else {
                this._inserirRecursivo(noAtual.direita, valor, x + espacamentoX, y + 60, espacamentoX / 2);
            }
        }
    }
}

const bst = new ArvoreBinaria();

// Motor de Renderização Visual
function desenharArvore(no) {
    if (no === null) return;

    // Desenha as linhas conectando os filhos primeiro
    pincel.lineWidth = 2;
    pincel.strokeStyle = "#00ff41";
    
    if (no.esquerda !== null) {
        pincel.beginPath();
        pincel.moveTo(no.x, no.y);
        pincel.lineTo(no.esquerda.x, no.esquerda.y);
        pincel.stroke();
        desenharArvore(no.esquerda);
    }

    if (no.direita !== null) {
        pincel.beginPath();
        pincel.moveTo(no.x, no.y);
        pincel.lineTo(no.direita.x, no.direita.y);
        pincel.stroke();
        desenharArvore(no.direita);
    }

    // Desenha o círculo do Nó
    pincel.beginPath();
    pincel.arc(no.x, no.y, 20, 0, Math.PI * 2);
    pincel.fillStyle = "#000000";
    pincel.fill();
    pincel.stroke();

    // Desenha o texto (valor) no centro do círculo
    pincel.fillStyle = "#ffffff";
    pincel.font = "bold 14px Courier New";
    pincel.textAlign = "center";
    pincel.textBaseline = "middle";
    pincel.fillText(no.valor, no.x, no.y);
}

function atualizarTela() {
    pincel.clearRect(0, 0, tela.width, tela.height);
    desenharArvore(bst.raiz);
}

// Evento do botão
btnInserir.addEventListener("click", function() {
    let valor = parseInt(inputValor.value);
    if (!isNaN(valor)) {
        bst.inserir(valor);
        atualizarTela();
    }
});