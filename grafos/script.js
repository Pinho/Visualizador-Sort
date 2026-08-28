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
            
            if (malha[l][c] === VAZIO) pincel.fillStyle = "#000000";
            else if (malha[l][c] === PAREDE) pincel.fillStyle = "#333333";
            else if (malha[l][c] === INICIO) pincel.fillStyle = "#00ff00"; 
            else if (malha[l][c] === FIM) pincel.fillStyle = "#ff0000"; 
            else if (malha[l][c] === VISITADO) pincel.fillStyle = "#003300"; // Rastro da busca
            else if (malha[l][c] === CAMINHO) pincel.fillStyle = "#ffff00"; // Caminho final
            
            pincel.fillRect(x, y, TAMANHO_BLOCO, TAMANHO_BLOCO);
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

async function resolverBFS() {
    // A Fila começa com o ponto verde (linha 10, coluna 5) e um caminho vazio
    let fila = [{ l: 10, c: 5, caminhoAteAqui: [] }]; 
    let direcoes = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Cima, Baixo, Esquerda, Direita
    let achou = false;
    let caminhoFinal = [];

    while (fila.length > 0) {
        let atual = fila.shift(); // Tira o primeiro quadrado da fila
        let l = atual.l;
        let c = atual.c;

        // Se bater no alvo vermelho, para tudo
        if (malha[l][c] === FIM) {
            achou = true;
            caminhoFinal = atual.caminhoAteAqui;
            break;
        }

        // Pinta de verde escuro para mostrar que já passamos por aqui
        if (malha[l][c] !== INICIO) {
            malha[l][c] = VISITADO;
            desenharMalha();
            await sleep(5); // Altere esse número para acelerar ou frear a água
        }

        // Verifica os 4 vizinhos ao redor
        for (let mov of direcoes) {
            let nl = l + mov[0];
            let nc = c + mov[1];

            // Confere se o vizinho não vazou para fora da tela
            if (nl >= 0 && nl < LINHAS && nc >= 0 && nc < COLUNAS) {
                
                // Só entra se for um espaço vazio ou o destino final
                if (malha[nl][nc] === VAZIO || malha[nl][nc] === FIM) {
                    
                    if (malha[nl][nc] === VAZIO) {
                        malha[nl][nc] = VISITADO; // Marca antes de pôr na fila para não repetir
                    }
                    
                    // Adiciona o vizinho no final da fila (anexando o rastro)
                    fila.push({
                        l: nl,
                        c: nc,
                        caminhoAteAqui: [...atual.caminhoAteAqui, { l: nl, c: nc }]
                    });
                }
            }
        }
    }

    // A Animação do Caminho
    if (achou) {
        for (let passo of caminhoFinal) {
            if (malha[passo.l][passo.c] !== FIM) {
                malha[passo.l][passo.c] = CAMINHO; // Pinta o vencedor de Amarelo
                desenharMalha();
                await sleep(30);
            }
        }
    } else {
        alert("[ ERRO ] Rota isolada. Destrua algumas paredes.");
    }
}

// O gatilho do botão
btnBfs.addEventListener("click", async function() {
    // Antes de buscar, varre a malha e limpa o rastro de buscas antigas (sem apagar as paredes)
    for (let l = 0; l < LINHAS; l++) {
        for (let c = 0; c < COLUNAS; c++) {
            if (malha[l][c] === VISITADO || malha[l][c] === CAMINHO) {
                malha[l][c] = VAZIO;
            }
        }
    }
    desenharMalha();
    await resolverBFS();
});