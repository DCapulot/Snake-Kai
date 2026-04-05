const TAMANHO_TABULEIRO = 20;
const TAMANHO_CELULA = 20;

const CONFIG_DIFICULDADE = {
    "facil": { velocidade: 200, texto: "Fácil" },
    "normal": { velocidade: 150, texto: "Normal" },
    "dificil": { velocidade: 100, texto: "Difícil" },
    "insano": { velocidade: 70, texto: "Insano" } 
};

const OBSTACULOS_DIFICIL = [

    [0, 0], [1, 0], [0, 1],
    [19, 0], [18, 0], [19, 1],
    [0, 19], [1, 19], [0, 18],
    [19, 19], [18, 19], [19, 18],
    
    [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12],
    [12, 7], [11, 8], [10, 9], [9, 10], [8, 11], [7, 12]
];

const OBSTACULOS_INSANO = [
    ...OBSTACULOS_DIFICIL,
    
    [3, 5], [4, 5], [5, 5], 
    [14, 5], [15, 5], [16, 5], 
    
    [3, 14], [3, 15], [3, 16],
    [16, 14], [16, 15], [16, 16],
];

let obstaculosAtivos = []; 

let dificuldadeAtual = "normal";
let elementoDificuldade; 

const PONTOS_POR_NIVEL = 5;      
const DECREMENTO_VELOCIDADE = 10; 
const VELOCIDADE_MINIMA = 50;     


const MAX_VIDAS = 3; 
let vidasRestantes = MAX_VIDAS; 

const TIPOS_COMIDA = [
    { valor: 1, classe: "comida-normal", peso: 70, som: { freq: 700, dur: 0.08, tipo: 'sine' } }, 
    { valor: 5, classe: "comida-especial", peso: 25, som: { freq: 880, dur: 0.1, tipo: 'square' } }, 
    { valor: 10, classe: "comida-rara", peso: 5, som: { freq: 1100, dur: 0.12, tipo: 'triangle' } }   
];

let tempoInicio;
let intervaloTempo;
let cobra = [];
let comida = {};
let direcaoAtual = "direita";
let proximaDirecao = "direita";
let pontuacao = 0;
let melhorPontuacao = 0;
let jogoAtivo = false;
let jogoPausado = false; 
let intervaloJogo = null;
let velocidadeAtual = CONFIG_DIFICULDADE[dificuldadeAtual].velocidade; 
let tabuleiro;
let elementoPlacar;
let elementoMensagem;
let btnIniciar;
let btnReiniciar;
let elementoMenuPausa; 
let audioContext = null;

window.onload = function() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.error('Web Audio API não é suportada neste navegador:', e);
    }
    
    inicializarJogo();
};

function tocarSom(frequencia, duracao, tipo = 'square', decaimento = 0) {
    if (!audioContext || jogoPausado) return; 

    const oscilador = audioContext.createOscillator();
    const ganho = audioContext.createGain();

    oscilador.connect(ganho);
    ganho.connect(audioContext.destination);

    oscilador.type = tipo;
    oscilador.frequency.setValueAtTime(frequencia, audioContext.currentTime);

    if (decaimento > 0) {
        oscilador.frequency.exponentialRampToValueAtTime(
            frequencia - (frequencia * decaimento),
            audioContext.currentTime + duracao
        );
    }

    ganho.gain.setValueAtTime(0.3, audioContext.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duracao);

    oscilador.start();
    oscilador.stop(audioContext.currentTime + duracao);
}

function tocarMelodiaFim(notas) {
    if (!audioContext) return; 
    let tempoAtual = audioContext.currentTime;

    notas.forEach(([frequencia, duracao]) => {
        const oscilador = audioContext.createOscillator();
        const ganho = audioContext.createGain();

        oscilador.connect(ganho);
        ganho.connect(audioContext.destination);

        oscilador.type = 'triangle';
        oscilador.frequency.setValueAtTime(frequencia, tempoAtual);

        ganho.gain.setValueAtTime(0, tempoAtual);
        ganho.gain.linearRampToValueAtTime(0.2, tempoAtual + 0.01);
        ganho.gain.linearRampToValueAtTime(0, tempoAtual + duracao);

        oscilador.start(tempoAtual);
        oscilador.stop(tempoAtual + duracao);

        tempoAtual += duracao;
    });
}

