class AudioManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private bgm: HTMLAudioElement | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.sounds = {
        click: new Audio('/sounds/click.mp3'),
        correct: new Audio('/sounds/correct.mp3'),
        incorrect: new Audio('/sounds/incorrect.mp3'),
        coin: new Audio('/sounds/coin.mp3'),
        jump: new Audio('/sounds/jump.mp3'),
        powerup: new Audio('/sounds/powerup.mp3')
      };
      
      this.bgm = new Audio('/sounds/background_music.mp3');
      if (this.bgm) {
        this.bgm.loop = true;
        this.bgm.volume = 0.3;
      }
    }
  }

  playSound(name: string) {
    if (this.isMuted || typeof window === 'undefined') return;
    
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }

  playBGM() {
    if (this.isMuted || typeof window === 'undefined') return;
    this.bgm?.play().catch(() => {});
  }

  stopBGM() {
    if (typeof window === 'undefined') return;
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.playBGM();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (this.isMuted) {
      this.stopBGM();
    }
  }
}

export const audioManager = typeof window !== 'undefined' ? new AudioManager() : null; 