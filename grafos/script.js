const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");
const btnLimpar = document.getElementById("btn-limpar");
const btnBfs = document.getElementById("btn-bfs");

const TAMANHO_BLOCO = 20;
const LINHAS = tela.height / TAMANHO_BLOCO; // 20 linhas
const COLUNAS = tela.width / TAMANHO_BLOCO; // 40 colunas

// Estados de cada bloco na malha
const VAZIO = 0;
const PAREDE = 1;
const INICIO = 2;
const FIM = 3;
const VISITADO = 4;
const CAMINHO = 5;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Cria a matriz 2D preenchida com zeros (VAZIO)
let malha = [];
function inicializarMalha() {
    malha = [];
    for (let l = 0; l < LINHAS; l++) {
        let linha = [];
        for (let c = 0; c < COLUNAS; c++) {
            linha.push(VAZIO);
        }
        malha.push(linha);
    }
    
    // Define pontos de Início (Esquerda) e Fim (Direita) por padrão
    malha[10][5] = INICIO;
    malha[10][34] = FIM;
}

function desenharMalha() {
    pincel.clearRect(0, 0, tela.width, tela.height);
    
    for (let l = 0; l < LINHAS; l++) {
        for (let c = 0; c < COLUNAS; c++) {
            let x = c * TAMANHO_BLOCO;
            let y = l * TAMANHO_BLOCO;
            
            // Escolhe a cor baseada no estado numérico da matriz
            if (malha[l][c] === VAZIO) pincel.fillStyle = "#000000";
            else if (malha[l][c] === PAREDE) pincel.fillStyle = "#333333";
            else if (malha[l][c] === INICIO) pincel.fillStyle = "#00ff00"; // Verde
            else if (malha[l][c] === FIM) pincel.fillStyle = "#ff0000"; // Vermelho
            
            // Desenha o bloco
            pincel.fillRect(x, y, TAMANHO_BLOCO, TAMANHO_BLOCO);
            
            // Desenha a borda fina (efeito grid)
            pincel.strokeStyle = "rgba(0, 255, 65, 0.2)";
            pincel.lineWidth = 1;
            pincel.strokeRect(x, y, TAMANHO_BLOCO, TAMANHO_BLOCO);
        }
    }
}

inicializarMalha();
desenharMalha();

// --- CONTROLES DO MOUSE ---
let desenhando = false;

tela.addEventListener("mousedown", () => desenhando = true);
tela.addEventListener("mouseup", () => desenhando = false);
tela.addEventListener("mouseleave", () => desenhando = false);

tela.addEventListener("mousemove", function(evento) {
    if (!desenhando) return;
    
    // Pega a posição do mouse e descobre em qual linha e coluna ele está
    const retangulo = tela.getBoundingClientRect();
    const x = evento.clientX - retangulo.left;
    const y = evento.clientY - retangulo.top;
    
    const col = Math.floor(x / TAMANHO_BLOCO);
    const lin = Math.floor(y / TAMANHO_BLOCO);
    
    // Se o bloco estiver vazio, vira parede
    if (malha[lin][col] === VAZIO) {
        malha[lin][col] = PAREDE;
        desenharMalha();
    }
});

btnLimpar.addEventListener("click", () => {
    inicializarMalha();
    desenharMalha();
});