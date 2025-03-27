document.addEventListener('DOMContentLoaded', function() {
    // 수학 기호 애니메이션 추가
    addMathSymbols();
    
    // 로컬 스토리지에서 학습 진도 정보 로드
    loadProgressData();
    
    // 학년별 메뉴 클릭 이벤트
    document.querySelectorAll('#grade-menu .menu-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade');
            fetchProblems(grade);
            
            // 선택된 학년 강조
            document.querySelectorAll('#grade-menu .menu-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 단원별 메뉴 클릭 이벤트
    document.querySelectorAll('#subject-menu .menu-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            fetchSubject(subject);
            
            // 선택된 단원 강조
            document.querySelectorAll('#subject-menu .menu-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 게임 시작 버튼 클릭 이벤트
    document.querySelectorAll('.play-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const gameType = this.getAttribute('data-game');
            const gameTitle = this.parentElement.querySelector('h3').textContent;
            openGameModal(gameTitle, gameType);
        });
    });
    
    // 게임 카드 클릭 이벤트 (이미지나 제목 클릭 시)
    document.querySelectorAll('.game-card .game-image, .game-card h3').forEach(function(element) {
        element.addEventListener('click', function() {
            const card = this.closest('.game-card');
            const gameType = card.querySelector('.play-btn').getAttribute('data-game');
            const gameTitle = card.querySelector('h3').textContent;
            openGameModal(gameTitle, gameType);
        });
    });

    // 모달 닫기 버튼 클릭 이벤트
    document.querySelector('.close-modal').addEventListener('click', function() {
        closeGameModal();
    });
    
    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('game-modal');
        if (event.target == modal) {
            closeGameModal();
        }
    });

    // 더 많은 게임 보기 버튼 클릭 이벤트
    document.getElementById('more-games').addEventListener('click', function() {
        alert('더 많은 게임을 준비 중입니다. 곧 만나볼 수 있어요!');
    });
    
    // 쿠팡 상품 자세히 보기 버튼 클릭 이벤트
    document.querySelectorAll('.buy-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const productName = this.parentElement.querySelector('h3').textContent;
            alert(`${productName} 상품 페이지로 이동합니다.`);
            // 여기에 쿠팡 파트너스 링크로 이동하는 코드 추가
        });
    });
    
    // 더 많은 상품 보기 버튼 클릭 이벤트
    document.getElementById('more-products').addEventListener('click', function() {
        alert('더 많은 추천 상품을 준비 중입니다. 곧 만나볼 수 있어요!');
    });
});

// 수학 기호 애니메이션 추가 함수
function addMathSymbols() {
    const symbols = ['+', '-', '×', '÷', '=', '%', 'π', '∑'];
    const positions = [
        {top: '100px', left: '100px'},
        {top: '200px', left: '900px'},
        {top: '700px', left: '200px'},
        {top: '350px', left: '850px'},
        {top: '500px', left: '80px'},
        {top: '650px', left: '700px'},
        {top: '100px', left: '300px'},
        {top: '100px', left: '650px'}
    ];
    
    const app = document.getElementById('app');
    
    symbols.forEach((symbol, index) => {
        const element = document.createElement('div');
        element.className = 'math-symbol';
        element.textContent = symbol;
        element.style.top = positions[index].top;
        element.style.left = positions[index].left;
        // 애니메이션 시작 시간을 각각 다르게 설정
        element.style.animationDelay = `${index * 0.3}s`;
        app.appendChild(element);
    });
}

