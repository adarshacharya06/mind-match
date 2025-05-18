import { Game } from './game.js';
import { UI } from './ui.js';
import { AudioManager } from './audio.js';

// Initialize game components
const ui = new UI();
const audioManager = new AudioManager();
const game = new Game(ui, audioManager);

// DOM Elements
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const nextLevelButton = document.getElementById('next-level');
const playAgainButton = document.getElementById('play-again');
const soundToggle = document.getElementById('sound-toggle');

// Set initial sound button state
if (localStorage.getItem('memoryMatch_muted') === 'true') {
  soundToggle.classList.add('muted');
} else {
  soundToggle.classList.remove('muted');
}

// Event Listeners
startButton.addEventListener('click', () => {
  game.start();
  audioManager.playSound('start');
});

resetButton.addEventListener('click', () => {
  game.reset();
  audioManager.playSound('reset');
});

nextLevelButton.addEventListener('click', () => {
  game.nextLevel();
  audioManager.playSound('levelUp');
});

playAgainButton.addEventListener('click', () => {
  game.reset();
  game.start();
  audioManager.playSound('start');
});

soundToggle.addEventListener('click', () => {
  const isMuted = audioManager.toggleMute();
  if (isMuted) {
    soundToggle.classList.add('muted');
  } else {
    soundToggle.classList.remove('muted');
    audioManager.playSound('flip'); // Play a sound to indicate sound is on
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Space to start/restart
  if (e.code === 'Space' && !game.isRunning) {
    e.preventDefault(); // Prevent page scrolling
    game.start();
    audioManager.playSound('start');
  }
  // R to reset
  if (e.code === 'KeyR' && game.isRunning) {
    game.reset();
    audioManager.playSound('reset');
  }
  // M to toggle mute
  if (e.code === 'KeyM') {
    const isMuted = audioManager.toggleMute();
    soundToggle.classList.toggle('muted', isMuted);
    if (!isMuted) {
      audioManager.playSound('flip');
    }
  }
});

// Handle visibility change to pause timer when tab is not active
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.isRunning) {
    game.pause();
  } else if (!document.hidden && game.isPaused) {
    game.resume();
  }
});

// Handle window resize for responsive layout
window.addEventListener('resize', () => {
  ui.handleResponsiveLayout();
});

// Prevent context menu on game board to improve mobile experience
document.getElementById('game-board').addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

// Initialize the game
game.initialize();