// Prepara o motor de áudio do navegador
const ctxAudio = new (window.AudioContext || window.webkitAudioContext)();

function tocarSom(valor) {
    // Retoma o áudio (navegadores bloqueiam som até o usuário interagir com a página)
    if (ctxAudio.state === 'suspended') {
        ctxAudio.resume();
    }

    const oscilador = ctxAudio.createOscillator();
    const ganho = ctxAudio.createGain();

    // Define o tipo da onda (tente "square", "sawtooth" ou "triangle" depois)
    oscilador.type = "sine"; 
    
    // A mágica do tom: a frequência base (150Hz) + o tamanho da barra
    oscilador.frequency.value = 150 + valor;

    // Volume em 5% para não estourar os ouvidos
    ganho.gain.value = 0.05;

    oscilador.connect(ganho);
    ganho.connect(ctxAudio.destination);

    oscilador.start();
    
    // Faz o som sumir rapidamente em 50 milissegundos (0.05s)
    ganho.gain.exponentialRampToValueAtTime(0.00001, ctxAudio.currentTime + 0.05);
    oscilador.stop(ctxAudio.currentTime + 0.05);
}