function somComer(tipoComida) {
    tocarSom(tipoComida.freq, tipoComida.dur, tipoComida.tipo); 
}

function somPerderVida() {
    tocarSom(500, 0.2, 'square', 0.5); 
}

function somFimDeJogo() {
    tocarMelodiaFim([
        [523.25, 0.15],
        [392.00, 0.15],
        [329.63, 0.15],
        [261.63, 0.3]
    ]);
}


function formatarTempo(ms) {
    const segundosTotal = Math.floor(ms / 1000);
    const minutos = Math.floor(segundosTotal / 60);
    const segundos = segundosTotal % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

function atualizarPlacar() {
    const pontuacaoDisplay = Math.floor(pontuacao); 
    
    let tempoDecorrido = "00:00";
    if (tempoInicio && jogoAtivo && !jogoPausado) {
        tempoDecorrido = formatarTempo(Date.now() - tempoInicio);
    } else if (tempoInicio) {
        const tempoSalvo = localStorage.getItem('snakeTempoSalvo');
        tempoDecorrido = formatarTempo(tempoSalvo ? parseInt(tempoSalvo) : 0);
    }
    
    elementoPlacar.innerHTML = `
        Pontos: ${pontuacaoDisplay} | Recorde: ${melhorPontuacao} | Vidas: ${"❤️".repeat(vidasRestantes)} | Tempo: ${tempoDecorrido}
    `;
}

function iniciarContadorTempo() {
    if (intervaloTempo) {
        clearInterval(intervaloTempo);
    }
    const tempoSalvo = localStorage.getItem('snakeTempoSalvo') || 0;
    tempoInicio = Date.now() - parseInt(tempoSalvo);
    intervaloTempo = setInterval(atualizarPlacar, 1000);
}

function pararContadorTempo() {
    if (intervaloTempo) {
        clearInterval(intervaloTempo);
        intervaloTempo = null;
    }

    if (tempoInicio) {
        localStorage.setItem('snakeTempoSalvo', Date.now() - tempoInicio);
    }
}

function carregarMelhorPontuacao() {
    const recordeSalvo = localStorage.getItem('snakeMelhorPontuacao');
    melhorPontuacao = recordeSalvo ? parseInt(recordeSalvo) : 0;
}

function salvarMelhorPontuacao() {
    if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        localStorage.setItem('snakeMelhorPontuacao', melhorPontuacao);
        atualizarPlacar();
    }
}

function atualizarVidasDisplay() {
    atualizarPlacar(); 
}

function atualizarMensagem(htmlConteudo, classe) {
    elementoMensagem.innerHTML = htmlConteudo;
    elementoMensagem.className = "mensagem " + classe;
}


function inicializarJogo() {
    tabuleiro = document.getElementById("tabuleiro");
    elementoPlacar = document.getElementById("placar");
    elementoMensagem = document.getElementById("mensagem");
    btnIniciar = document.getElementById("btnIniciar");
    btnReiniciar = document.getElementById("btnReiniciar");
    elementoMenuPausa = document.getElementById("menuPausa"); 
    elementoDificuldade = document.getElementById("dificuldade-selecao"); 

    carregarMelhorPontuacao();
    configurarControles();
    configurarDificuldade(); 
    
    btnIniciar.onclick = comecarJogo; 
    btnReiniciar.onclick = comecarJogo;
    
    localStorage.setItem('snakeTempoSalvo', 0);
    atualizarVidasDisplay();
    selecionarDificuldade(dificuldadeAtual); 
}

function configurarDificuldade() {
    elementoDificuldade.innerHTML = ''; 
    for (const [chave, config] of Object.entries(CONFIG_DIFICULDADE)) {
        const btn = document.createElement('button');
        btn.textContent = config.texto;
        btn.dataset.nivel = chave;
        btn.onclick = () => selecionarDificuldade(chave);
        
        if (chave === dificuldadeAtual) {
            btn.classList.add('selecionado');
        }
        
        elementoDificuldade.appendChild(btn);
    }
}

/**
 * CORREÇÃO APLICADA AQUI: Esta função foi modificada para ler
 * o conteúdo HTML (que você personalizou) em vez de sobrescrevê-lo.
 * Ela só atualiza o nível de dificuldade na tela.
 */
