'use client';

import React, { useState, useEffect } from 'react';
import styles from './MathMarket.module.css';

interface MathMarketProps {
  grade: number;
  points?: number;
}

interface Item {
  id: number;
  name: string;
  basePrice: number;
  currentPrice: number;
  quantity: number;
  category: string;
  description: string;
}

export default function MathMarket({ grade, points = 0 }: MathMarketProps) {
  const [money, setMoney] = useState(1000 + points);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [message, setMessage] = useState('');
  const [problem, setProblem] = useState<{
    question: string;
    answer: number;
    options: number[];
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [action, setAction] = useState<'buy' | 'sell' | null>(null);

  const initialItems: Item[] = [
    {
      id: 1,
      name: '연필',
      basePrice: 100,
      currentPrice: 100,
      quantity: 0,
      category: '학용품',
      description: '기본적인 필기구입니다.'
    },
    {
      id: 2,
      name: '지우개',
      basePrice: 50,
      currentPrice: 50,
      quantity: 0,
      category: '학용품',
      description: '실수를 고칠 수 있어요.'
    },
    {
      id: 3,
      name: '공책',
      basePrice: 200,
      currentPrice: 200,
      quantity: 0,
      category: '학용품',
      description: '필기를 위한 노트입니다.'
    },
    {
      id: 4,
      name: '색연필 세트',
      basePrice: 500,
      currentPrice: 500,
      quantity: 0,
      category: '미술용품',
      description: '다양한 색으로 그림을 그려보세요.'
    },
    {
      id: 5,
      name: '물감 세트',
      basePrice: 800,
      currentPrice: 800,
      quantity: 0,
      category: '미술용품',
      description: '수채화를 그릴 수 있어요.'
    },
    {
      id: 6,
      name: '계산기',
      basePrice: 1500,
      currentPrice: 1500,
      quantity: 0,
      category: '학습도구',
      description: '복잡한 계산을 도와줍니다.'
    }
  ];

  const [items, setItems] = useState<Item[]>(initialItems);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prevItems => 
        prevItems.map(item => {
          const priceChange = (Math.random() - 0.5) * 0.4; // -20% to +20%
          const newPrice = Math.round(item.basePrice * (1 + priceChange));
          return {
            ...item,
            currentPrice: newPrice
          };
        })
      );
    }, 30000); // 30초마다 가격 변동

    return () => clearInterval(interval);
  }, []);

  const generateProblem = (item: Item, action: 'buy' | 'sell') => {
    let question = '';
    let answer = 0;
    const price = item.currentPrice;

    switch(grade) {
      case 1:
      case 2:
        // 간단한 덧셈/뺄셈
        if (action === 'buy') {
          const quantity = Math.floor(Math.random() * 3) + 1;
          question = `${item.name} ${quantity}개를 사려면 얼마가 필요한가요? (개당 ${price}원)`;
          answer = quantity * price;
        } else {
          const quantity = Math.floor(Math.random() * inventory.find(i => i.id === item.id)?.quantity! || 1) + 1;
          question = `${item.name} ${quantity}개를 팔면 얼마를 받을 수 있나요? (개당 ${price}원)`;
          answer = quantity * price;
        }
        break;
      
      case 3:
      case 4:
        // 할인/할증 계산
        if (action === 'buy') {
          const discount = Math.floor(Math.random() * 3) * 5 + 10; // 10%, 15%, 20% 할인
          question = `${item.name}의 원래 가격은 ${price}원입니다. ${discount}% 할인 중이라면 얼마인가요?`;
          answer = Math.round(price * (1 - discount / 100));
        } else {
          const premium = Math.floor(Math.random() * 3) * 5 + 10; // 10%, 15%, 20% 할증
          question = `${item.name}의 원래 가격은 ${price}원입니다. ${premium}% 비싸게 팔면 얼마인가요?`;
          answer = Math.round(price * (1 + premium / 100));
        }
        break;
      
      default:
        // 복잡한 수학 문제
        if (action === 'buy') {
          const quantity = Math.floor(Math.random() * 5) + 2;
          const discount = Math.floor(Math.random() * 3) * 5 + 10;
          question = `${item.name} ${quantity}개를 ${discount}% 할인된 가격에 사려고 합니다. 총 얼마인가요? (원래 가격 개당 ${price}원)`;
          answer = Math.round(quantity * price * (1 - discount / 100));
        } else {
          const quantity = Math.floor(Math.random() * inventory.find(i => i.id === item.id)?.quantity! || 1) + 1;
          const premium = Math.floor(Math.random() * 3) * 5 + 10;
          question = `${item.name} ${quantity}개를 ${premium}% 비싸게 팔면 얼마를 받을 수 있나요? (현재 시세 개당 ${price}원)`;
          answer = Math.round(quantity * price * (1 + premium / 100));
        }
    }

    const options = [answer];
    while (options.length < 4) {
      const wrongAnswer = answer + (Math.floor(Math.random() * 200) - 100);
      if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }

    setProblem({
      question,
      answer,
      options: options.sort(() => Math.random() - 0.5)
    });
  };

  const handleTransaction = (item: Item, action: 'buy' | 'sell') => {
    setSelectedItem(item);
    setAction(action);
    generateProblem(item, action);
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (!problem || !selectedItem || !action) return;

    if (selectedAnswer === problem.answer) {
      if (action === 'buy') {
        if (money >= selectedItem.currentPrice) {
          setMoney(prev => prev - selectedItem.currentPrice);
          setInventory(prev => {
            const existingItem = prev.find(i => i.id === selectedItem.id);
            if (existingItem) {
              return prev.map(i => 
                i.id === selectedItem.id 
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              );
            }
            return [...prev, { ...selectedItem, quantity: 1 }];
          });
          setMessage(`정답입니다! ${selectedItem.name}을(를) 구매했습니다.`);
        } else {
          setMessage('돈이 부족합니다!');
        }
      } else {
        const inventoryItem = inventory.find(i => i.id === selectedItem.id);
        if (inventoryItem && inventoryItem.quantity > 0) {
          setMoney(prev => prev + selectedItem.currentPrice);
          setInventory(prev =>
            prev.map(i =>
              i.id === selectedItem.id
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ).filter(i => i.quantity > 0)
          );
          setMessage(`정답입니다! ${selectedItem.name}을(를) 판매했습니다.`);
        }
      }
    } else {
      setMessage('틀렸습니다. 다시 계산해보세요!');
    }
    setProblem(null);
    setSelectedItem(null);
    setAction(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>수학 시장</h2>
        <p className={styles.money}>보유 금액: {money}원</p>
        <p className={styles.description}>
          물건을 사고 팔며 수학을 배워보세요!<br />
          가격은 30초마다 변동됩니다.
        </p>
      </div>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      {problem ? (
        <div className={styles.problem}>
          <h3>{problem.question}</h3>
          <div className={styles.options}>
            {problem.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={styles.optionButton}
              >
                {option}원
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className={styles.marketSection}>
            <h3>상점</h3>
            <div className={styles.itemGrid}>
              {items.map(item => (
                <div key={item.id} className={styles.itemCard}>
                  <h4>{item.name}</h4>
                  <p className={styles.category}>{item.category}</p>
                  <p className={styles.description}>{item.description}</p>
                  <p className={styles.price}>
                    {item.currentPrice}원
                    {item.currentPrice > item.basePrice ? (
                      <span className={styles.priceUp}>↑</span>
                    ) : item.currentPrice < item.basePrice ? (
                      <span className={styles.priceDown}>↓</span>
                    ) : null}
                  </p>
                  <button
                    onClick={() => handleTransaction(item, 'buy')}
                    className={styles.buyButton}
                    disabled={money < item.currentPrice}
                  >
                    구매하기
                  </button>
                </div>
              ))}
            </div>
          </div>

          {inventory.length > 0 && (
            <div className={styles.inventorySection}>
              <h3>인벤토리</h3>
              <div className={styles.itemGrid}>
                {inventory.map(item => (
                  <div key={item.id} className={styles.itemCard}>
                    <h4>{item.name}</h4>
                    <p className={styles.quantity}>보유: {item.quantity}개</p>
                    <p className={styles.price}>현재 시세: {items.find(i => i.id === item.id)?.currentPrice}원</p>
                    <button
                      onClick={() => handleTransaction(item, 'sell')}
                      className={styles.sellButton}
                    >
                      판매하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 