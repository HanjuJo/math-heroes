import crypto from 'crypto';

interface CoupangApiConfig {
  ACCESS_KEY: string;
  SECRET_KEY: string;
  VENDOR_ID: string;
}

export const config: CoupangApiConfig = {
  ACCESS_KEY: process.env.COUPANG_ACCESS_KEY || '',
  SECRET_KEY: process.env.COUPANG_SECRET_KEY || '',
  VENDOR_ID: process.env.COUPANG_VENDOR_ID || '',
};

interface SearchParams {
  keyword: string;
  limit?: number;
  page?: number;
}

export async function searchProducts(params: SearchParams) {
  const { keyword, limit = 10, page = 1 } = params;
  const datetime = new Date().toISOString();
  const method = 'GET';
  const path = `/v2/providers/affiliate_open_api/apis/openapi/products/search`;
  const queryString = `keyword=${encodeURIComponent(keyword)}&limit=${limit}&page=${page}`;
  
  const message = datetime + method + path + queryString;
  const hmac = crypto.createHmac('sha256', config.SECRET_KEY);
  const signature = hmac.update(message).digest('base64');

  try {
    const response = await fetch(
      `https://api-gateway.coupang.com${path}?${queryString}`,
      {
        headers: {
          'Authorization': `HMAC-SHA256 ${config.ACCESS_KEY}:${signature}`,
          'X-VENDOR-ID': config.VENDOR_ID,
          'X-API-KEY': config.ACCESS_KEY,
          'X-TIMESTAMP': datetime,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Coupang API Error:', error);
    return null;
  }
}

export function generateDeepLink(url: string) {
  // 실제 딥링크 생성 로직은 쿠팡파트너스 대시보드에서 확인 필요
  return `https://link.coupang.com/a/YOUR_TRACKING_ID?${encodeURIComponent(url)}`;
}

export const productCategories = {
  textbook: {
    keywords: ['초등 수학 문제집', '초등 수학 교재', '수학 학습지'],
    title: '교과서 및 문제집'
  },
  tools: {
    keywords: ['수학 교구', '수학 도형', '수학 학습 도구'],
    title: '학습 도구'
  },
  digital: {
    keywords: ['수학 계산기', '수학 학습기', '디지털 교구'],
    title: '디지털 기기'
  }
}; 