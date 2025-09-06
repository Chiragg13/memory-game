// --- GET HTML ELEMENTS ---
const selectionScreen = document.querySelector('.selection-screen');
const gameContainer = document.querySelector('.game-container');
const gameBoard = document.querySelector('.memory-game');
const movesCounter = document.querySelector('.moves');
const resetButton = document.querySelector('.reset-button');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const winScreen = document.querySelector('.win-screen');
const finalMoves = document.querySelector('.final-moves');
const playAgainBtn = document.querySelector('.play-again-btn');
const fireworksContainer = document.querySelector('.fireworks-container');

// NEW: GET AUDIO ELEMENTS
const flipSound = document.getElementById('flip-sound');
const matchSound = document.getElementById('match-sound');
const winSound = document.getElementById('win-sound');

// --- DEFINE FULL CARD DATA (15 pairs total) ---
const cardData = [
    // === YOUR 15 IMAGE FILENAMES SHOULD BE HERE ===
    { name: 'img1', img: 'img/img1.jpg' },
    { name: 'img2', img: 'img/img2.jpg' },
    { name: 'img3', img: 'img/img3.jpg' },
    { name: 'img4', img: 'img/img4.jpg' },
    { name: 'img5', img: 'img/img5.jpg' },
    { name: 'img6', img: 'img/img6.jpg' },
    { name: 'img7', img: 'img/img7.jpg' },
    { name: 'img8', img: 'img/img8.jpg' },
    { name: 'img9', img: 'img/img9.jpg' },
    { name: 'img10', img: 'img/img10.jpg' },
    { name: 'img11', img: 'img/img11.jpg' },
    { name: 'img12', img: 'img/img12.jpg' },
    { name: 'img13', img: 'img/img13.jpg' },
    { name: 'img14', img: 'img/img14.jpg' },
    { name: 'img15', img: 'img/img15.jpg' },
];

// --- GAME STATE VARIABLES ---
let gameDeck = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let cards = [];
let currentTileCount = 0;
let matchedPairs = 0;
let fireworksInterval = null;

// --- GAME FUNCTIONS ---

// NEW: Helper function to play sounds
function playSound(sound) {
    sound.currentTime = 0; // Rewind to the start
    sound.play();
}

function startGame(tileCount) {
    currentTileCount = tileCount;
    matchedPairs = 0;
    
    // Stop any ongoing sounds from a previous game
    winSound.pause();
    winSound.currentTime = 0;
    if (fireworksInterval) clearInterval(fireworksInterval);
    fireworksContainer.innerHTML = '';

    winScreen.classList.remove('show');
    winScreen.classList.add('hidden');
    selectionScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    generateDeck();
    generateBoard();
}

function generateDeck() {
    const uniqueCardsCount = currentTileCount / 2;
    const selectedCards = cardData.slice(0, uniqueCardsCount);
    
    gameDeck = [...selectedCards, ...selectedCards];
    gameDeck.sort(() => 0.5 - Math.random());
}

function generateBoard() {
    gameBoard.innerHTML = '';
    moves = 0;
    movesCounter.textContent = `Moves: ${moves}`;
    
    if (currentTileCount === 10) {
        gameBoard.style.gridTemplateColumns = `repeat(5, 1fr)`;
    } else if (currentTileCount === 20) {
        gameBoard.style.gridTemplateColumns = `repeat(5, 1fr)`;
    } else { // 30 cards
        gameBoard.style.gridTemplateColumns = `repeat(6, 1fr)`;
    }

    gameDeck.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.name = item.name;

        const frontFaceHTML = `<img class="front-face" src="${item.img}" alt="${item.name}">`;
        const backFaceHTML = `<img class="back-face" src="img/img16.jpg" alt="Card Back">`;

        card.innerHTML = frontFaceHTML + backFaceHTML;
        gameBoard.appendChild(card);
    });

    cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => card.addEventListener('click', flipCard));
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    playSound(flipSound); // Play flip sound
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    incrementMoves();
    checkForMatch();
}

function incrementMoves() {
    moves++;
    movesCounter.textContent = `Moves: ${moves}`;
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    playSound(matchSound); // Play match sound
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    matchedPairs++;
    checkForWin();
    
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function checkForWin() {
    if (matchedPairs === currentTileCount / 2) {
        setTimeout(() => {
            finalMoves.textContent = moves;
            winScreen.classList.remove('hidden');
            winScreen.classList.add('show');
            winSound.play(); // Play win sound on loop
            fireworksInterval = setInterval(createFireworks, 800);
        }, 1000);
    }
}

function createFireworks() {
    fireworksContainer.innerHTML = '';
    const fireworksCount = 100;
    const colors = ['#ff00ff', '#00ffff', '#f7ff00'];

    for (let i = 0; i < fireworksCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 200 + 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        
        fireworksContainer.appendChild(particle);

        setTimeout(() => {
            particle.style.transform = `translate(${x}px, ${y}px) scale(0)`;
            particle.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            particle.remove();
        }, 1010);
    }
}

function resetGame() {
    playSound(flipSound); // Play sound on reset
    matchedPairs = 0;
    generateDeck();
    generateBoard();
}

function playAgain() {
    playSound(flipSound); // Play sound on click
    
    // Stop win sounds
    winSound.pause();
    winSound.currentTime = 0;
    if (fireworksInterval) clearInterval(fireworksInterval);
    fireworksContainer.innerHTML = '';

    winScreen.classList.remove('show');
    winScreen.classList.add('hidden');
    gameContainer.classList.add('hidden');
    selectionScreen.classList.remove('hidden');
}

// --- INITIALIZE ---
difficultyBtns.forEach(button => {
    button.addEventListener('click', () => {
        playSound(flipSound); // Play sound on click
        const tiles = parseInt(button.dataset.tiles);
        startGame(tiles);
    });
});

resetButton.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', playAgain);

