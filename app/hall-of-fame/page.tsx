'use client';

import { useState } from 'react';

interface Player {
  nickname: string;
  school: string;
  score: number;
}

// 임시 데이터
const INITIAL_RANKINGS: Player[] = [
  { nickname: '수학왕', school: '서울초등학교', score: 5000 },
  { nickname: '퀴즈마스터', school: '대구초등학교', score: 4500 },
  { nickname: '게임천재', school: '부산초등학교', score: 4000 },
];

export default function HallOfFame() {
  const [rankings, setRankings] = useState<Player[]>(INITIAL_RANKINGS);
  const [nickname, setNickname] = useState('');
  const [school, setSchool] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlayer: Player = {
      nickname,
      school,
      score: parseInt(score),
    };
    
    const newRankings = [...rankings, newPlayer]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setRankings(newRankings);
    setNickname('');
    setSchool('');
    setScore('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">명예의전당</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">새로운 기록 등록</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">학교</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">점수</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            등록하기
          </button>
        </form>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">상위 10등</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">순위</th>
                <th className="p-2 text-left">닉네임</th>
                <th className="p-2 text-left">학교</th>
                <th className="p-2 text-left">점수</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((player, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{index + 1}등</td>
                  <td className="p-2">{player.nickname}</td>
                  <td className="p-2">{player.school}</td>
                  <td className="p-2">{player.score}점</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 