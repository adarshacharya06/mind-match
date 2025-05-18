export class CardManager {
  constructor(game) {
    this.game = game;
    this.cards = [];
    this.gameBoard = document.getElementById('game-board');
  }
  
  createCards(pairsCount, symbols) {
    // Clear existing cards
    this.gameBoard.innerHTML = '';
    this.cards = [];
    
    // Create cards for each pair
    const cardSymbols = this.getCardSymbols(pairsCount, symbols);
    
    // Create and add cards to the game board
    cardSymbols.forEach((symbol, index) => {
      const card = new Card(index, symbol, this.game);
      this.cards.push(card);
      this.gameBoard.appendChild(card.element);
    });
  }
  
  getCardSymbols(pairsCount, symbolSet) {
    let symbols;
    
    // Use provided symbol set or default to emojis
    if (symbolSet === 'emojis') {
      symbols = ['🍎', '🍌', '🍒', '🍊', '🍇', '🍓', '🍉', '🍍', '🥝', '🥥', 
                '🦄', '🐶', '🐱', '🐼', '🦊', '🦁', '🐯', '🐨', '🐮', '🐷',
                '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'];
    } else if (symbolSet === 'shapes') {
      symbols = ['●', '■', '▲', '◆', '★', '♥', '♦', '♣', '♠', '🔶', 
                '🔷', '🔸', '🔹', '🔻', '▶', '◀', '⬆', '⬇', '◼', '◻'];
    } else {
      // Default to icons
      symbols = ['♥', '♦', '♣', '♠', '★', '✿', '❄', '☀', '☁', '☂',
                '☺', '✓', '✕', '✌', '✨', '✈', '✏', '✉', '🎵', '🎮'];
    }
    
    // Select random symbols for the level
    const selectedSymbols = this.shuffleArray([...symbols]).slice(0, pairsCount);
    
    // Create pairs and shuffle
    const pairs = [...selectedSymbols, ...selectedSymbols];
    return this.shuffleArray(pairs);
  }
  
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

class Card {
  constructor(id, symbol, game) {
    this.id = id;
    this.symbol = symbol;
    this.game = game;
    this.isFlipped = false;
    this.matched = false;
    
    this.element = this.createCardElement();
  }
  
  createCardElement() {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = this.id;
    
    const front = document.createElement('div');
    front.className = 'card-face card-front';
    front.innerHTML = '?';
    
    const back = document.createElement('div');
    back.className = 'card-face card-back';
    back.innerHTML = this.symbol;
    
    card.appendChild(front);
    card.appendChild(back);
    
    card.addEventListener('click', () => {
      this.game.flipCard(this);
    });
    
    return card;
  }
  
  flip() {
    if (this.isFlipped) return;
    
    this.isFlipped = true;
    this.element.classList.add('flipped');
  }
  
  flipBack() {
    if (!this.isFlipped || this.matched) return;
    
    this.isFlipped = false;
    this.element.classList.remove('flipped');
    this.element.classList.remove('mismatch');
  }
  
  setMatched() {
    this.matched = true;
    this.element.classList.add('matched');
    const backFace = this.element.querySelector('.card-back');
    backFace.classList.add('matched');
  }
  
  setMismatch() {
    this.element.classList.add('mismatch');
  }
}