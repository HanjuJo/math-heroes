import { SoundEffects } from '../types';

class AudioManager {
  private sounds: Partial<SoundEffects> = {};
  private isMuted: boolean = false;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    if (typeof window !== 'undefined') {
      this.sounds = {
        attack: '/sounds/attack.mp3',
        damage: '/sounds/damage.mp3',
        heal: '/sounds/heal.mp3',
        levelUp: '/sounds/level-up.mp3',
        victory: '/sounds/victory.mp3',
        defeat: '/sounds/defeat.mp3',
        purchase: '/sounds/purchase.mp3',
        bossAppear: '/sounds/boss-appear.mp3',
      };
    }
  }

  play(soundName: keyof SoundEffects) {
    if (this.isMuted || typeof window === 'undefined') return;
    
    const soundPath = this.sounds[soundName];
    if (soundPath) {
      const audio = new Audio(soundPath);
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.warn(`Failed to play sound: ${soundName}`, error);
      });
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
  }
}

export const audioManager = new AudioManager(); 