# 🐍 Cobra Kai — Snake Game

Um jogo da **Cobrinha (Snake)** desenvolvido com **HTML, CSS e JavaScript**, inspirado no universo de **Cobra Kai**. O projeto transforma o clássico Snake em um pequeno combate, com sistema de vidas, níveis de dificuldade, obstáculos, pontuação, recorde, tempo de jogo e efeitos sonoros.

## 🎮 Sobre o Projeto

O **Cobra Kai — Snake Game** foi desenvolvido para praticar conceitos de desenvolvimento web, manipulação do DOM, lógica de programação, eventos de teclado, armazenamento local e recursos de áudio do navegador.

A interface apresenta um tabuleiro de **20 × 20 células**, com uma cobra controlada pelo jogador. O objetivo é coletar as comidas, aumentar a pontuação e sobreviver o maior tempo possível.

O HTML organiza o placar, mensagens, tabuleiro, seleção de dificuldade e controles do jogo.

## 🔗 Link do Projeto

[👉 Acesse o projeto aqui](https://dcapulot.github.io/Snake-Kai/)

## 🥋 Funcionalidades

* 🐍 Jogo clássico da cobrinha com temática Cobra Kai
* ❤️ Sistema de **3 vidas**
* 🏆 Sistema de pontuação e recorde
* ⏱️ Contador de tempo de partida
* 💾 Salvamento do recorde utilizando `localStorage`
* 🎯 Três tipos diferentes de comida
* 🚧 Obstáculos nos níveis mais difíceis
* ⚡ Aumento progressivo da velocidade
* ⏸️ Sistema de pausa
* 🔄 Reinício da partida
* 🔊 Efeitos sonoros utilizando **Web Audio API**
* 🎮 Controle pelas setas do teclado
* ⌨️ Tecla `P` para pausar e continuar
* 📈 Quatro níveis de dificuldade

## 🎚️ Níveis de Dificuldade

O jogo possui quatro níveis:

| Nível      | Velocidade inicial |
| ---------- | -----------------: |
| 🟢 Fácil   |             200 ms |
| 🟡 Normal  |             150 ms |
| 🔴 Difícil |             100 ms |
| ☠️ Insano  |              70 ms |

A velocidade diminui conforme o jogador acumula pontos, podendo chegar até **50 ms**, tornando o combate progressivamente mais difícil.

## 🍎 Sistema de Comidas

Existem três tipos de comida:

| Comida      | Pontos | Probabilidade |
| ----------- | -----: | ------------: |
| ⚪ Normal    |     +1 |           70% |
| 🟠 Especial |     +5 |           25% |
| 🟢 Rara     |    +10 |            5% |

Cada tipo também possui seu próprio efeito sonoro.

A comida é gerada aleatoriamente no tabuleiro, evitando posições ocupadas pela cobra ou por obstáculos.

## ❤️ Sistema de Vidas

O jogador começa com **3 vidas**.

Uma vida é perdida quando a cabeça da cobra:

* Sai dos limites do tabuleiro;
* Colide com o próprio corpo;
* Colide com um obstáculo.

Quando ainda existem vidas disponíveis, a cobra é reposicionada e o combate continua. Quando todas as vidas acabam, ocorre o fim do jogo.

## 🚧 Obstáculos

Os obstáculos aparecem nos níveis **Difícil** e **Insano**.

O nível Difícil possui obstáculos posicionados principalmente nos cantos e no centro do mapa. O nível Insano adiciona obstáculos extras, criando um percurso ainda mais desafiador.

## 🎮 Controles

| Tecla           | Ação                |
| --------------- | ------------------- |
| ⬆️ `ArrowUp`    | Mover para cima     |
| ⬇️ `ArrowDown`  | Mover para baixo    |
| ⬅️ `ArrowLeft`  | Mover para esquerda |
| ➡️ `ArrowRight` | Mover para direita  |
| `P`             | Pausar/continuar    |

O jogo também possui os botões **INICIAR** e **REINICIAR**.

## 🔊 Sistema de Áudio

Os efeitos sonoros são produzidos diretamente pelo navegador utilizando a **Web Audio API**.

O projeto possui sons diferentes para:

* 🍎 Coleta de comida;
* ❤️ Perda de vida;
* ☠️ Fim de jogo;
* 🎵 Melodia de encerramento.

## 💾 Armazenamento Local

O projeto utiliza `localStorage` para armazenar:

* 🏆 Melhor pontuação;
* ⏱️ Tempo salvo da partida.

Isso permite que o recorde seja mantido mesmo após atualizar a página.

## 🎨 Interface

A interface foi personalizada com uma identidade visual inspirada em **Cobra Kai**, utilizando principalmente preto, amarelo e vermelho.

O plano de fundo utiliza a imagem `cobra2.webp`, enquanto o tabuleiro, mensagens, botões, cobra, comidas e obstáculos possuem estilos próprios definidos no CSS.

## 🛠️ Tecnologias Utilizadas

* **HTML5** — estrutura da aplicação
* **CSS3** — estilização e identidade visual
* **JavaScript** — lógica e funcionamento do jogo
* **DOM API** — criação e atualização dos elementos do tabuleiro
* **Web Audio API** — efeitos sonoros
* **LocalStorage** — armazenamento do recorde e tempo

## 📂 Estrutura do Projeto

```text
Cobra-Kai-Snake/
│
├── index.html
├── snake.css
├── snake.js
└── imagens/
    └── cobra2.webp
```

O `index.html` conecta o arquivo `snake.css` para os estilos e o `snake.js` para a lógica do jogo.

## 🚀 Como Executar

1. Clone ou baixe este repositório.
2. Mantenha os arquivos do projeto na estrutura correta.
3. Abra o arquivo `index.html` em um navegador.
4. Escolha o nível de dificuldade.
5. Clique em **INICIAR**.
6. Use as setas do teclado para controlar a cobra.
7. Colete as comidas e tente alcançar a maior pontuação possível.

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com o objetivo de colocar em prática conhecimentos de **HTML, CSS e JavaScript**, trabalhando principalmente com:

* Manipulação do DOM;
* Eventos de teclado;
* Funções e estruturas condicionais;
* Arrays e objetos;
* Temporizadores com `setInterval` e `setTimeout`;
* Lógica de colisão;
* Sistema de pontuação;
* Armazenamento no navegador;
* Reprodução de áudio;
* Criação dinâmica de elementos HTML.

## 📌 Melhorias Futuras

Algumas possibilidades para futuras versões:

* 📱 Adicionar controles para dispositivos móveis;
* 🎨 Criar novos temas;
* 🥋 Adicionar personagens e referências de Cobra Kai;
* 🏅 Criar ranking de jogadores;
* 🌐 Adicionar modo multiplayer;
* 🔥 Criar novos tipos de comida e poderes;
* 🎵 Adicionar trilha sonora;
* 🗺️ Criar novos mapas e arenas.

## 👨‍💻 Autor

**David**

Projeto desenvolvido como prática de desenvolvimento web, combinando programação, lógica de jogos e personalização visual.

---

⭐ **Se você gostou do projeto, deixe uma estrela no repositório!**

🥋 **NO MERCY!** 🐍
