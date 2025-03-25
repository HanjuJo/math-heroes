export interface Character {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  exp: number;
  nextLevelExp: number;
  gold: number;
  equipment: Equipment[];
}

export interface SaveData {
  character: Character;
  lastSaved: number;
  slot: number;
}

export interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  problem: MathProblem;
  goldReward: number;
  isBoss?: boolean;
  specialAbility?: {
    name: string;
    description: string;
    effect: 'doubleAttack' | 'heal' | 'shield';
  };
}

export interface MathProblem {
  question: string;
  answer: number;
  options: number[];
}

export interface Equipment {
  name: string;
  type: 'weapon' | 'armor';
  attack?: number;
  defense?: number;
  level: number;
  price: number;
  description: string;
}

export interface SoundEffects {
  attack: string;
  damage: string;
  heal: string;
  levelUp: string;
  victory: string;
  defeat: string;
  purchase: string;
  bossAppear: string;
}

export interface AnimationEffects {
  attack: string;
  damage: string;
  heal: string;
  levelUp: string;
  shield: string;
} 