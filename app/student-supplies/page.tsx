'use client';

import { useState } from 'react';

const CATEGORIES = [
  '필기구',
  '노트/공책',
  '가방',
  '미술용품',
  '계산기',
  '기타 학용품',
];

const PRODUCTS = [
  {
    id: 1,
    name: '모나미 153 볼펜 세트',
    category: '필기구',
    price: '8,900원',
    image: 'https://thumbnail8.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/1055729368723-e8a0c4f7-8c44-4c01-9fc0-f4f8f0c0e335.jpg',
    link: 'https://www.coupang.com/vp/products/1055729368723',
  },
  {
    id: 2,
    name: '스프링 노트 10권 세트',
    category: '노트/공책',
    price: '12,900원',
    image: 'https://thumbnail9.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2023/05/02/11/4/e8f9f9f7-8c44-4c01-9fc0-f4f8f0c0e335.jpg',
    link: 'https://www.coupang.com/vp/products/2023050211',
  },
  // 더 많은 제품 추가 가능
];

export default function StudentSupplies() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const filteredProducts = selectedCategory === '전체'
    ? PRODUCTS
    : PRODUCTS.filter(product => product.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">학생용품</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setSelectedCategory('전체')}
          className={`px-4 py-2 rounded ${
            selectedCategory === '전체'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          전체
        </button>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <a
            key={product.id}
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.category}</p>
              <p className="text-blue-600 font-bold">{product.price}</p>
            </div>
          </a>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-100 rounded-lg">
        <p className="text-sm text-gray-600">
          * 위 상품들은 쿠팡 파트너스 프로그램을 통해 제공됩니다.
          구매 시 판매자에게 일정액의 수수료가 제공될 수 있습니다.
        </p>
      </div>
    </div>
  );
} 