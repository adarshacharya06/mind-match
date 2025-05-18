export class Timer {
  constructor(game) {
    this.game = game;
    this.minutes = 0;
    this.seconds = 0;
    this.isRunning = false;
    this.interval = null;
    this.timeLimit = 60; // Default time limit
  }
  
  start() {
    if (this.isRunning) return;
    
    // Get time limit for current level
    this.timeLimit = this.game.level.getTimeLimit(this.game.currentLevel);
    
    // Reset timer
    this.reset();
    
    // Calculate target end time
    const startTime = Date.now();
    this.endTime = startTime + (this.timeLimit * 1000);
    
    // Start timer interval
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
  }
  
  tick() {
    if (!this.isRunning) return;
    
    const currentTime = Date.now();
    const remainingTime = Math.max(0, this.endTime - currentTime);
    
    // Calculate minutes and seconds
    this.minutes = Math.floor(remainingTime / 60000);
    this.seconds = Math.floor((remainingTime % 60000) / 1000);
    
    // Update UI
    this.game.ui.updateTimer(this.minutes, this.seconds);
    
    // Check if time is up
    if (remainingTime <= 0) {
      this.timeUp();
    }
  }
  
  timeUp() {
    this.stop();
    this.game.gameComplete(); // End the game when time is up
  }
  
  pause() {
    if (!this.isRunning) return;
    
    clearInterval(this.interval);
    this.timeRemaining = this.endTime - Date.now();
    this.isRunning = false;
  }
  
  resume() {
    if (this.isRunning) return;
    
    this.endTime = Date.now() + this.timeRemaining;
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.tick();
    }, 1000);
  }
  
  stop() {
    clearInterval(this.interval);
    this.isRunning = false;
  }
  
  reset() {
    this.stop();
    this.minutes = 0;
    this.seconds = 0;
    this.game.ui.updateTimer(this.minutes, this.seconds);
  }
  
  getFormattedTime() {
    return `${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
  }
  
  getRemainingSeconds() {
    return this.minutes * 60 + this.seconds;
  }
}