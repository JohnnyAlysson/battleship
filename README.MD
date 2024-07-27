## README

# Simple Multiplayer Battleship Game (IN PROGRESS)

A simple, turn-based multiplayer Battleship game built using HTML, CSS, and JavaScript. This game supports 2 players and includes a 30-second time limit for each turn. The user interface is designed to be clean and intuitive and ease of use. The game features a scoreboard and a simple winning animation.

### Features
- **Two Players:** Supports 2 players in a turn-based format.
- **Turn Timer:** Each player has a maximum of 30 seconds per turn.
- **Clean UI:** Designed with a focus on usability and simplicity.
- **Real-Time Play:** Utilizes WebSockets for real-time interaction.
- **Game State Syncing:** Ensures both players see the same updates in real-time.
- **Winning Animation:** Celebrates the winner with a simple animation.
- **Scoreboard:** Tracks the number of wins for each player.

### Installation

1. **Install Node.js** if not already installed.
2. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/battleship-game.git
    ```
3. **Navigate to the project directory:**
    ```sh
    cd battleship-game
    ```
4. **Install dependencies:**
    ```sh
    npm install
    ```
5. **Start the server:**
    ```sh
    npm start
    ```
6. **Open your browser** and navigate to `http://localhost:3000`.

### Directory Structure

```
/battleship-game
│
├── node_modules
├── .gitignore
├── .gitpod.yml
├── battleship.html
├── package-lock.json
├── package.json
├── README.md
└── server.js

```

### Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express
- Socket.IO

### Issues to be solved

1. No player is winning: The winning condition should be achieved when one of the players destroys all the ship of the other player, but the checking winning condition function has a bug.
2. No visual clue of a hit: When the player hits the piece of a ship, there should be a visual clue that was either a ship or water, Ship hit should be in red.
3. The score system is not working properly, being updated correctly only for first player.
4. countdown is not working.
5. Still need to deploy on a server and maybe create a lobby system

---

# Jogo de Batalha Naval Multijogador Simples

Um jogo simples de Batalha Naval multijogador baseado em turnos, desenvolvido com HTML, CSS e JavaScript. Este jogo suporta 2 jogadores e inclui um limite de tempo de 30 segundos para cada turno. A interface do usuário é projetada para ser limpa e intuitiva, tentando seguir as melhores práticas de UX/UI para garantir facilidade de uso. O jogo possui um placar e uma animação simples de vitória.

### Funcionalidades
- **Dois Jogadores:** Suporta 2 jogadores em um formato baseado em turnos.
- **Temporizador de Turno:** Cada jogador tem um máximo de 30 segundos por turno.
- **UI Limpa:** Projetado com foco na usabilidade e simplicidade.
- **Jogo em Tempo Real:** Utiliza WebSockets para interação em tempo real.
- **Sincronização do Estado do Jogo:** Garante que ambos os jogadores vejam as mesmas atualizações em tempo real.
- **Animação de Vitória:** Celebra o vencedor com uma animação simples.
- **Placar:** Rastreia o número de vitórias para cada jogador.


### Instalação

1. **Instale o Node.js** se ainda não estiver instalado.
2. **Clone o repositório:**
    ```sh
    git clone https://github.com/seunomeusuario/battleship-game.git
    ```
3. **Navegue até o diretório do projeto:**
    ```sh
    cd battleship-game
    ```
4. **Instale as dependências:**
    ```sh
    npm install
    ```
5. **Inicie o servidor:**
    ```sh
    npm start
    ```
6. **Abra seu navegador** e navegue até `http://localhost:3000`.

### Estrutura do Diretório

```
/battleship-game
│
├── node_modules
├── .gitignore
├── .gitpod.yml
├── battleship.html
├── package-lock.json
├── package.json
├── README.md
└── server.js

```

### Tecnologias Utilizadas
- HTML
- CSS
- JavaScript
- Node.js
- Express
- Socket.IO

### Problemas a serem solucionados

1. Nenhum jogador ganha: A condição de vitória deveria acontecer quando um dos jogadores destruir todos os navios do oponente, porem a função check Winning Condition contem um bug.
2. Sem feedback visual de acerto. Quando um jogador acerta uma parte do navio, deveria haver uma dica visual, mostrando se é um navio, ou água, ao acertar um navio deveria ser apresentado a coloração vermelha
3. Sistema de escore não funciona: Ele só e atualizado no primeiro jogador.
4. Contador regressivo: Não inicia a contagem, após alguns testes eu consegui fazer ele funcionar, porem ao contar o tempo havia um delay considerável e ocasionou em um bug pior nas jogadas
5. Ainda não fiz o deploy em servidor e pretender criar um sistema de lobbies