function selecionarDificuldade(nivel) {
    dificuldadeAtual = nivel;
    
    const botoes = elementoDificuldade.querySelectorAll('button');
    botoes.forEach(btn => {
        btn.classList.remove('selecionado');
        if (btn.dataset.nivel === nivel) {
            btn.classList.add('selecionado');
        }
    });

    // Pega o conteúdo HTML *original* (o texto Cobra Kai) e adiciona a dificuldade.
    // Assim, o texto base vem do HTML e não de um string fixo no JS.
    let conteudoHTML = document.getElementById("mensagem").innerHTML;
    
    // Procura por algum marcador de dificuldade no HTML original (opcional, mas bom para manter)
    // Se você usa o texto "Nível de Dificuldade:", esta linha pode ser mantida para atualizar o nível
    if (conteudoHTML.includes("Nível de Combate:")) {
        conteudoHTML = conteudoHTML.replace(
            /(Nível de Combate:.*?<\/strong>)/, 
            `Nível de Combate: <strong>${CONFIG_DIFICULDADE[nivel].texto}</strong>`
        );
    } else {
        // Se o seu HTML não tiver o marcador, adicionamos de forma simples
        const h3 = elementoMensagem.querySelector('h3');
        if (h3) {
            h3.insertAdjacentHTML('afterend', `<p>Nível de Combate: <strong>${CONFIG_DIFICULDADE[nivel].texto}</strong></p>`);
            conteudoHTML = elementoMensagem.innerHTML; // Pega o conteúdo após a inserção
        }
    }
    
    atualizarMensagem(conteudoHTML, "inicial");
}


function alternarPausa() {
    if (!jogoAtivo) return;

    if (jogoPausado) {
        jogoPausado = false;
        elementoMenuPausa.style.display = "none";
        // Ajuste a mensagem para o tema Cobra Kai aqui se quiser
        atualizarMensagem("O Combate Recomeçou!", "jogando");
        iniciarContadorTempo();
        intervaloJogo = setInterval(gameLoop, velocidadeAtual); 
    } else {
        jogoPausado = true;
        clearInterval(intervaloJogo); 
        pararContadorTempo();
        elementoMenuPausa.style.display = "flex"; 
        // Ajuste a mensagem para o tema Cobra Kai aqui se quiser
        atualizarMensagem("Combate Pausado! Pressione 'P' ou 'Continuar'.", "pausado");
    }
    atualizarPlacar();
}


function configurarControles() {
    document.addEventListener("keydown", function(evento) {
        
        const teclasDirecionais = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
        
        if (teclasDirecionais.includes(evento.key)) {
            evento.preventDefault(); 
        }

        if (jogoAtivo && (evento.key === "p" || evento.key === "P")) {
            alternarPausa();
            return; 
        }
        
        if (!jogoAtivo || jogoPausado) return; 

        let novaDirecao = null;

        switch(evento.key) {
            case "ArrowUp":
                novaDirecao = "cima";
                break;
            case "ArrowDown":
                novaDirecao = "baixo";
                break;
            case "ArrowLeft":
                novaDirecao = "esquerda";
                break;
            case "ArrowRight":
                novaDirecao = "direita";
                break;
        }

        if (novaDirecao) {
            if (podeMudarDirecao(novaDirecao)) {
                proximaDirecao = novaDirecao;
            }
        }
    });
}

function podeMudarDirecao(nova) {
    if (direcaoAtual === "cima" && nova === "baixo") return false;
    if (direcaoAtual === "baixo" && nova === "cima") return false;
    if (direcaoAtual === "esquerda" && nova === "direita") return false;
    if (direcaoAtual === "direita" && nova === "esquerda") return false;
    return true;
}


