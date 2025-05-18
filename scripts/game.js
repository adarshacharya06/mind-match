import { Level } from './levels.js';
import { CardManager } from './cards.js';
import { Timer } from './timer.js';

export class Game {
  constructor(ui, audioManager) {
    this.ui = ui;
    this.audioManager = audioManager;
    this.cardManager = new CardManager(this);
    this.timer = new Timer(this);
    this.level = new Level();
    
    this.score = 0;
    this.bestScore = localStorage.getItem('memoryMatch_bestScore') || 0;
    this.currentLevel = 1;
    this.isRunning = false;
    this.isPaused = false;
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.totalPairs = 0;
    this.canFlip = true;
  }
  
  initialize() {
    this.bestScore = parseInt(localStorage.getItem('memoryMatch_bestScore') || 0);
    this.ui.updateBestScore(this.bestScore);
    this.ui.updateLevel(this.currentLevel);
    this.setupLevel(this.currentLevel);
  }
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.isPaused = false;
    this.ui.hideModal('level-complete');
    this.ui.hideModal('game-over');
    this.timer.start();
    this.ui.toggleStartButton(true);
  }
  
  pause() {
    if (!this.isRunning || this.isPaused) return;
    
    this.isPaused = true;
    this.timer.pause();
  }
  
  resume() {
    if (!this.isRunning || !this.isPaused) return;
    
    this.isPaused = false;
    this.timer.resume();
  }
  
  reset() {
    this.isRunning = false;
    this.isPaused = false;
    this.score = 0;
    this.currentLevel = 1;
    this.flippedCards = [];
    this.matchedPairs = 0;
    
    this.timer.reset();
    this.ui.updateScore(this.score);
    this.ui.updateLevel(this.currentLevel);
    this.ui.toggleStartButton(false);
    this.ui.hideModal('level-complete');
    this.ui.hideModal('game-over');
    
    this.setupLevel(this.currentLevel);
  }
  
  setupLevel(levelNumber) {
    const levelConfig = this.level.getLevel(levelNumber);
    this.totalPairs = levelConfig.pairs;
    this.matchedPairs = 0;
    
    // Generate cards based on level configuration
    this.cardManager.createCards(levelConfig.pairs, levelConfig.symbols);
    
    // Update UI
    this.ui.updateLevel(levelNumber);
    this.ui.updateGridLayout(levelConfig.columns);
  }
  
  nextLevel() {
    this.currentLevel++;
    this.ui.hideModal('level-complete');
    
    if (this.currentLevel > this.level.maxLevel) {
      this.gameComplete();
      return;
    }
    
    this.matchedPairs = 0;
    this.flippedCards = [];
    this.setupLevel(this.currentLevel);
    this.start();
    this.ui.animateLevelUp();
  }
  
  flipCard(card) {
    if (!this.isRunning || this.isPaused || !this.canFlip || card.matched || this.flippedCards.includes(card)) {
      return;
    }
    
    // Flip the card
    this.audioManager.playSound('flip');
    card.flip();
    this.flippedCards.push(card);
    
    // Check for match if two cards are flipped
    if (this.flippedCards.length === 2) {
      this.canFlip = false;
      this.checkForMatch();
    }
  }
  
  checkForMatch() {
    const [firstCard, secondCard] = this.flippedCards;
    
    if (firstCard.symbol === secondCard.symbol) {
      // Match found
      this.handleMatch(firstCard, secondCard);
    } else {
      // No match
      this.handleMismatch(firstCard, secondCard);
    }
  }
  
  handleMatch(firstCard, secondCard) {
    // Mark cards as matched
    setTimeout(() => {
      firstCard.setMatched();
      secondCard.setMatched();
      this.audioManager.playSound('match');
      
      // Update score and matched pairs
      this.matchedPairs++;
      this.updateScore(10); // 10 points per match
      
      // Check if level is complete
      if (this.matchedPairs === this.totalPairs) {
        this.levelComplete();
      }
      
      // Reset flipped cards and allow new flips
      this.flippedCards = [];
      this.canFlip = true;
    }, 500);
  }
  
  handleMismatch(firstCard, secondCard) {
    // Animate mismatch
    setTimeout(() => {
      firstCard.setMismatch();
      secondCard.setMismatch();
      this.audioManager.playSound('mismatch');
      
      // Flip cards back
      setTimeout(() => {
        firstCard.flipBack();
        secondCard.flipBack();
        
        // Reset flipped cards and allow new flips
        this.flippedCards = [];
        this.canFlip = true;
      }, 1000);
    }, 500);
  }
  
  updateScore(points) {
    this.score += points;
    this.ui.updateScore(this.score);
    this.ui.animateScoreUpdate();
    
    // Update best score if current score is higher
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('memoryMatch_bestScore', this.bestScore);
      this.ui.updateBestScore(this.bestScore);
    }
  }
  
  levelComplete() {
    // Add bonus points based on time remaining
    const timeBonus = this.timer.getRemainingSeconds() * 2;
    this.updateScore(timeBonus);
    
    setTimeout(() => {
      this.isRunning = false;
      this.timer.pause();
      
      // Show level complete modal
      this.ui.updateLevelCompleteModal(this.currentLevel, this.score);
      this.ui.showModal('level-complete');
      this.audioManager.playSound('levelComplete');
    }, 1000);
  }
  
  gameComplete() {
    this.isRunning = false;
    this.timer.pause();
    
    // Add bonus for completing all levels
    this.updateScore(100); // Bonus for completing the game
    
    // Show game over modal
    this.ui.updateGameOverModal(this.score, this.timer.getFormattedTime());
    this.ui.showModal('game-over');
    this.audioManager.playSound('gameComplete');
  }
}