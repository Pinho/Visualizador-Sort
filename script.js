const tela = document.getElementById("tela");
const pincel = tela.getContext("2d");

//lista de números = alturas das barras
const valores = [150, 50, 200, 80, 300, 120, 250];

// Tamanho padrão para as barras
const larguraBarra = 40;
const espaco = 10; // Espaço em branco entre uma barra e outra

pincel.fillStyle = "black";

for (let i = 0; i < valores.length; i++) {
    
    let altura = valores[i];

    let posX = i * (larguraBarra + espaco);

    let posY = tela.height - altura;

    // Desenha a barra atual
    pincel.fillRect(posX, posY, larguraBarra, altura);
}