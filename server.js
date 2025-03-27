const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.'))); // 현재 디렉토리의 정적 파일 제공

// 학년별 문제 데이터
const problems = {
    "1": [
        { question: "1 + 2 = ?", options: ["2", "3", "4", "5"], answer: "3" },
        { question: "5 - 3 = ?", options: ["1", "2", "3", "4"], answer: "2" }
    ],
    "2": [
        { question: "3 + 5 = ?", options: ["7", "8", "9", "10"], answer: "8" },
        { question: "10 - 4 = ?", options: ["4", "5", "6", "7"], answer: "6" }
    ],
    "3": [
        { question: "2 × 3 = ?", options: ["4", "5", "6", "7"], answer: "6" },
        { question: "8 ÷ 2 = ?", options: ["2", "3", "4", "5"], answer: "4" }
    ],
    "4": [
        { question: "15 + 7 = ?", options: ["21", "22", "23", "24"], answer: "22" },
        { question: "5 × 4 = ?", options: ["15", "20", "25", "30"], answer: "20" }
    ],
    "5": [
        { question: "30 ÷ 6 = ?", options: ["3", "4", "5", "6"], answer: "5" },
        { question: "12 × 3 = ?", options: ["24", "36", "48", "60"], answer: "36" }
    ],
    "6": [
        { question: "15 × 4 = ?", options: ["45", "50", "55", "60"], answer: "60" },
        { question: "72 ÷ 8 = ?", options: ["7", "8", "9", "10"], answer: "9" }
    ]
};

// 단원별 문제 데이터
const subjects = {
    'number': [
        { question: '25 + 18 = ?', options: ['33', '43', '53', '63'], answer: '43' },
        { question: '72 - 47 = ?', options: ['15', '25', '35', '45'], answer: '25' }
    ],
    'shape': [
        { question: '삼각형의 내각의 합은?', options: ['180°', '270°', '360°', '540°'], answer: '180°' },
        { question: '정사각형의 대각선 개수는?', options: ['1', '2', '3', '4'], answer: '2' }
    ],
    'measurement': [
        { question: '1m는 몇 cm?', options: ['10cm', '100cm', '1000cm', '10000cm'], answer: '100cm' },
        { question: '1시간은 몇 분?', options: ['30분', '60분', '90분', '120분'], answer: '60분' }
    ],
    'data': [
        { question: '주사위를 던져서 짝수가 나올 확률은?', options: ['1/6', '1/3', '1/2', '2/3'], answer: '1/2' },
        { question: '동전을 2번 던져 앞면이 한 번 이상 나올 확률은?', options: ['1/4', '1/2', '3/4', '1'], answer: '3/4' }
    ]
};

// API 엔드포인트
app.get('/api/problems/:grade', (req, res) => {
    const grade = req.params.grade;
    res.json(problems[grade] || []);
});

app.get('/api/subjects/:subject', (req, res) => {
    const subject = req.params.subject;
    res.json(subjects[subject] || []);
});

// 루트 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
}); 