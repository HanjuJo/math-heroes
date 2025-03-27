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
            initializeNumberRunGame(gameContainer);
            break;
        case 'math-warrior':
            gameContainer.innerHTML = `
                <div class="game-description">
                    <p>수학 용사 게임은 곱셈과 나눗셈 문제를 풀어 몬스터를 물리치는 RPG 게임입니다.</p>
                    <p>준비 중인 게임입니다. 곧 만나볼 수 있습니다!</p>
                    <img src="https://via.placeholder.com/600x400?text=수학+용사" alt="수학 용사 게임 이미지" class="img-fluid rounded">
                </div>
            `;
            break;
        case 'shape-puzzle':
            gameContainer.innerHTML = `
                <div class="game-description">
                    <p>도형 퍼즐 게임은 다양한 도형을 배치하여 패턴을 완성하는 퍼즐 게임입니다.</p>
                    <p>준비 중인 게임입니다. 곧 만나볼 수 있습니다!</p>
                    <img src="https://via.placeholder.com/600x400?text=도형+퍼즐" alt="도형 퍼즐 게임 이미지" class="img-fluid rounded">
                </div>
            `;
            break;
        case 'math-market':
            gameContainer.innerHTML = `
                <div class="game-description">
                    <p>수학 시장 게임은 물건 가격을 계산하고 거스름돈을 계산하는 실생활 수학 게임입니다.</p>
                    <p>준비 중인 게임입니다. 곧 만나볼 수 있습니다!</p>
                    <img src="https://via.placeholder.com/600x400?text=수학+시장" alt="수학 시장 게임 이미지" class="img-fluid rounded">
                </div>
            `;
            break;
        default:
            if (gameType.startsWith('game-')) {
                // API에서 가져온 게임 상세 정보 로드 (기존 코드)
                const gameId = gameType.replace('game-', '');
                loadGameDetail(gameId);
                return;
            }
            gameContainer.innerHTML = '<p>게임 정보를 불러올 수 없습니다.</p>';
    }
    
    // 부트스트랩 모달 사용을 위해 코드 변경
    const modal = new bootstrap.Modal(document.getElementById('game-modal'));
    modal.show();
}

// 게임 모달 닫기
function closeGameModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('game-modal'));
    if (modal) {
        modal.hide();
    }
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

// 서버로부터 게임 목록 가져오기
function fetchGames() {
    fetch('/api/games')
        .then(response => {
            if (!response.ok) {
                throw new Error('게임 데이터를 불러오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(games => {
            displayGames(games);
        })
        .catch(error => {
            console.error('게임 데이터를 가져오는 중 오류 발생:', error);
            // 오류 시 대체 메시지 표시
            document.querySelector('.games-grid').innerHTML = `
                <div class="error-message">
                    <p>게임 목록을 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
                </div>
            `;
        });
}

// 게임 목록 화면에 표시
function displayGames(games) {
    const gamesGrid = document.querySelector('.games-grid');
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = '';
    
    games.forEach(game => {
        // 난이도에 따른 별 표시
        const stars = '★'.repeat(game.level) + '☆'.repeat(5 - game.level);
        
        // 태그 HTML 생성
        const tagsHtml = game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('');
        
        // 게임 카드 HTML 생성
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card-large';
        gameCard.setAttribute('data-game-id', game.id);
        
        gameCard.innerHTML = `
            <div class="game-image">
                <img src="${game.image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(game.title)}" alt="${game.title}">
            </div>
            <h3 class="game-title">${game.title}</h3>
            <div class="game-level">난이도: <span class="stars">${stars}</span></div>
            <p class="game-description">${game.description}</p>
            <div class="game-details">
                <div class="game-grades">대상: ${game.grades.join(', ')}학년</div>
                <div class="game-tags">${tagsHtml}</div>
            </div>
            <button class="game-start-btn" data-game-id="${game.id}">게임 시작하기</button>
        `;
        
        gamesGrid.appendChild(gameCard);
    });
    
    // 게임 시작 버튼 이벤트 리스너 추가
    document.querySelectorAll('.game-start-btn').forEach(button => {
        button.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game-id');
            loadGameDetail(gameId);
        });
    });
    
    // 게임 카드 클릭 이벤트 리스너 추가 (이미지와 제목)
    document.querySelectorAll('.game-card-large .game-image, .game-card-large .game-title').forEach(element => {
        element.addEventListener('click', function() {
            const gameId = this.closest('.game-card-large').getAttribute('data-game-id');
            loadGameDetail(gameId);
        });
    });
}

