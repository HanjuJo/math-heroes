'use client';

import { useState } from 'react';

const ITEMS = [
  {
    id: 'pass',
    name: '문제 패스권',
    description: '모르는 문제를 패스하고 설명을 볼 수 있습니다.',
    price: 100,
  },
  {
    id: 'snack1000',
    name: '간식 쿠폰 (1000점)',
    description: '1000점 상당의 간식을 구매할 수 있는 쿠폰입니다.',
    price: 1000,
  },
  {
    id: 'snack10000',
    name: '간식 쿠폰 (10000점)',
    description: '10000점 상당의 간식을 구매할 수 있는 쿠폰입니다.',
    price: 10000,
  },
];

export default function Shop() {
  const [score, setScore] = useState(1500); // 임시 점수
  const [inventory, setInventory] = useState<{[key: string]: number}>({
    pass: 0,
    snack1000: 0,
    snack10000: 0,
  });

  const buyItem = (itemId: string, price: number) => {
    if (score < price) {
      alert('점수가 부족합니다!');
      return;
    }

    setScore(prev => prev - price);
    setInventory(prev => ({
      ...prev,
      [itemId]: prev[itemId] + 1,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">상점</h1>
      
      <div className="bg-blue-100 p-4 rounded-lg mb-8">
        <p className="text-xl">
          현재 보유 점수: <span className="font-bold">{score}점</span>
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ITEMS.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">{item.price}점</span>
              <button
                onClick={() => buyItem(item.id, item.price)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                구매하기
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              보유 수량: {inventory[item.id]}개
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">보유 아이템</h2>
        <ul className="space-y-2">
          {Object.entries(inventory).map(([itemId, count]) => {
            const item = ITEMS.find(i => i.id === itemId);
            if (!item || count === 0) return null;
            return (
              <li key={itemId} className="flex justify-between">
                <span>{item.name}</span>
                <span>{count}개</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
} 