// 학년별 문제 데이터 가져오기
function fetchProblems(grade) {
    // 서버 API 호출 (실제로는 fetch API를 사용하여 서버에서 데이터를 가져옴)
    // 여기서는 서버가 없으므로 데이터를 직접 정의함
    const problems = {
        '1': [
            { question: '1 + 2 = ?', options: ['2', '3', '4', '5'], answer: '3' },
            { question: '5 - 3 = ?', options: ['1', '2', '3', '4'], answer: '2' }
        ],
        '2': [
            { question: '3 + 5 = ?', options: ['7', '8', '9', '10'], answer: '8' },
            { question: '10 - 4 = ?', options: ['4', '5', '6', '7'], answer: '6' }
        ],
        '3': [
            { question: '2 × 3 = ?', options: ['4', '5', '6', '7'], answer: '6' },
            { question: '8 ÷ 2 = ?', options: ['2', '3', '4', '5'], answer: '4' }
        ],
        '4': [
            { question: '15 + 7 = ?', options: ['21', '22', '23', '24'], answer: '22' },
            { question: '5 × 4 = ?', options: ['15', '20', '25', '30'], answer: '20' }
        ],
        '5': [
            { question: '30 ÷ 6 = ?', options: ['3', '4', '5', '6'], answer: '5' },
            { question: '12 × 3 = ?', options: ['24', '36', '48', '60'], answer: '36' }
        ],
        '6': [
            { question: '15 × 4 = ?', options: ['45', '50', '55', '60'], answer: '60' },
            { question: '72 ÷ 8 = ?', options: ['7', '8', '9', '10'], answer: '9' }
        ]
    };

    // 받아온 데이터를 화면에 표시
    showProblems(grade, problems[grade]);
}

// 단원별 문제 데이터 가져오기
function fetchSubject(subject) {
    // 서버 API 호출 (실제로는 fetch API를 사용하여 서버에서 데이터를 가져옴)
    // 여기서는 서버가 없으므로 데이터를 직접 정의함
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

    // 받아온 데이터를 화면에 표시
    showProblems('단원별', subjects[subject]);
}

// 문제 데이터를 화면에 표시하는 함수
function showProblems(category, problems) {
    // 게임 영역의 제목과 내용을 변경
    const gameArea = document.querySelector('.game-area');
    gameArea.querySelector('h2').textContent = category + ' 문제';
    
    // 게임 카드를 문제 카드로 변경
    const gameCards = document.getElementById('game-cards');
    gameCards.innerHTML = '';
    
    problems.forEach((problem, index) => {
        const card = document.createElement('div');
        card.className = 'game-card problem-card';
        card.id = 'problem' + (index + 1);
        
        card.innerHTML = `
            <h3>문제 ${index + 1}</h3>
            <p class="question">${problem.question}</p>
            <div class="options">
                ${problem.options.map((option, i) => 
                    `<button class="option-btn" data-option="${i}">${option}</button>`
                ).join('')}
            </div>
            <p class="result" style="display: none;"></p>
        `;
        
        gameCards.appendChild(card);
        
        // 문제 옵션 버튼 클릭 이벤트
        card.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const selectedOption = this.textContent;
                const result = card.querySelector('.result');
                
                // 모든 옵션 버튼 비활성화
                card.querySelectorAll('.option-btn').forEach(b => {
                    b.disabled = true;
                    b.classList.remove('correct', 'wrong');
                });
                
                // 정답 확인
                if (selectedOption === problem.answer) {
                    result.textContent = '정답입니다! 🎉';
                    result.className = 'result correct';
                    this.classList.add('correct');
                    updateProgress(problem, true);
                } else {
                    result.textContent = '틀렸습니다. 정답은 ' + problem.answer + ' 입니다.';
                    result.className = 'result wrong';
                    this.classList.add('wrong');
                    
                    // 정답 표시
                    card.querySelectorAll('.option-btn').forEach(b => {
                        if (b.textContent === problem.answer) {
                            b.classList.add('correct');
                        }
                    });
                    updateProgress(problem, false);
                }
                
                result.style.display = 'block';
            });
        });
    });
    
    // 다시 풀기 버튼 추가
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-problems';
    resetButton.textContent = '다시 풀기';
    resetButton.addEventListener('click', function() {
        showProblems(category, problems);
    });
    
    gameCards.appendChild(resetButton);
}

