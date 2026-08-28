const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");
const inputValor = document.getElementById("input-valor");
const btnInserir = document.getElementById("btn-inserir");
const btnBuscar = document.getElementById("btn-buscar");
const btnInOrder = document.getElementById("btn-inorder");
const btnPreOrder = document.getElementById("btn-preorder");
const btnPostOrder = document.getElementById("btn-postorder");
const resultadoTravessia = document.getElementById("resultado-travessia");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


class No {
    constructor(valor, x, y) {
        this.corFundo = "#000000";
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

    async buscarVisual(valor) {
        let atual = this.raiz;
        
        while (atual !== null) {
            // Pinta o nó atual de amarelo (analisando)
            atual.corFundo = "#ffff00"; 
            atualizarTela();
            await sleep(600);

            if (valor === atual.valor) {
                atual.corFundo = "#00ff00"; // Encontrou! Fica verde
                atualizarTela();
                return true;
            } 
            else if (valor < atual.valor) {
                atual.corFundo = "#333333"; // Descarta e deixa cinza
                atual = atual.esquerda;
            } 
            else {
                atual.corFundo = "#333333"; // Descarta e deixa cinza
                atual = atual.direita;
            }
        }
        return false;
    }
    
    // Função para limpar as cores da árvore depois de buscar
    limparCores(no) {
        if (no !== null) {
            no.corFundo = "#000000";
            this.limparCores(no.esquerda);
            this.limparCores(no.direita);
        }
    }

    async inOrder(no) {
        if (no !== null) {
            // 1. Vai o mais fundo possível para a ESQUERDA
            await this.inOrder(no.esquerda);
            
            // 2. VISITA A RAIZ (O Nó Atual)
            no.corFundo = "#ff00ff"; // Brilha em rosa
            atualizarTela();
            resultadoTravessia.innerText += no.valor + " - ";
            await sleep(400);
            no.corFundo = "#000000"; // Volta ao normal
            atualizarTela();
            
            // 3. Vai para a DIREITA
            await this.inOrder(no.direita);
        }
    }

    async preOrder(no) {
        if (no !== null) {


            no.corFundo = "#ff00ff"; // Brilha em rosa
            atualizarTela();
            resultadoTravessia.innerText += no.valor + " - ";
            await sleep(400);
            no.corFundo = "#000000"; // Volta ao normal
            atualizarTela();

            await this.preOrder(no.esquerda);

            await this.preOrder(no.direita);
        }
    }

    async postOrder(no) {
        if (no !== null) {
            // 1. Vai o mais fundo possível para a ESQUERDA
            await this.postOrder(no.esquerda);

                        
            // 3. Vai para a DIREITA
            await this.postOrder(no.direita);
            
            // 2. VISITA A RAIZ (O Nó Atual)
            no.corFundo = "#ff00ff"; // Brilha em rosa
            atualizarTela();
            resultadoTravessia.innerText += no.valor + " - ";
            await sleep(400);
            no.corFundo = "#000000"; // Volta ao normal
            atualizarTela();

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
    pincel.fillStyle = no.corFundo;
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
btnPreOrder.addEventListener("click", async function() {
    resultadoTravessia.innerText = "";
    bst.limparCores(bst.raiz);
    await bst.preOrder(bst.raiz);
});

btnPostOrder.addEventListener("click", async function() {
    resultadoTravessia.innerText = "";
    bst.limparCores(bst.raiz);
    await bst.postOrder(bst.raiz);
});

btnInOrder.addEventListener("click", async function() {
    resultadoTravessia.innerText = "";
    bst.limparCores(bst.raiz);
    await bst.inOrder(bst.raiz);
});

btnBuscar.addEventListener("click", async function() {
    bst.limparCores(bst.raiz);
    let valor = parseInt(inputValor.value);
    if (!isNaN(valor)) {
        await bst.buscarVisual(valor);
    }
});