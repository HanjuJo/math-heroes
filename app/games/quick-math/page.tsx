interface Props {
  searchParams: {
    grade?: string;
  };
}

export default async function QuickMath({ searchParams }: Props) {
  const grade = parseInt(await Promise.resolve(searchParams?.grade || '1'));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">빠른수학</h1>
      <p className="mb-4">{grade}학년 난이도로 플레이합니다.</p>
      {/* 게임 컴포넌트 */}
    </div>
  );
} 