function comecarJogo() {
    if (jogoAtivo && !jogoPausado) return;
    
    if (dificuldadeAtual === "insano") {
        obstaculosAtivos = OBSTACULOS_INSANO;
    } else if (dificuldadeAtual === "dificil") {
        obstaculosAtivos = OBSTACULOS_DIFICIL;
    } else {
        obstaculosAtivos = [];
    }
    
    localStorage.setItem('snakeTempoSalvo', 0);

    cobra = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    
    direcaoAtual = "direita";
    proximaDirecao = "direita";
    pontuacao = 0;
    vidasRestantes = MAX_VIDAS; 
    jogoAtivo = true;
    jogoPausado = false; 
    
    velocidadeAtual = CONFIG_DIFICULDADE[dificuldadeAtual].velocidade; 
    
    elementoMenuPausa.style.display = "none"; 
    gerarComida();
    
    iniciarContadorTempo(); 
    
    atualizarPlacar();
    atualizarVidasDisplay();
    atualizarMensagem("O Combate Começou!", "jogando"); // Ajuste de texto aqui
    
    btnIniciar.disabled = true;
    btnReiniciar.disabled = true; 

    if (intervaloJogo) {
        clearInterval(intervaloJogo);
    }
    
    intervaloJogo = setInterval(gameLoop, velocidadeAtual);
}


function recalcularVelocidade() {
    let nivelAtual = Math.floor(pontuacao / PONTOS_POR_NIVEL);
    
    const velocidadeBase = CONFIG_DIFICULDADE[dificuldadeAtual].velocidade;

    let novaVelocidade = Math.max(
        VELOCIDADE_MINIMA, 
        velocidadeBase - (nivelAtual * DECREMENTO_VELOCIDADE)
    );

    if (novaVelocidade !== velocidadeAtual) {
        velocidadeAtual = novaVelocidade;
        
        if (!jogoPausado) {
            clearInterval(intervaloJogo);
            intervaloJogo = setInterval(gameLoop, velocidadeAtual);
        }
    }
}

function perderVida() {
    vidasRestantes--;
    pararContadorTempo();
    atualizarVidasDisplay();
    somPerderVida(); 

    if (vidasRestantes <= 0) {
        fimDeJogo();
        return;
    }

    jogoAtivo = false;
    clearInterval(intervaloJogo);
    // Ajuste a mensagem para o tema Cobra Kai aqui
    atualizarMensagem(`Você foi atingido! Vidas restantes: ${vidasRestantes}. Lembre-se: NO MERCY!`, "perdeu-vida");

    setTimeout(() => {
        cobra = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        direcaoAtual = "direita";
        proximaDirecao = "direita";
        velocidadeAtual = CONFIG_DIFICULDADE[dificuldadeAtual].velocidade;
        jogoAtivo = true;
        
        desenharJogo();
        atualizarMensagem("O Combate Recomeçou!", "jogando"); // Ajuste de texto aqui
        iniciarContadorTempo(); 
        intervaloJogo = setInterval(gameLoop, velocidadeAtual);
    }, 1500); 
}

function calcularNovaPosicao() {
    let cabeca = cobra[0];
    let nova = { x: cabeca.x, y: cabeca.y };

    switch(direcaoAtual) {
        case "cima":
            nova.y -= 1;
            break;
        case "baixo":
            nova.y += 1;
            break;
        case "esquerda":
            nova.x -= 1;
            break;
        case "direita":
            nova.x += 1;
            break;
    }

    return nova;
}


function estaDentroDoLimite(x, y) {
    return x >= 0 && x < TAMANHO_TABULEIRO && y >= 0 && y < TAMANHO_TABULEIRO;
}

function verificarColisaoCorpo(posicao) {
    for (let i = 1; i < cobra.length; i++) { 
        if (cobra[i].x === posicao.x && cobra[i].y === posicao.y) {
            return true;
        }
    }
    return false;
}

function verificarColisaoObstaculo(posicao) {
    if (obstaculosAtivos.length === 0) return false;

    return obstaculosAtivos.some(obstaculo => 
        obstaculo[0] === posicao.x && obstaculo[1] === posicao.y
    );
}


function escolherTipoComida() {
    let totalPeso = TIPOS_COMIDA.reduce((soma, tipo) => soma + tipo.peso, 0);
    let random = Math.random() * totalPeso;
    
    let pesoAcumulado = 0;
    for (let i = 0; i < TIPOS_COMIDA.length; i++) {
        pesoAcumulado += TIPOS_COMIDA[i].peso;
        if (random <= pesoAcumulado) {
            return TIPOS_COMIDA[i];
        }
    }
    return TIPOS_COMIDA[0];
}