// 게임 모달 열기
function openGameModal(title, gameType) {
    document.getElementById('modal-title').textContent = title;
    const gameContainer = document.getElementById('game-container');
    
    // 게임 타입에 따라 다른 게임 콘텐츠 로드
    switch(gameType) {
        case 'number-run':
            gameContainer.innerHTML = `
                <div class="game-description">
                    <p>숫자 달리기 게임은 주어진 덧셈과 뺄셈 문제를 빠르게 풀면서 장애물을 피해 달리는 게임입니다.</p>
                    <p>준비 중인 게임입니다. 곧 만나볼 수 있습니다!</p>
                    <img src="https://via.placeholder.com/600x400?text=숫자왕+달리기" alt="숫자왕 달리기 게임 이미지">
                </div>
            `;
            break;
        case 'math-warrior':
            gameContainer.innerHTML = `
                <div class="game-description">
                    <p>수학 용사 게임은 곱셈과 나눗셈 문제를 풀어 몬스터를 물리치는 RPG 게임입니다.</p>
                    <p>준비 중인 게임입니다. 곧 만나볼 수 있습니다!</p>
                    <img src="https://via.placeholder.com/600x400?text=수학+용사" alt="수학 용사 게임 이미지">
                </div>
            `;
            break;
        case 'shape-puzzle':
            gameContainer.innerHTML = `
                <div class="game-description">
                    <p>도형 퍼즐 게임은 다양한 도형을 배치하여 패턴을 완성하는 퍼즐 게임입니다.</p>
                    <p>준비 중인 게임입니다. 곧 만나볼 수 있습니다!</p>
                    <img src="https://via.placeholder.com/600x400?text=도형+퍼즐" alt="도형 퍼즐 게임 이미지">
                </div>
            `;
            break;
        case 'math-market':
            gameContainer.innerHTML = `
                <div class="game-description">
                    <p>수학 시장 게임은 물건 가격을 계산하고 거스름돈을 계산하는 실생활 수학 게임입니다.</p>
                    <p>준비 중인 게임입니다. 곧 만나볼 수 있습니다!</p>
                    <img src="https://via.placeholder.com/600x400?text=수학+시장" alt="수학 시장 게임 이미지">
                </div>
            `;
            break;
        default:
            gameContainer.innerHTML = '<p>게임 정보를 불러올 수 없습니다.</p>';
    }
    
    document.getElementById('game-modal').style.display = 'block';
}

// 게임 모달 닫기
function closeGameModal() {
    document.getElementById('game-modal').style.display = 'none';
}

// 학습 진도 데이터 로드
function loadProgressData() {
    // 로컬 스토리지에서 학습 데이터 가져오기
    const completedProblems = JSON.parse(localStorage.getItem('completedProblems')) || [];
    const totalProblems = 12; // 학년별 2문제 * 6학년 = 12문제
    
    // 진도율 계산 및 표시
    const progressPercent = Math.min(Math.round((completedProblems.length / totalProblems) * 100), 100);
    document.getElementById('progress-percent').textContent = progressPercent + '%';
    document.getElementById('progress-fill').style.width = progressPercent + '%';
}

// 문제 완료 시 진도 업데이트
function updateProgress(problem, isCorrect) {
    if (!isCorrect) return; // 정답일 때만 진도 업데이트
    
    // 로컬 스토리지에서 현재 데이터 가져오기
    let completedProblems = JSON.parse(localStorage.getItem('completedProblems')) || [];
    
    // 이미 완료한 문제인지 확인
    const alreadyCompleted = completedProblems.some(p => 
        p.question === problem.question && p.answer === problem.answer
    );
    
    // 아직 완료하지 않은 문제라면 추가
    if (!alreadyCompleted) {
        completedProblems.push({
            question: problem.question,
            answer: problem.answer,
            date: new Date().toISOString()
        });
        
        // 로컬 스토리지에 저장
        localStorage.setItem('completedProblems', JSON.stringify(completedProblems));
        
        // 진도 업데이트
        loadProgressData();
    }
} 