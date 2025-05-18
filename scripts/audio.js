export class AudioManager {
  constructor() {
    this.sounds = {};
    this.isMuted = localStorage.getItem('memoryMatch_muted') === 'true';
    
    // Initialize sounds
    this.preloadSounds();
  }
  
  preloadSounds() {
    // Game sound effects using AudioContext for better performance
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Define sound effects to preload
    const soundsToLoad = {
      flip: 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3',
      match: 'https://assets.mixkit.co/sfx/preview/mixkit-bonus-earned-in-video-game-2058.mp3',
      mismatch: 'https://assets.mixkit.co/sfx/preview/mixkit-game-ball-tap-2073.mp3',
      start: 'https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3',
      reset: 'https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.mp3',
      levelComplete: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
      gameComplete: 'https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3',
      levelUp: 'https://assets.mixkit.co/sfx/preview/mixkit-fantasy-game-success-notification-270.mp3'
    };
    
    // Preload sounds
    for (const [name, url] of Object.entries(soundsToLoad)) {
      this.loadSound(name, url);
    }
  }
  
  async loadSound(name, url) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.audioContext.decodeAudioData(arrayBuffer, (buffer) => {
        this.sounds[name] = buffer;
      });
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`, error);
    }
  }
  
  playSound(name) {
    if (this.isMuted || !this.sounds[name]) return;
    
    // Create new source for each playback
    const source = this.audioContext.createBufferSource();
    source.buffer = this.sounds[name];
    
    // Connect to output
    source.connect(this.audioContext.destination);
    
    // Play the sound
    source.start(0);
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('memoryMatch_muted', this.isMuted);
    return this.isMuted;
  }
  
  setMute(state) {
    this.isMuted = state;
    localStorage.setItem('memoryMatch_muted', this.isMuted);
    return this.isMuted;
  }
}