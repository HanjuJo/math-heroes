'use client';

import React from 'react';
import styles from './Shop.module.css';
import { Equipment } from './types';

interface ShopProps {
  gold: number;
  onBuyEquipment: (equipment: Equipment) => void;
  playerLevel: number;
}

const shopItems: Equipment[] = [
  {
    name: '철검',
    type: 'weapon',
    attack: 5,
    level: 1,
    price: 100,
    description: '기본적인 무기입니다.'
  },
  {
    name: '강철검',
    type: 'weapon',
    attack: 10,
    level: 2,
    price: 300,
    description: '더 강력한 무기입니다.'
  },
  {
    name: '가죽 갑옷',
    type: 'armor',
    defense: 3,
    level: 1,
    price: 100,
    description: '기본적인 방어구입니다.'
  },
  {
    name: '철 갑옷',
    type: 'armor',
    defense: 7,
    level: 2,
    price: 300,
    description: '더 튼튼한 방어구입니다.'
  }
];

export default function Shop({ gold, onBuyEquipment, playerLevel }: ShopProps) {
  const availableItems = shopItems.filter(item => item.level <= playerLevel);

  return (
    <div className={styles.shop}>
      <h2>상점</h2>
      <div className={styles.goldInfo}>보유 골드: {gold}</div>
      <div className={styles.itemGrid}>
        {availableItems.map((item, index) => (
          <div key={index} className={styles.itemCard}>
            <h3>{item.name}</h3>
            <p className={styles.description}>{item.description}</p>
            <div className={styles.stats}>
              {item.attack && <div>공격력: +{item.attack}</div>}
              {item.defense && <div>방어력: +{item.defense}</div>}
            </div>
            <div className={styles.price}>가격: {item.price} 골드</div>
            <button
              className={styles.buyButton}
              onClick={() => onBuyEquipment(item)}
              disabled={gold < item.price}
            >
              구매하기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 