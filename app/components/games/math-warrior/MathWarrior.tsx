'use client';

import React, { useState, useEffect } from 'react';
import styles from './MathWarrior.module.css';
import Shop from './Shop';
import { Character, Monster, MathProblem, Equipment, SaveData } from './types';
import { audioManager } from './utils/audioManager';

export default function MathWarrior({ grade }: { grade: number }) {
  const [character, setCharacter] = useState<Character>({
    name: '용사',
    level: 1,
    hp: 100,
    maxHp: 100,
    attack: 10,
    defense: 5,
    exp: 0,
    nextLevelExp: 100,
    gold: 0,
    equipment: []
  });

  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'ready' | 'battle' | 'shop'>('ready');
  const [isMuted, setIsMuted] = useState(false);
  const [characterAnimation, setCharacterAnimation] = useState<string>('');
  const [monsterAnimation, setMonsterAnimation] = useState<string>('');

  const playAnimation = (target: 'character' | 'monster', type: string) => {
    if (target === 'character') {
      setCharacterAnimation(type);
      setTimeout(() => setCharacterAnimation(''), 500);
    } else {
      setMonsterAnimation(type);
      setTimeout(() => setMonsterAnimation(''), 500);
    }
  };

  const generateProblem = (level: number): MathProblem => {
    let num1, num2, answer;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * (level > 2 ? 3 : 2))];

    switch(operation) {
      case '+':
        num1 = Math.floor(Math.random() * (level * 10));
        num2 = Math.floor(Math.random() * (level * 10));
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * (level * 10));
        num2 = Math.floor(Math.random() * num1);
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * (level * 2));
        num2 = Math.floor(Math.random() * (level * 2));
        answer = num1 * num2;
        break;
      default:
        num1 = Math.floor(Math.random() * (level * 10));
        num2 = Math.floor(Math.random() * (level * 10));
        answer = num1 + num2;
    }

    const options = [
      answer,
      answer + Math.floor(Math.random() * 5) + 1,
      answer - Math.floor(Math.random() * 5) - 1,
      answer + Math.floor(Math.random() * 10) - 5
    ].sort(() => Math.random() - 0.5);

    return {
      question: `${num1} ${operation} ${num2} = ?`,
      answer,
      options
    };
  };

  const generateMonster = () => {
    const monsterTypes = [
      { name: '슬라임', level: 1 },
      { name: '고블린', level: 2 },
      { name: '오크', level: 3 },
      { name: '드래곤', level: 4, isBoss: true }
    ];
    const monsterLevel = Math.min(Math.floor(character.level / 2) + 1, monsterTypes.length);
    const monsterType = monsterTypes[monsterLevel - 1];
    const isBoss = monsterType.isBoss || false;

    let specialAbility;
    if (isBoss) {
      const abilities = [
        {
          name: '분노',
          description: '두 배의 데미지를 입힙니다',
          effect: 'doubleAttack' as const
        },
        {
          name: '재생',
          description: 'HP를 회복합니다',
          effect: 'heal' as const
        },
        {
          name: '보호막',
          description: '받는 데미지를 감소시킵니다',
          effect: 'shield' as const
        }
      ];
      specialAbility = abilities[Math.floor(Math.random() * abilities.length)];
    }

    return {
      name: monsterType.name,
      hp: isBoss ? 100 * monsterLevel : 50 * monsterLevel,
      maxHp: isBoss ? 100 * monsterLevel : 50 * monsterLevel,
      attack: isBoss ? 10 * monsterLevel : 5 * monsterLevel,
      problem: generateProblem(monsterLevel),
      goldReward: isBoss ? 100 * monsterLevel : 50 * monsterLevel,
      isBoss,
      specialAbility
    };
  };

  const calculateTotalStats = () => {
    const equipmentStats = character.equipment.reduce(
      (total, item) => ({
        attack: total.attack + (item.attack || 0),
        defense: total.defense + (item.defense || 0)
      }),
      { attack: 0, defense: 0 }
    );

    return {
      attack: character.attack + equipmentStats.attack,
      defense: character.defense + equipmentStats.defense
    };
  };

  const startBattle = () => {
    const monster = generateMonster();
    if (monster.isBoss) {
      audioManager.play('bossAppear');
    }
    setCurrentMonster(monster);
    setGameState('battle');
    setBattleLog(['전투가 시작되었습니다!']);
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!currentMonster) return;

    if (selectedAnswer === currentMonster.problem.answer) {
      // 정답 - 몬스터에게 데미지
      audioManager.play('attack');
      playAnimation('monster', 'damage');
      
      const totalStats = calculateTotalStats();
      let damage = totalStats.attack;
      
      if (currentMonster.isBoss && currentMonster.specialAbility?.effect === 'shield') {
        damage = Math.floor(damage * 0.7);
        playAnimation('monster', 'shield');
        setBattleLog(prev => [...prev, `${currentMonster.name}의 보호막이 데미지를 감소시켰습니다!`]);
      }

      const newMonsterHp = Math.max(0, currentMonster.hp - damage);
      setBattleLog(prev => [...prev, `정답! 몬스터에게 ${damage}의 데미지를 입혔습니다.`]);

      if (newMonsterHp <= 0) {
        // 몬스터 처치
        audioManager.play('victory');
        const expGain = currentMonster.maxHp;
        const goldGain = currentMonster.goldReward;
        const newExp = character.exp + expGain;
        setBattleLog(prev => [
          ...prev,
          `${currentMonster.name}을(를) 물리쳤습니다!`,
          `경험치 ${expGain}를 획득했습니다!`,
          `${goldGain} 골드를 획득했습니다!`
        ]);

        if (currentMonster.isBoss) {
          setBattleLog(prev => [...prev, '🎊 보스를 물리쳤습니다! 특별한 보상을 획득했습니다! 🎊']);
        }

        if (newExp >= character.nextLevelExp) {
          // 레벨업
          audioManager.play('levelUp');
          playAnimation('character', 'levelUp');
          const newLevel = character.level + 1;
          setCharacter(prev => ({
            ...prev,
            level: newLevel,
            maxHp: prev.maxHp + 20,
            hp: prev.maxHp + 20,
            attack: prev.attack + 5,
            defense: prev.defense + 3,
            exp: newExp - prev.nextLevelExp,
            nextLevelExp: prev.nextLevelExp * 1.5,
            gold: prev.gold + goldGain
          }));
          setBattleLog(prev => [...prev, `레벨 업! ${newLevel}레벨이 되었습니다!`]);
        } else {
          setCharacter(prev => ({
            ...prev,
            exp: newExp,
            gold: prev.gold + goldGain
          }));
        }
        setGameState('ready');
        setCurrentMonster(null);
      } else {
        setCurrentMonster({
          ...currentMonster,
          hp: newMonsterHp,
          problem: generateProblem(Math.floor(character.level / 2) + 1)
        });
      }
    } else {
      // 오답 - 플레이어가 데미지
      audioManager.play('damage');
      playAnimation('character', 'damage');
      
      const totalStats = calculateTotalStats();
      let damage = Math.max(1, currentMonster.attack - totalStats.defense);
      
      if (currentMonster.isBoss && currentMonster.specialAbility) {
        switch (currentMonster.specialAbility.effect) {
          case 'doubleAttack':
            damage *= 2;
            setBattleLog(prev => [...prev, `${currentMonster.name}의 분노로 인해 데미지가 두 배가 되었습니다!`]);
            break;
          case 'heal':
            const healAmount = Math.floor(currentMonster.maxHp * 0.1);
            audioManager.play('heal');
            playAnimation('monster', 'heal');
            setCurrentMonster(prev => ({
              ...prev!,
              hp: Math.min(prev!.maxHp, prev!.hp + healAmount)
            }));
            setBattleLog(prev => [...prev, `${currentMonster.name}이(가) ${healAmount}만큼 체력을 회복했습니다!`]);
            break;
        }
      }

      const newHp = Math.max(0, character.hp - damage);
      setBattleLog(prev => [...prev, `오답! ${currentMonster.name}에게 ${damage}의 데미지를 받았습니다.`]);

      if (newHp <= 0) {
        audioManager.play('defeat');
        setBattleLog(prev => [...prev, '게임 오버!']);
        setGameState('ready');
        setCurrentMonster(null);
        setCharacter(prev => ({
          ...prev,
          hp: prev.maxHp
        }));
      } else {
        setCharacter(prev => ({
          ...prev,
          hp: newHp
        }));
      }
    }
  };

  const handleBuyEquipment = (equipment: Equipment) => {
    if (character.gold >= equipment.price) {
      audioManager.play('purchase');
      setCharacter(prev => ({
        ...prev,
        gold: prev.gold - equipment.price,
        equipment: [...prev.equipment, equipment]
      }));
      setBattleLog(prev => [...prev, `${equipment.name}을(를) 구매했습니다!`]);
    }
  };

  const saveGame = (slot: number) => {
    const saveData: SaveData = {
      character,
      lastSaved: Date.now(),
      slot
    };
    localStorage.setItem(`mathWarrior_save_${slot}`, JSON.stringify(saveData));
    setBattleLog(prev => [...prev, `게임이 저장되었습니다! (슬롯 ${slot})`]);
  };

  const loadGame = (slot: number) => {
    const savedData = localStorage.getItem(`mathWarrior_save_${slot}`);
    if (savedData) {
      const saveData: SaveData = JSON.parse(savedData);
      setCharacter(saveData.character);
      setBattleLog([`게임을 불러왔습니다! (슬롯 ${slot})`]);
      return true;
    }
    return false;
  };

  const toggleMute = () => {
    const newMuted = audioManager.toggleMute();
    setIsMuted(newMuted);
  };

  const totalStats = calculateTotalStats();

  return (
    <div className={styles.container}>
      <button onClick={toggleMute} className={styles.muteButton}>
        {isMuted ? '🔇' : '🔊'}
      </button>
      
      {/* 캐릭터 상태 */}
      <div className={styles.status}>
        <div className={`${styles.characterInfo} ${characterAnimation ? styles[characterAnimation] : ''}`}>
          <h3>레벨 {character.level} {character.name}</h3>
          <div className={styles.hpBar}>
            <div 
              className={styles.hpFill} 
              style={{width: `${(character.hp / character.maxHp) * 100}%`}}
            />
            <span>HP: {character.hp}/{character.maxHp}</span>
          </div>
          <div className={styles.expBar}>
            <div 
              className={styles.expFill} 
              style={{width: `${(character.exp / character.nextLevelExp) * 100}%`}}
            />
            <span>EXP: {character.exp}/{character.nextLevelExp}</span>
          </div>
          <div>기본 공격력: {character.attack} (총 공격력: {totalStats.attack})</div>
          <div>기본 방어력: {character.defense} (총 방어력: {totalStats.defense})</div>
          <div>골드: {character.gold}</div>
        </div>

        {/* 장비 목록 */}
        {character.equipment.length > 0 && (
          <div className={styles.equipment}>
            <h4>장착 중인 장비</h4>
            <div className={styles.equipmentList}>
              {character.equipment.map((item, index) => (
                <div key={index} className={styles.equipmentItem}>
                  <span>{item.name}</span>
                  {item.attack && <span>공격력 +{item.attack}</span>}
                  {item.defense && <span>방어력 +{item.defense}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'ready' && (
          <div className={styles.actions}>
            <button onClick={startBattle} className={styles.startButton}>
              전투 시작
            </button>
            <button
              onClick={() => setGameState('shop')}
              className={styles.shopButton}
            >
              상점 방문
            </button>
            <div className={styles.saveLoadButtons}>
              <button onClick={() => saveGame(1)} className={styles.saveButton}>
                저장 (슬롯 1)
              </button>
              <button onClick={() => loadGame(1)} className={styles.loadButton}>
                불러오기 (슬롯 1)
              </button>
            </div>
          </div>
        )}

        {currentMonster && (
          <div className={`${styles.monsterInfo} ${monsterAnimation ? styles[monsterAnimation] : ''}`}>
            <h3>{currentMonster.name} {currentMonster.isBoss && '👑'}</h3>
            <div className={styles.hpBar}>
              <div 
                className={styles.hpFill} 
                style={{width: `${(currentMonster.hp / currentMonster.maxHp) * 100}%`}}
              />
              <span>HP: {currentMonster.hp}/{currentMonster.maxHp}</span>
            </div>
            {currentMonster.isBoss && currentMonster.specialAbility && (
              <div className={styles.specialAbility}>
                <h4>특수 능력: {currentMonster.specialAbility.name}</h4>
                <p>{currentMonster.specialAbility.description}</p>
              </div>
            )}
            <div className={styles.problem}>
              <div className={styles.question}>{currentMonster.problem.question}</div>
              <div className={styles.options}>
                {currentMonster.problem.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={styles.optionButton}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 전투 로그 */}
      <div className={styles.battleLog}>
        {battleLog.map((log, index) => (
          <div key={index} className={styles.logEntry}>{log}</div>
        ))}
      </div>

      {/* 상점 */}
      {gameState === 'shop' && (
        <Shop
          gold={character.gold}
          onBuyEquipment={handleBuyEquipment}
          playerLevel={character.level}
        />
      )}
    </div>
  );
} 