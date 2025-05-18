export class Level {
  constructor() {
    this.levels = [
      // Level 1: Easy start - 6 pairs (12 cards)
      {
        level: 1,
        pairs: 6,
        columns: 4,
        timeLimit: 60, // seconds
        symbols: 'emojis'
      },
      // Level 2: Medium - 8 pairs (16 cards)
      {
        level: 2,
        pairs: 8,
        columns: 4,
        timeLimit: 75,
        symbols: 'emojis'
      },
      // Level 3: Harder - 10 pairs (20 cards)
      {
        level: 3,
        pairs: 10,
        columns: 5,
        timeLimit: 90,
        symbols: 'shapes'
      },
      // Level 4: Challenging - 12 pairs (24 cards)
      {
        level: 4,
        pairs: 12,
        columns: 6,
        timeLimit: 105,
        symbols: 'shapes'
      },
      // Level 5: Expert - 15 pairs (30 cards)
      {
        level: 5,
        pairs: 15,
        columns: 6,
        timeLimit: 120,
        symbols: 'icons'
      }
    ];
    
    this.maxLevel = this.levels.length;
  }
  
  getLevel(levelNumber) {
    // Ensure level number is valid
    if (levelNumber < 1) levelNumber = 1;
    if (levelNumber > this.maxLevel) levelNumber = this.maxLevel;
    
    // Return level configuration
    return this.levels[levelNumber - 1];
  }
  
  getTimeLimit(levelNumber) {
    return this.getLevel(levelNumber).timeLimit;
  }
  
  getMaxLevel() {
    return this.maxLevel;
  }
}