function gerarComida() {
    let posicaoValida = false;
    let tipoComida = escolherTipoComida(); 

    while (!posicaoValida) {
        comida = {
            x: Math.floor(Math.random() * TAMANHO_TABULEIRO),
            y: Math.floor(Math.random() * TAMANHO_TABULEIRO),
            valor: tipoComida.valor,
            classe: tipoComida.classe
        };

        posicaoValida = true;

        for (let i = 0; i < cobra.length; i++) {
            if (cobra[i].x === comida.x && cobra[i].y === comida.y) {
                posicaoValida = false;
                break;
            }
        }
        
        if (posicaoValida && obstaculosAtivos.length > 0) {
            for (let i = 0; i < obstaculosAtivos.length; i++) {
                if (obstaculosAtivos[i][0] === comida.x && obstaculosAtivos[i][1] === comida.y) {
                    posicaoValida = false;
                    break;
                }
            }
        }
    }
}


function desenharJogo() {
    let elementosParaRemover = Array.from(tabuleiro.children).filter(el => el.id !== "menuPausa");
    elementosParaRemover.forEach(el => tabuleiro.removeChild(el));

    if (obstaculosAtivos.length > 0) {
        obstaculosAtivos.forEach(obstaculo => {
            let elementoObstaculo = document.createElement("div");
            elementoObstaculo.className = "obstaculo"; 
            elementoObstaculo.style.left = (obstaculo[0] * TAMANHO_CELULA) + "px";
            elementoObstaculo.style.top = (obstaculo[1] * TAMANHO_CELULA) + "px";
            tabuleiro.appendChild(elementoObstaculo);
        });
    }

    for (let i = 0; i < cobra.length; i++) {
        let segmento = document.createElement("div");
        segmento.className = i === 0 ? "segmento-cobra cabeca-cobra" : "segmento-cobra";
        segmento.style.left = (cobra[i].x * TAMANHO_CELULA) + "px";
        segmento.style.top = (cobra[i].y * TAMANHO_CELULA) + "px";
        tabuleiro.appendChild(segmento);
    }

    let elementoComida = document.createElement("div");
    elementoComida.className = "comida " + comida.classe; 
    elementoComida.style.left = (comida.x * TAMANHO_CELULA) + "px";
    elementoComida.style.top = (comida.y * TAMANHO_CELULA) + "px";
    tabuleiro.appendChild(elementoComida);
    
    tabuleiro.appendChild(elementoMenuPausa);
}


function fimDeJogo() {
    jogoAtivo = false;
    jogoPausado = false; 
    elementoMenuPausa.style.display = "none"; 
    clearInterval(intervaloJogo);
    pararContadorTempo(); 
    salvarMelhorPontuacao();
    atualizarVidasDisplay(); 
    
    const tempoFinal = formatarTempo(localStorage.getItem('snakeTempoSalvo') || 0);
    
    // Ajuste a mensagem para o tema Cobra Kai aqui
    atualizarMensagem(`Fim do Torneio! Você levou um chute na cara! Pontuação final: ${pontuacao}. Tempo de jogo: ${tempoFinal}. Clique em INICIAR/REINICIAR para um novo treino!`, "fim-jogo"); 
    
    btnIniciar.disabled = false;
    btnReiniciar.disabled = false; 
    somFimDeJogo(); 
    
    setTimeout(() => {
        selecionarDificuldade(dificuldadeAtual); 
    }, 3000); 
}

function gameLoop() {
    if (jogoPausado) return;

    direcaoAtual = proximaDirecao;
    let novaCabeca = calcularNovaPosicao();

    if (!estaDentroDoLimite(novaCabeca.x, novaCabeca.y)) {
        perderVida();
        return;
    }
    
    if (verificarColisaoObstaculo(novaCabeca)) {
        perderVida();
        return;
    }

    if (verificarColisaoCorpo(novaCabeca)) {
        perderVida();
        return;
    }

    cobra.unshift(novaCabeca); 

    if (novaCabeca.x === comida.x && novaCabeca.y === comida.y) {
        pontuacao += comida.valor;
        
        const tipoComidaComida = TIPOS_COMIDA.find(tipo => tipo.classe === comida.classe);
        if (tipoComidaComida && tipoComidaComida.som) {
            somComer(tipoComidaComida.som);
        }
        
        gerarComida();
        recalcularVelocidade();
    } else {
        cobra.pop(); 
    }

    desenharJogo();
}