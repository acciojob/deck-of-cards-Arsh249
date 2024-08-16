//your code here

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.whitebox2');
    const holders = document.querySelectorAll('.placed');
    const deck = document.getElementById('deck');
    const winMessage = document.getElementById('won');
    const resetButton = document.getElementById('reset');
    const shuffleButton = document.getElementById('shuffle');

    let gameState = JSON.parse(localStorage.getItem('gameState')) || [];

    // Load saved game state
    if (gameState.length > 0) {
        gameState.forEach(card => {
            const cardElement = document.getElementById(card.id);
            const holderElement = document.getElementById(card.holder);
            holderElement.appendChild(cardElement);
        });
        checkWin();
    }

    // Drag & Drop functionality
    cards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
    });

    holders.forEach(holder => {
        holder.addEventListener('dragover', dragOver);
        holder.addEventListener('drop', dropCard);
    });

    // Shuffle functionality
    shuffleButton.addEventListener('click', shuffleCards);

    // Reset functionality
    resetButton.addEventListener('click', resetGame);

    function dragStart(e) {
        e.dataTransfer.setData('text', e.target.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dropCard(e) {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text');
        const cardElement = document.getElementById(cardId);
        const holderId = e.target.id;

        if (validateDrop(cardElement, holderId)) {
            e.target.appendChild(cardElement);
            saveGameState(cardId, holderId);
            checkWin();
        }
    }

    function validateDrop(cardElement, holderId) {
        const cardSuit = cardElement.querySelector('img').src.match(/(\w+)\.jpg$/)[1].toLowerCase();
        const holderSuit = holderId.toLowerCase();
        return cardSuit.startsWith(holderSuit);
    }

    function saveGameState(cardId, holderId) {
        gameState = gameState.filter(card => card.id !== cardId);
        gameState.push({ id: cardId, holder: holderId });
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }

    function checkWin() {
        if (gameState.length === cards.length) {
            winMessage.style.display = 'block';
        }
    }

    function shuffleCards() {
        deck.innerHTML = '';
        const shuffledCards = [...cards].sort(() => 0.5 - Math.random());
        shuffledCards.forEach(card => deck.appendChild(card));
        winMessage.style.display = 'none';
        gameState = [];
        localStorage.removeItem('gameState');
    }

    function resetGame() {
        shuffleCards();
    }
});
