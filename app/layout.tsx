import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '수학 영웅들',
  description: '재미있게 수학을 배우는 교육용 게임',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <nav className="bg-blue-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-white text-2xl font-bold">수학 영웅들</Link>
            <div className="flex space-x-4">
              <Link href="/games/math-runner" className="text-white hover:text-blue-200">수학달리기</Link>
              <Link href="/games/quick-math" className="text-white hover:text-blue-200">빠른수학</Link>
              <Link href="/shop" className="text-white hover:text-blue-200">상점</Link>
              <Link href="/hall-of-fame" className="text-white hover:text-blue-200">명예의전당</Link>
              <Link href="/student-supplies" className="text-white hover:text-blue-200">학생용품</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