// 특정 게임 상세 정보 로드
function loadGameDetail(gameId) {
    fetch(`/api/games/${gameId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('게임 상세 정보를 불러오는 데 실패했습니다.');
            }
            return response.json();
        })
        .then(game => {
            openGameModal(game.title, `game-${game.id}`);
            
            // 모달 내용 업데이트
            document.getElementById('game-container').innerHTML = `
                <div class="game-detail">
                    <img src="${game.image || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(game.title)}" alt="${game.title}" class="game-detail-image">
                    <div class="game-info">
                        <p class="game-description-full">${game.description}</p>
                        <p class="game-target">대상 학년: ${game.grades.join(', ')}학년</p>
                        <div class="game-tags-container">
                            ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join('')}
                        </div>
                        <p class="game-coming-soon">이 게임은 현재 개발 중입니다. 곧 만나볼 수 있어요!</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('게임 상세 정보를 가져오는 중 오류 발생:', error);
            document.getElementById('game-container').innerHTML = `
                <div class="error-message">
                    <p>게임 정보를 불러오는 데 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
                </div>
            `;
        });
}

// 숫자왕 달리기 게임 초기화
function initializeNumberRunGame(container) {
    // 게임 상태 변수
    let score = 0;
    let lives = 3;
    let gameActive = true;
    let gameSpeed = 2000; // 문제 출제 시간 간격 (ms)
    let timerInterval;
    let currentQuestion = null;
    let timeLeft = 10;
    
    // 게임 UI 구성
    container.innerHTML = `
        <div class="number-run-game">
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="d-flex align-items-center">
                        <div class="me-3">
                            <i class="bi bi-trophy-fill text-warning fs-2"></i>
                        </div>
                        <div>
                            <p class="mb-0">점수</p>
                            <h3 id="game-score" class="mb-0">0</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 text-md-end">
                    <div class="d-flex align-items-center justify-content-md-end">
                        <div class="me-3">
                            <p class="mb-0">생명</p>
                            <h3 id="game-lives" class="mb-0">❤️❤️❤️</h3>
                        </div>
                        <div>
                            <i class="bi bi-heart-fill text-danger fs-2"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="game-board p-4 bg-light rounded shadow-sm mb-4">
                <div class="progress mb-3">
                    <div id="game-timer" class="progress-bar bg-warning" role="progressbar" style="width: 100%"></div>
                </div>
                
                <div id="game-question" class="text-center mb-4">
                    <h2 class="display-4 fw-bold">준비하세요!</h2>
                    <p>3초 후에 게임이 시작됩니다.</p>
                </div>
                
                <div id="game-options" class="row g-3 mb-3">
                    <div class="col-6">
                        <button class="btn btn-primary btn-lg w-100 option-btn" disabled>-</button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-primary btn-lg w-100 option-btn" disabled>-</button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-primary btn-lg w-100 option-btn" disabled>-</button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-primary btn-lg w-100 option-btn" disabled>-</button>
                    </div>
                </div>
                
                <div id="game-message" class="text-center p-3 rounded"></div>
            </div>
            
            <div class="text-center">
                <button id="start-game-btn" class="btn btn-success btn-lg">게임 시작하기</button>
                <button id="restart-game-btn" class="btn btn-warning btn-lg d-none">다시 시작하기</button>
            </div>
        </div>
    `;
    
    // DOM 요소 참조
    const scoreElement = container.querySelector('#game-score');
    const livesElement = container.querySelector('#game-lives');
    const questionElement = container.querySelector('#game-question');
    const optionsContainer = container.querySelector('#game-options');
    const optionButtons = container.querySelectorAll('.option-btn');
    const messageElement = container.querySelector('#game-message');
    const startButton = container.querySelector('#start-game-btn');
    const restartButton = container.querySelector('#restart-game-btn');
    const timerElement = container.querySelector('#game-timer');
    
    // 게임 시작 버튼 클릭 이벤트
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    
    // 게임 시작 함수
    function startGame() {
        // 게임 상태 초기화
        score = 0;
        lives = 3;
        gameActive = true;
        gameSpeed = 2000;
        scoreElement.textContent = score;
        livesElement.textContent = '❤️❤️❤️';
        
        // UI 초기화
        startButton.classList.add('d-none');
        restartButton.classList.add('d-none');
        messageElement.className = 'text-center p-3 rounded';
        messageElement.textContent = '';
        
        // 카운트다운 시작
        questionElement.innerHTML = '<h2 class="display-4 fw-bold">3</h2>';
        
        setTimeout(() => {
            questionElement.innerHTML = '<h2 class="display-4 fw-bold">2</h2>';
            setTimeout(() => {
                questionElement.innerHTML = '<h2 class="display-4 fw-bold">1</h2>';
                setTimeout(() => {
                    // 첫 번째 문제 출제
                    generateQuestion();
                    
                    // 문제 타이머 시작
                    startTimer();
                }, 1000);
            }, 1000);
        }, 1000);
    }
    
    // 문제 생성 함수
    function generateQuestion() {
        if (!gameActive) return;
        
        // 기존 타이머 정지
        clearInterval(timerInterval);
        timeLeft = 10;
        
        // 수학 문제 생성 (덧셈, 1~20 사이의 숫자)
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const correctAnswer = num1 + num2;
        
        // 오답 생성 (정답 ±5 이내, 중복 없이)
        let options = [correctAnswer];
        while (options.length < 4) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const wrongAnswer = correctAnswer + offset;
            
            // 1 이상의 숫자만 사용하고 중복 방지
            if (wrongAnswer >= 1 && !options.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
                options.push(wrongAnswer);
            }
        }
        
        // 옵션 섞기
        options = shuffleArray(options);
        
        // 현재 문제 기록
        currentQuestion = {
            question: `${num1} + ${num2} = ?`,
            answer: correctAnswer,
            options: options
        };
        
        // 화면 업데이트
        questionElement.innerHTML = `<h2 class="display-4 fw-bold">${currentQuestion.question}</h2>`;
        
        optionButtons.forEach((btn, index) => {
            btn.textContent = options[index];
            btn.disabled = false;
            btn.className = 'btn btn-primary btn-lg w-100 option-btn';
            
            // 이벤트 리스너 초기화
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // 새로운 이벤트 리스너 등록
        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', checkAnswer);
        });
        
        // 타이머 시작
        startTimer();
    }
    
    // 정답 확인 함수
    function checkAnswer(event) {
        // 타이머 정지
        clearInterval(timerInterval);
        
        const selectedAnswer = parseInt(event.target.textContent);
        const isCorrect = selectedAnswer === currentQuestion.answer;
        
        // 모든 버튼 비활성화
        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        if (isCorrect) {
            // 정답 처리
            event.target.className = 'btn btn-success btn-lg w-100 option-btn';
            score += 10;
            scoreElement.textContent = score;
            
            // 정답 메시지
            messageElement.className = 'text-center p-3 rounded bg-success text-white';
            messageElement.textContent = '정답입니다! 🎉';
            
            // 게임 속도 증가
            gameSpeed = Math.max(1000, gameSpeed - 100);
            
            // 다음 문제
            setTimeout(generateQuestion, 1500);
        } else {
            // 오답 처리
            event.target.className = 'btn btn-danger btn-lg w-100 option-btn';
            
            // 정답 표시
            optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
                if (parseInt(btn.textContent) === currentQuestion.answer) {
                    btn.className = 'btn btn-success btn-lg w-100 option-btn';
                }
            });
            
            // 오답 메시지
            messageElement.className = 'text-center p-3 rounded bg-danger text-white';
            messageElement.textContent = '틀렸습니다!';
            
            // 생명 감소
            lives--;
            livesElement.textContent = '❤️'.repeat(lives);
            
            if (lives > 0) {
                // 다음 문제
                setTimeout(generateQuestion, 1500);
            } else {
                // 게임 종료
                endGame();
            }
        }
    }
    
    // 타이머 함수
    function startTimer() {
        timeLeft = 10;
        timerElement.style.width = '100%';
        
        timerInterval = setInterval(() => {
            timeLeft -= 0.1;
            const percentage = (timeLeft / 10) * 100;
            timerElement.style.width = `${percentage}%`;
            
            // 시간 초과
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                
                // 모든 버튼 비활성화
                optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
                    btn.disabled = true;
                    
                    // 정답 표시
                    if (parseInt(btn.textContent) === currentQuestion.answer) {
                        btn.className = 'btn btn-success btn-lg w-100 option-btn';
                    }
                });
                
                // 시간 초과 메시지
                messageElement.className = 'text-center p-3 rounded bg-warning text-dark';
                messageElement.textContent = '시간 초과!';
                
                // 생명 감소
                lives--;
                livesElement.textContent = '❤️'.repeat(lives);
                
                if (lives > 0) {
                    // 다음 문제
                    setTimeout(generateQuestion, 1500);
                } else {
                    // 게임 종료
                    endGame();
                }
            }
        }, 100);
    }
    
    // 게임 종료 함수
    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        
        // 게임 종료 메시지
        questionElement.innerHTML = `
            <h2 class="display-4 fw-bold">게임 종료!</h2>
            <p>최종 점수: ${score}점</p>
        `;
        
        // 버튼 비활성화
        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            btn.className = 'btn btn-secondary btn-lg w-100 option-btn';
            btn.textContent = '-';
        });
        
        // 다시 시작 버튼 표시
        restartButton.classList.remove('d-none');
    }
    
    // 배열 섞기 함수
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 게임 페이지에서 자동으로 게임 목록 로드
if (document.querySelector('.games-grid')) {
    document.addEventListener('DOMContentLoaded', function() {
        fetchGames();
    });
} 