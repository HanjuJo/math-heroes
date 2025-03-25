'use client';

import { useState, useEffect } from 'react';
import { audioManager } from '../../../utils/audioManager';
import styles from './MathMarket.module.css';

interface Item {
  id: string;
  name: string;
  price: number;
  description: string;
  effect: {
    type: string;
    value: number;
  };
  image: string;
}

interface MathMarketProps {
  money: number;
  onPurchase: (item: Item) => void;
  onMoneyChange: (newMoney: number) => void;
}

export default function MathMarket({ money, onPurchase, onMoneyChange }: MathMarketProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<Item[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 아이템 데이터 로드
    fetch('/images/items/items.json')
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error('아이템 로드 실패:', err));
  }, []);

  const addToCart = (item: Item) => {
    if (!isMuted) {
      audioManager.playSound('purchase');
    }
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    const total = getTotalPrice();
    if (total > money) {
      setMessage('골드가 부족합니다!');
      return;
    }

    cart.forEach(item => {
      onPurchase(item);
    });
    
    onMoneyChange(money - total);
    setCart([]);
    setMessage('구매 완료!');
    
    if (!isMuted) {
      audioManager.playSound('purchase');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioManager.setMuted(!isMuted);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.money}>보유 골드: {money}</div>
        <button className={styles.muteButton} onClick={toggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('부족') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      <div className={styles.marketGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <img src={item.image} alt={item.name} className={styles.itemImage} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>가격: {item.price} 골드</p>
            <button
              className={styles.addButton}
              onClick={() => addToCart(item)}
              disabled={getTotalPrice() + item.price > money}
            >
              장바구니에 추가
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className={styles.cart}>
          <h2>장바구니</h2>
          {cart.map((item, index) => (
            <div key={index} className={styles.cartItem}>
              <img src={item.image} alt={item.name} className={styles.cartItemImage} />
              <span>{item.name}</span>
              <span>{item.price} 골드</span>
              <button
                className={styles.removeButton}
                onClick={() => removeFromCart(index)}
              >
                제거
              </button>
            </div>
          ))}
          <div className={styles.cartTotal}>
            총 가격: {getTotalPrice()} 골드
          </div>
          <button
            className={styles.checkoutButton}
            onClick={handleCheckout}
          >
            구매하기
          </button>
        </div>
      )}
    </div>
  );
} 