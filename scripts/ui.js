export class UI {
  constructor() {
    // DOM Elements
    this.scoreElement = document.getElementById('score');
    this.bestScoreElement = document.getElementById('best-score');
    this.levelElement = document.getElementById('level');
    this.minutesElement = document.getElementById('minutes');
    this.secondsElement = document.getElementById('seconds');
    this.gameBoard = document.getElementById('game-board');
    this.startButton = document.getElementById('start-button');
    this.resetButton = document.getElementById('reset-button');
    
    // Level Complete Modal
    this.levelCompleteModal = document.getElementById('level-complete');
    this.completedLevelElement = document.getElementById('completed-level');
    this.levelScoreElement = document.getElementById('level-score');
    
    // Game Over Modal
    this.gameOverModal = document.getElementById('game-over');
    this.finalScoreElement = document.getElementById('final-score');
    this.finalTimeElement = document.getElementById('final-time');
  }
  
  // Score Management
  updateScore(score) {
    this.scoreElement.textContent = score;
  }
  
  updateBestScore(bestScore) {
    this.bestScoreElement.textContent = bestScore;
  }
  
  animateScoreUpdate() {
    this.scoreElement.classList.add('score-update');
    setTimeout(() => {
      this.scoreElement.classList.remove('score-update');
    }, 500);
  }
  
  // Level Management
  updateLevel(level) {
    this.levelElement.textContent = level;
  }
  
  animateLevelUp() {
    this.levelElement.classList.add('level-up');
    setTimeout(() => {
      this.levelElement.classList.remove('level-up');
    }, 800);
  }
  
  // Timer Management
  updateTimer(minutes, seconds) {
    this.minutesElement.textContent = minutes.toString().padStart(2, '0');
    this.secondsElement.textContent = seconds.toString().padStart(2, '0');
    
    const timerElement = this.minutesElement.parentElement;
    
    // Reset classes
    timerElement.classList.remove('warning', 'critical');
    
    // Add warning class if less than 30 seconds
    if (minutes === 0 && seconds <= 30 && seconds > 10) {
      timerElement.classList.add('warning');
    }
    
    // Add critical class if less than 10 seconds
    if (minutes === 0 && seconds <= 10) {
      timerElement.classList.add('critical');
    }
  }
  
  // Game Board Management
  updateGridLayout(columns) {
    this.gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    
    // Apply different grid for mobile in landscape mode
    if (window.matchMedia("(max-height: 500px) and (orientation: landscape)").matches) {
      this.gameBoard.style.gridTemplateColumns = `repeat(6, 1fr)`;
    }
  }
  
  // Button Control
  toggleStartButton(gameRunning) {
    if (gameRunning) {
      this.startButton.disabled = true;
      this.startButton.classList.add('disabled');
    } else {
      this.startButton.disabled = false;
      this.startButton.classList.remove('disabled');
    }
  }
  
  // Modal Management
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
  }
  
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
  }
  
  updateLevelCompleteModal(level, score) {
    this.completedLevelElement.textContent = level;
    this.levelScoreElement.textContent = score;
  }
  
  updateGameOverModal(finalScore, finalTime) {
    this.finalScoreElement.textContent = finalScore;
    this.finalTimeElement.textContent = finalTime;
  }
  
  // Animations and Visual Feedback
  flashElement(element, className, duration = 500) {
    element.classList.add(className);
    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  }
  
  // Responsive Layout Adjustments
  handleResponsiveLayout() {
    // Update grid layout based on screen size and orientation
    const level = parseInt(this.levelElement.textContent);
    const levelConfig = new Level().getLevel(level);
    this.updateGridLayout(levelConfig.columns);
  }
}