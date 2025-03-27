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
            initializeMathWarriorGame(gameContainer);
            break;
        case 'shape-puzzle':
            initializeShapePuzzleGame(gameContainer);
            break;
        case 'math-market':
            initializeMathMarketGame(gameContainer);
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

// 수학 용사 게임 초기화
function initializeMathWarriorGame(container) {
    // 게임 상태 변수
    let score = 0;
    let lives = 3;
    let gameActive = true;
    let enemyHealth = 100;
    let playerHealth = 100;
    let gameSpeed = 2000; // 문제 출제 시간 간격 (ms)
    let timerInterval;
    let currentQuestion = null;
    let timeLeft = 10;
    let level = 1;
    let enemyDefeated = 0;
    
    // 게임 UI 구성
    container.innerHTML = `
        <div class="game-board p-4 bg-light rounded shadow-sm mb-4">
            <div class="game-stats mb-4">
                <div class="row">
                    <div class="col">
                        <div class="stat-item">
                            <div class="stat-value">${score}</div>
                            <div class="stat-label">점수</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-item">
                            <div class="stat-value">${level}</div>
                            <div class="stat-label">레벨</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-item">
                            <div class="stat-value">❤️❤️❤️</div>
                            <div class="stat-label">생명</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="battle-area mb-4">
                <div class="row align-items-center">
                    <div class="col-md-5 text-center">
                        <div class="player-avatar mb-2">👨‍🎓</div>
                        <div class="progress mb-2" style="height: 20px;">
                            <div id="player-health" class="progress-bar bg-success" style="width: 100%"></div>
                        </div>
                        <div class="player-name">나의 전사</div>
                    </div>
                    <div class="col-md-2 text-center">
                        <div class="battle-vs display-5">VS</div>
                    </div>
                    <div class="col-md-5 text-center">
                        <div class="enemy-avatar mb-2">👾</div>
                        <div class="progress mb-2" style="height: 20px;">
                            <div id="enemy-health" class="progress-bar bg-danger" style="width: 100%"></div>
                        </div>
                        <div class="enemy-name">수학 몬스터</div>
                    </div>
                </div>
            </div>
            
            <div class="progress mb-3">
                <div id="game-timer" class="progress-bar bg-warning" role="progressbar" style="width: 100%"></div>
            </div>
            
            <div id="game-question" class="game-problem mb-4">
                <h2 class="display-4 fw-bold">준비하세요!</h2>
                <p>3초 후에 게임이 시작됩니다.</p>
            </div>
            
            <div id="game-options" class="game-options">
                <button class="option-button" disabled>-</button>
                <button class="option-button" disabled>-</button>
                <button class="option-button" disabled>-</button>
                <button class="option-button" disabled>-</button>
            </div>
            
            <div id="game-message" class="game-message"></div>
        </div>
        
        <div class="game-controls">
            <button id="start-game-btn" class="btn btn-primary btn-lg">게임 시작하기</button>
            <button id="restart-game-btn" class="btn btn-warning btn-lg d-none">다시 시작하기</button>
        </div>
    `;
    
    // DOM 요소 참조
    const scoreElement = container.querySelector('.stat-value:nth-child(1)');
    const levelElement = container.querySelector('.stat-value:nth-child(3)');
    const livesElement = container.querySelector('.stat-value:nth-child(5)');
    const playerHealthBar = container.querySelector('#player-health');
    const enemyHealthBar = container.querySelector('#enemy-health');
    const questionElement = container.querySelector('#game-question');
    const optionButtons = container.querySelectorAll('.option-button');
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
        enemyHealth = 100;
        playerHealth = 100;
        gameSpeed = 2000;
        level = 1;
        enemyDefeated = 0;
        
        // UI 초기화
        scoreElement.textContent = score;
        levelElement.textContent = level;
        livesElement.textContent = '❤️❤️❤️';
        playerHealthBar.style.width = '100%';
        enemyHealthBar.style.width = '100%';
        startButton.classList.add('d-none');
        restartButton.classList.add('d-none');
        messageElement.className = 'game-message';
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
        
        // 레벨에 따라 난이도 조정
        const maxNum = 5 + level * 2;
        
        // 문제 유형 선택 (곱셈 70%, 나눗셈 30%)
        const questionType = Math.random() < 0.7 ? 'multiplication' : 'division';
        
        let num1, num2, correctAnswer, questionText;
        
        if (questionType === 'multiplication') {
            // 곱셈 문제
            num1 = Math.floor(Math.random() * maxNum) + 1;
            num2 = Math.floor(Math.random() * maxNum) + 1;
            correctAnswer = num1 * num2;
            questionText = `${num1} × ${num2} = ?`;
        } else {
            // 나눗셈 문제 (정수 결과만)
            num2 = Math.floor(Math.random() * (maxNum - 1)) + 2; // 0으로 나누기 방지
            correctAnswer = Math.floor(Math.random() * maxNum) + 1;
            num1 = num2 * correctAnswer; // 정확한 나눗셈 결과를 위해
            questionText = `${num1} ÷ ${num2} = ?`;
        }
        
        // 오답 생성 (정답의 ±50% 범위, 중복 없이)
        let options = [correctAnswer];
        while (options.length < 4) {
            const offset = Math.floor(Math.random() * correctAnswer) - Math.floor(correctAnswer / 2);
            const wrongAnswer = correctAnswer + offset;
            
            // 양수이고 중복되지 않는 숫자만 사용
            if (wrongAnswer > 0 && !options.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
                options.push(wrongAnswer);
            }
        }
        
        // 옵션 섞기
        options = shuffleArray(options);
        
        // 현재 문제 기록
        currentQuestion = {
            question: questionText,
            answer: correctAnswer,
            options: options
        };
        
        // 화면 업데이트
        questionElement.innerHTML = `<h2 class="display-4 fw-bold">${currentQuestion.question}</h2>`;
        
        optionButtons.forEach((btn, index) => {
            btn.textContent = options[index];
            btn.disabled = false;
            btn.className = 'option-button';
            
            // 이벤트 리스너 초기화
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // 새로운 이벤트 리스너 등록
        container.querySelectorAll('.option-button').forEach(btn => {
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
        container.querySelectorAll('.option-button').forEach(btn => {
            btn.disabled = true;
        });
        
        if (isCorrect) {
            // 정답 처리
            event.target.className = 'option-button correct';
            event.target.classList.add('correct-answer'); // 애니메이션 효과
            
            // 점수 증가 (레벨에 따라 배율 증가)
            const pointsEarned = 10 * level;
            score += pointsEarned;
            scoreElement.textContent = score;
            
            // 적 체력 감소
            enemyHealth -= 20;
            if (enemyHealth <= 0) enemyHealth = 0;
            enemyHealthBar.style.width = `${enemyHealth}%`;
            
            // 정답 메시지
            messageElement.textContent = `정답입니다! +${pointsEarned}점 획득!`;
            
            // 적 처치 확인
            if (enemyHealth <= 0) {
                enemyDefeated++;
                
                // 다음 레벨 확인
                if (enemyDefeated >= 2) {
                    enemyDefeated = 0;
                    level++;
                    levelElement.textContent = level;
                    messageElement.textContent = `레벨 업! 이제 ${level}레벨입니다!`;
                }
                
                // 새 적 등장
                setTimeout(() => {
                    enemyHealth = 100;
                    enemyHealthBar.style.width = '100%';
                    generateQuestion();
                }, 1500);
            } else {
                // 다음 문제
                setTimeout(generateQuestion, 1000);
            }
        } else {
            // 오답 처리
            event.target.className = 'option-button incorrect';
            
            // 정답 표시
            container.querySelectorAll('.option-button').forEach(btn => {
                if (parseInt(btn.textContent) === currentQuestion.answer) {
                    btn.className = 'option-button correct';
                }
            });
            
            // 플레이어 체력 감소
            playerHealth -= 20;
            if (playerHealth <= 0) playerHealth = 0;
            playerHealthBar.style.width = `${playerHealth}%`;
            
            // 오답 메시지
            messageElement.textContent = '틀렸습니다!';
            
            // 게임오버 확인
            if (playerHealth <= 0) {
                lives--;
                livesElement.textContent = '❤️'.repeat(lives);
                
                if (lives > 0) {
                    // 생명이 남아있으면 체력 회복
                    setTimeout(() => {
                        playerHealth = 100;
                        playerHealthBar.style.width = '100%';
                        generateQuestion();
                    }, 1500);
                } else {
                    // 게임 종료
                    endGame();
                }
            } else {
                // 다음 문제
                setTimeout(generateQuestion, 1000);
            }
        }
    }
    
    // 타이머 함수
    function startTimer() {
        timeLeft = 10;
        timerElement.style.width = '100%';
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.style.width = `${(timeLeft / 10) * 100}%`;
            
            if (timeLeft <= 0) {
                // 시간 초과
                clearInterval(timerInterval);
                
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
            <p>달성 레벨: ${level}</p>
        `;
        
        // 버튼 비활성화
        container.querySelectorAll('.option-button').forEach(btn => {
            btn.disabled = true;
            btn.className = 'option-button';
            btn.textContent = '-';
        });
        
        // 다시 시작 버튼 표시
        restartButton.classList.remove('d-none');
    }
    
    // 배열 섞기 함수 (기존 함수 재사용)
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 도형 퍼즐 게임 초기화
function initializeShapePuzzleGame(container) {
    // 게임 상태 변수
    let score = 0;
    let level = 1;
    let gameActive = true;
    let timerInterval;
    let timeLeft = 45; // 더 긴 시간을 제공 (퍼즐 게임)
    let currentPattern = null;
    let selectedShape = null;
    
    // 도형 유형 
    const shapes = ['square', 'circle', 'triangle', 'diamond', 'pentagon', 'hexagon'];
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    
    // 도형 패턴 정의
    const patterns = [
        {
            name: "2x2 사각형",
            grid: [
                [1, 1],
                [1, 1]
            ],
            size: 2
        },
        {
            name: "L 모양",
            grid: [
                [1, 0],
                [1, 1]
            ],
            size: 2
        },
        {
            name: "역 L 모양",
            grid: [
                [0, 1],
                [1, 1]
            ],
            size: 2
        },
        {
            name: "T 모양",
            grid: [
                [1, 1, 1],
                [0, 1, 0]
            ],
            size: 3
        },
        {
            name: "십자 모양",
            grid: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            size: 3
        },
        {
            name: "Z 모양",
            grid: [
                [1, 1, 0],
                [0, 1, 1]
            ],
            size: 3
        }
    ];
    
    // 게임 UI 구성
    container.innerHTML = `
        <div class="game-board p-4 bg-light rounded shadow-sm mb-4">
            <div class="game-stats mb-4">
                <div class="row">
                    <div class="col">
                        <div class="stat-item">
                            <div class="stat-value">${score}</div>
                            <div class="stat-label">점수</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-item">
                            <div class="stat-value">${level}</div>
                            <div class="stat-label">레벨</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-item">
                            <div id="timer-value" class="stat-value">${timeLeft}</div>
                            <div class="stat-label">남은 시간(초)</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="progress mb-4">
                <div id="game-timer" class="progress-bar bg-info" role="progressbar" style="width: 100%"></div>
            </div>
            
            <div id="game-message" class="game-message text-center mb-4">
                <h3>도형을 드래그하여 퍼즐을 완성하세요!</h3>
                <p>레벨이 올라갈수록 난이도가 높아집니다.</p>
            </div>
            
            <div class="row">
                <div class="col-md-7">
                    <div id="pattern-container" class="pattern-container mb-3">
                        <h4 class="text-center mb-3">목표 패턴</h4>
                        <div id="target-pattern" class="target-pattern"></div>
                    </div>
                    
                    <div id="puzzle-grid" class="puzzle-grid">
                        <!-- 퍼즐 그리드는 자바스크립트로 생성됩니다 -->
                    </div>
                </div>
                
                <div class="col-md-5">
                    <div class="shapes-palette">
                        <h4 class="text-center mb-3">사용 가능한 도형</h4>
                        <div id="shapes-container" class="shapes-container">
                            <!-- 도형들은 자바스크립트로 생성됩니다 -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="game-controls text-center">
            <button id="start-game-btn" class="btn btn-primary btn-lg">게임 시작하기</button>
            <button id="reset-grid-btn" class="btn btn-secondary btn-lg d-none">그리드 초기화</button>
            <button id="submit-btn" class="btn btn-success btn-lg d-none">제출하기</button>
            <button id="next-level-btn" class="btn btn-info btn-lg d-none">다음 레벨</button>
            <button id="restart-game-btn" class="btn btn-warning btn-lg d-none">다시 시작하기</button>
        </div>
    `;
    
    // DOM 요소 참조
    const scoreElement = container.querySelector('.stat-value:nth-child(1)');
    const levelElement = container.querySelector('.stat-value:nth-child(3)');
    const timerElement = container.querySelector('#timer-value');
    const timerBar = container.querySelector('#game-timer');
    const messageElement = container.querySelector('#game-message');
    const targetPatternElement = container.querySelector('#target-pattern');
    const puzzleGridElement = container.querySelector('#puzzle-grid');
    const shapesContainerElement = container.querySelector('#shapes-container');
    
    const startButton = container.querySelector('#start-game-btn');
    const resetGridButton = container.querySelector('#reset-grid-btn');
    const submitButton = container.querySelector('#submit-btn');
    const nextLevelButton = container.querySelector('#next-level-btn');
    const restartButton = container.querySelector('#restart-game-btn');
    
    // 게임 시작 버튼 클릭 이벤트
    startButton.addEventListener('click', startGame);
    resetGridButton.addEventListener('click', resetGrid);
    submitButton.addEventListener('click', checkPuzzle);
    nextLevelButton.addEventListener('click', nextLevel);
    restartButton.addEventListener('click', startGame);
    
    // 게임 시작 함수
    function startGame() {
        // 게임 상태 초기화
        score = 0;
        level = 1;
        gameActive = true;
        timeLeft = 45;
        
        // UI 초기화
        scoreElement.textContent = score;
        levelElement.textContent = level;
        timerElement.textContent = timeLeft;
        timerBar.style.width = '100%';
        
        messageElement.textContent = '';
        messageElement.className = 'game-message';
        
        // 버튼 상태 관리
        startButton.classList.add('d-none');
        resetGridButton.classList.remove('d-none');
        submitButton.classList.remove('d-none');
        nextLevelButton.classList.add('d-none');
        restartButton.classList.add('d-none');
        
        // 첫 번째 레벨 시작
        initializeLevel();
        
        // 타이머 시작
        startTimer();
    }
    
    // 레벨 초기화
    function initializeLevel() {
        // 패턴 선택
        const patternIndex = (level - 1) % patterns.length;
        currentPattern = patterns[patternIndex];
        
        // 타겟 패턴 표시
        renderTargetPattern();
        
        // 퍼즐 그리드 생성
        createPuzzleGrid();
        
        // 도형 팔레트 생성
        createShapesPalette();
    }
    
    // 타겟 패턴 렌더링
    function renderTargetPattern() {
        targetPatternElement.innerHTML = '';
        targetPatternElement.style.gridTemplateColumns = `repeat(${currentPattern.size}, 1fr)`;
        
        const shapeColor = colors[Math.floor(Math.random() * colors.length)];
        
        for (let y = 0; y < currentPattern.grid.length; y++) {
            for (let x = 0; x < currentPattern.grid[y].length; x++) {
                const cell = document.createElement('div');
                cell.className = 'pattern-cell';
                
                if (currentPattern.grid[y][x] === 1) {
                    cell.classList.add('filled');
                    cell.style.backgroundColor = `var(--${shapeColor})`;
                }
                
                targetPatternElement.appendChild(cell);
            }
        }
    }
    
    // 퍼즐 그리드 생성
    function createPuzzleGrid() {
        puzzleGridElement.innerHTML = '';
        const gridSize = Math.max(5, currentPattern.size + 1); // 항상 패턴보다 큰 그리드
        puzzleGridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const cell = document.createElement('div');
                cell.className = 'puzzle-cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                // 셀에 드롭 이벤트 추가
                cell.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    cell.classList.add('drag-over');
                });
                
                cell.addEventListener('dragleave', () => {
                    cell.classList.remove('drag-over');
                });
                
                cell.addEventListener('drop', (e) => {
                    e.preventDefault();
                    cell.classList.remove('drag-over');
                    
                    if (!selectedShape) return;
                    
                    // 이미 채워진 셀이면 드롭 불가
                    if (cell.classList.contains('filled')) return;
                    
                    // 셀 채우기
                    cell.classList.add('filled');
                    cell.style.backgroundColor = selectedShape.style.backgroundColor;
                    
                    // 드래그한 도형 비활성화
                    selectedShape.classList.add('used');
                    selectedShape.setAttribute('draggable', 'false');
                    selectedShape = null;
                });
                
                puzzleGridElement.appendChild(cell);
            }
        }
    }
    
    // 도형 팔레트 생성
    function createShapesPalette() {
        shapesContainerElement.innerHTML = '';
        
        // 레벨에 따라 도형 개수 조정 (최소 5개, 최대 8개)
        const numShapes = Math.min(5 + Math.floor(level / 2), 8);
        
        for (let i = 0; i < numShapes; i++) {
            const shape = document.createElement('div');
            shape.className = 'shape-item';
            
            // 랜덤 도형 형태
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            shape.classList.add(shapeType);
            
            // 랜덤 색상
            const colorIndex = Math.floor(Math.random() * colors.length);
            shape.style.backgroundColor = `var(--${colors[colorIndex]})`;
            
            // 드래그 이벤트 설정
            shape.setAttribute('draggable', 'true');
            
            shape.addEventListener('dragstart', () => {
                selectedShape = shape;
            });
            
            shapesContainerElement.appendChild(shape);
        }
    }
    
    // 그리드 초기화
    function resetGrid() {
        // 모든 채워진 셀 비우기
        puzzleGridElement.querySelectorAll('.puzzle-cell.filled').forEach(cell => {
            cell.classList.remove('filled');
            cell.style.backgroundColor = '';
        });
        
        // 모든 도형 재사용 가능하게
        shapesContainerElement.querySelectorAll('.shape-item.used').forEach(shape => {
            shape.classList.remove('used');
            shape.setAttribute('draggable', 'true');
        });
    }
    
    // 퍼즐 검사
    function checkPuzzle() {
        const gridSize = Math.max(5, currentPattern.size + 1);
        const filledCells = [];
        
        // 채워진 셀 위치 수집
        puzzleGridElement.querySelectorAll('.puzzle-cell.filled').forEach(cell => {
            filledCells.push({
                x: parseInt(cell.dataset.x),
                y: parseInt(cell.dataset.y)
            });
        });
        
        // 패턴과 일치하는지 확인 (패턴의 모양을 찾기)
        let patternFound = false;
        
        // 다양한 위치에서 패턴 검색
        for (let startY = 0; startY <= gridSize - currentPattern.grid.length; startY++) {
            for (let startX = 0; startX <= gridSize - currentPattern.grid[0].length; startX++) {
                let matched = true;
                
                // 패턴 검사
                for (let y = 0; y < currentPattern.grid.length; y++) {
                    for (let x = 0; x < currentPattern.grid[y].length; x++) {
                        const cellFilled = filledCells.some(cell => 
                            cell.x === startX + x && cell.y === startY + y
                        );
                        
                        // 패턴과 다르면 일치하지 않음
                        if ((currentPattern.grid[y][x] === 1 && !cellFilled) || 
                            (currentPattern.grid[y][x] === 0 && cellFilled)) {
                            matched = false;
                            break;
                        }
                    }
                    if (!matched) break;
                }
                
                if (matched) {
                    patternFound = true;
                    break;
                }
            }
            if (patternFound) break;
        }
        
        // 결과 처리
        if (patternFound) {
            // 성공
            clearInterval(timerInterval);
            
            // 레벨에 따른 점수 계산
            const levelPoints = level * 20;
            // 남은 시간에 따른 보너스
            const timeBonus = Math.floor(timeLeft * 2);
            const totalPoints = levelPoints + timeBonus;
            
            score += totalPoints;
            scoreElement.textContent = score;
            
            messageElement.textContent = `
                <h3 class="text-success">축하합니다! 패턴을 완성했습니다!</h3>
                <p>레벨 점수: ${levelPoints}점 + 시간 보너스: ${timeBonus}점 = 총 ${totalPoints}점</p>
            `;
            
            // 버튼 상태 변경
            resetGridButton.classList.add('d-none');
            submitButton.classList.add('d-none');
            nextLevelButton.classList.remove('d-none');
        } else {
            // 실패
            messageElement.textContent = `
                <h3 class="text-danger">패턴이 일치하지 않습니다!</h3>
                <p>다시 시도해보세요.</p>
            `;
        }
    }
    
    // 다음 레벨
    function nextLevel() {
        level++;
        levelElement.textContent = level;
        
        // 타이머 재설정 (레벨이 올라갈수록 시간 감소)
        timeLeft = Math.max(30, 45 - (level * 2));
        timerElement.textContent = timeLeft;
        timerBar.style.width = '100%';
        
        // 메시지 초기화
        messageElement.textContent = `<h3>레벨 ${level} - 새로운 패턴을 완성하세요!</h3>`;
        
        // 버튼 상태 변경
        resetGridButton.classList.remove('d-none');
        submitButton.classList.remove('d-none');
        nextLevelButton.classList.add('d-none');
        
        // 새 레벨 초기화
        initializeLevel();
        
        // 타이머 시작
        startTimer();
    }
    
    // 타이머 함수
    function startTimer() {
        clearInterval(timerInterval);
        
        const totalTime = timeLeft;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            timerBar.style.width = `${(timeLeft / totalTime) * 100}%`;
            
            if (timeLeft <= 0) {
                // 시간 초과
                clearInterval(timerInterval);
                endGame();
            }
        }, 1000);
    }
    
    // 게임 종료
    function endGame() {
        gameActive = false;
        clearInterval(timerInterval);
        
        // 게임 종료 메시지
        messageElement.textContent = `
            <h3 class="text-danger">게임 종료!</h3>
            <p>최종 점수: ${score}점</p>
            <p>최종 레벨: ${level}</p>
        `;
        
        // 버튼 상태 변경
        resetGridButton.classList.add('d-none');
        submitButton.classList.add('d-none');
        nextLevelButton.classList.add('d-none');
        restartButton.classList.remove('d-none');
    }
}

// 수학 시장 게임 초기화
function initializeMathMarketGame(container) {
    // 게임 상태 변수
    let score = 0;
    let level = 1;
    let lives = 3;
    let gameActive = true;
    let timerInterval;
    let timeLeft = 30;
    let currentQuestion = null;
    
    // 상품 데이터
    const products = [
        { name: '연필', price: 1000, image: '✏️' },
        { name: '공책', price: 2500, image: '📔' },
        { name: '지우개', price: 500, image: '🧽' },
        { name: '색연필 세트', price: 5000, image: '🖍️' },
        { name: '물병', price: 3000, image: '🧴' },
        { name: '가방', price: 15000, image: '🎒' },
        { name: '도시락', price: 8000, image: '🍱' },
        { name: '수학책', price: 12000, image: '📚' },
        { name: '사과', price: 1500, image: '🍎' },
        { name: '바나나', price: 2000, image: '🍌' },
        { name: '오렌지', price: 1000, image: '🍊' },
        { name: '우유', price: 1800, image: '🥛' }
    ];
    
    // 지폐 및 동전 데이터
    const currencyData = [
        { value: 50000, type: 'bill', image: '5만원' },
        { value: 10000, type: 'bill', image: '1만원' },
        { value: 5000, type: 'bill', image: '5천원' },
        { value: 1000, type: 'bill', image: '1천원' },
        { value: 500, type: 'coin', image: '500원' },
        { value: 100, type: 'coin', image: '100원' },
        { value: 50, type: 'coin', image: '50원' },
        { value: 10, type: 'coin', image: '10원' }
    ];
    
    // 게임 UI 구성
    container.innerHTML = `
        <div class="game-board p-4 bg-light rounded shadow-sm mb-4">
            <div class="game-stats mb-4">
                <div class="row">
                    <div class="col">
                        <div class="stat-item">
                            <div class="stat-value">${score}</div>
                            <div class="stat-label">점수</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-item">
                            <div class="stat-value">${level}</div>
                            <div class="stat-label">레벨</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-item">
                            <div class="stat-value">❤️❤️❤️</div>
                            <div class="stat-label">생명</div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="stat-item">
                            <div id="timer-value" class="stat-value">${timeLeft}</div>
                            <div class="stat-label">시간(초)</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="progress mb-4">
                <div id="game-timer" class="progress-bar bg-info" role="progressbar" style="width: 100%"></div>
            </div>
            
            <div id="market-container">
                <div id="store-section" class="store-section mb-4">
                    <h3 class="text-center mb-3">수학 시장에 오신 것을 환영합니다!</h3>
                    <div id="products-display" class="row g-3"></div>
                </div>
                
                <div id="question-section" class="question-section p-3 rounded mb-4 d-none">
                    <h4 id="question-text" class="mb-3">문제 텍스트</h4>
                    
                    <div id="shopping-cart" class="shopping-cart mb-3"></div>
                    
                    <div id="calculation-area" class="calculation-area mb-3">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="input-group">
                                    <span class="input-group-text">총 금액</span>
                                    <input type="text" id="total-amount" class="form-control" readonly>
                                    <span class="input-group-text">원</span>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="input-group">
                                    <span class="input-group-text">지불 금액</span>
                                    <input type="text" id="payment-amount" class="form-control" readonly>
                                    <span class="input-group-text">원</span>
                                </div>
                            </div>
                        </div>
                        
                        <div id="money-selection" class="money-selection mb-3">
                            <h5 class="mb-2">거스름돈 계산하기</h5>
                            <div id="money-options" class="row g-2"></div>
                        </div>
                        
                        <div id="change-calculation" class="change-calculation mb-3">
                            <div class="input-group">
                                <span class="input-group-text">거스름돈</span>
                                <input type="text" id="change-amount" class="form-control" readonly>
                                <span class="input-group-text">원</span>
                            </div>
                        </div>
                        
                        <div id="selected-change" class="selected-change mb-3">
                            <h5>선택한 거스름돈</h5>
                            <div id="selected-money" class="row g-2"></div>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <span>합계: <span id="selected-total">0</span>원</span>
                                <button id="reset-change-btn" class="btn btn-sm btn-secondary">초기화</button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="question-message" class="alert d-none mb-3"></div>
                    
                    <div class="text-center">
                        <button id="submit-answer-btn" class="btn btn-primary">답안 제출하기</button>
                    </div>
                </div>
                
                <div id="game-message" class="game-message text-center mb-4"></div>
            </div>
        </div>
        
        <div class="game-controls text-center">
            <button id="start-game-btn" class="btn btn-primary btn-lg">게임 시작하기</button>
            <button id="restart-game-btn" class="btn btn-warning btn-lg d-none">다시 시작하기</button>
        </div>
    `;
    
    // DOM 요소 참조
    const scoreElement = container.querySelector('.stat-value:nth-child(1)');
    const levelElement = container.querySelector('.stat-value:nth-child(3)');
    const livesElement = container.querySelector('.stat-value:nth-child(5)');
    const timerElement = container.querySelector('#timer-value');
    const timerBar = container.querySelector('#game-timer');
    
    const storeSection = container.querySelector('#store-section');
    const questionSection = container.querySelector('#question-section');
    const questionText = container.querySelector('#question-text');
    const messageElement = container.querySelector('#game-message');
    const questionMessage = container.querySelector('#question-message');
    
    const productsDisplay = container.querySelector('#products-display');
    const shoppingCart = container.querySelector('#shopping-cart');
    const totalAmountInput = container.querySelector('#total-amount');
    const paymentAmountInput = container.querySelector('#payment-amount');
    const changeAmountInput = container.querySelector('#change-amount');
    const moneyOptionsContainer = container.querySelector('#money-options');
    const selectedMoney = container.querySelector('#selected-money');
    const selectedTotal = container.querySelector('#selected-total');
    
    const startButton = container.querySelector('#start-game-btn');
    const restartButton = container.querySelector('#restart-game-btn');
    const submitAnswerButton = container.querySelector('#submit-answer-btn');
    const resetChangeButton = container.querySelector('#reset-change-btn');
    
    // 게임 시작 버튼 클릭 이벤트
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    submitAnswerButton.addEventListener('click', checkAnswer);
    resetChangeButton.addEventListener('click', resetSelectedChange);
    
    // 게임 시작 함수
    function startGame() {
        // 게임 상태 초기화
        score = 0;
        level = 1;
        lives = 3;
        gameActive = true;
        timeLeft = 30;
        
        // UI 초기화
        scoreElement.textContent = score;
        levelElement.textContent = level;
        livesElement.textContent = '❤️❤️❤️';
        timerElement.textContent = timeLeft;
        timerBar.style.width = '100%';
        
        messageElement.textContent = '';
        messageElement.className = 'game-message';
        
        // 버튼 상태 관리
        startButton.classList.add('d-none');
        restartButton.classList.add('d-none');
        
        // 상점 표시
        showStore();
        
        // 문제 생성
        generateQuestion();
    }
    
    // 상점 표시
    function showStore() {
        storeSection.classList.remove('d-none');
        questionSection.classList.add('d-none');
        
        // 상품 표시
        productsDisplay.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-3 col-6';
            productCard.innerHTML = `
                <div class="product-card text-center p-2 rounded">
                    <div class="product-image display-4 mb-2">${product.image}</div>
                    <h5 class="product-name">${product.name}</h5>
                    <p class="product-price mb-1">${product.price.toLocaleString()}원</p>
                </div>
            `;
            productsDisplay.appendChild(productCard);
        });
        
        // 3초 후 문제 표시
        setTimeout(() => {
            storeSection.classList.add('d-none');
            questionSection.classList.remove('d-none');
            
            // 타이머 시작
            startTimer();
        }, 3000);
    }
    
    // 문제 생성
    function generateQuestion() {
        // 레벨에 따른 난이도 조정
        const numProducts = 1 + Math.min(level, 3); // 최대 4개 상품
        const maxPrice = level <= 2 ? 10000 : 20000; // 레벨에 따른 최대 가격
        
        // 랜덤 상품 선택
        const selectedProducts = [];
        const availableProducts = [...products];
        
        for (let i = 0; i < numProducts; i++) {
            const randomIndex = Math.floor(Math.random() * availableProducts.length);
            const product = availableProducts.splice(randomIndex, 1)[0];
            const quantity = Math.floor(Math.random() * 3) + 1; // 1~3개 랜덤 수량
            selectedProducts.push({
                ...product,
                quantity: quantity
            });
        }
        
        // 총 금액 계산
        const totalAmount = selectedProducts.reduce((sum, product) => 
            sum + (product.price * product.quantity), 0);
        
        // 지불 금액 계산 (총 금액보다 큰 랜덤 금액)
        const paymentUnit = level <= 2 ? 1000 : 5000;
        const minPayment = Math.ceil(totalAmount / paymentUnit) * paymentUnit;
        const maxPayment = Math.min(minPayment + (level * paymentUnit), 100000);
        const paymentAmount = minPayment;
        
        // 거스름돈 계산
        const changeAmount = paymentAmount - totalAmount;
        
        // 문제 저장
        currentQuestion = {
            products: selectedProducts,
            totalAmount: totalAmount,
            paymentAmount: paymentAmount,
            changeAmount: changeAmount
        };
        
        // 화면 업데이트
        updateQuestionDisplay();
    }
    
    // 문제 화면 업데이트
    function updateQuestionDisplay() {
        // 문제 텍스트 설정
        questionText.textContent = `다음 상품의 총 금액과 거스름돈을 계산하세요.`;
        
        // 장바구니 업데이트
        shoppingCart.innerHTML = '';
        currentQuestion.products.forEach(product => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item d-flex align-items-center mb-2 p-2 rounded';
            cartItem.innerHTML = `
                <div class="product-image me-3">${product.image}</div>
                <div class="product-details flex-grow-1">
                    <div class="product-name fw-bold">${product.name}</div>
                    <div class="product-price">${product.price.toLocaleString()}원 x ${product.quantity}개</div>
                </div>
                <div class="product-total fw-bold">${(product.price * product.quantity).toLocaleString()}원</div>
            `;
            shoppingCart.appendChild(cartItem);
        });
        
        // 계산 영역 업데이트
        totalAmountInput.value = currentQuestion.totalAmount.toLocaleString();
        paymentAmountInput.value = currentQuestion.paymentAmount.toLocaleString();
        changeAmountInput.value = currentQuestion.changeAmount.toLocaleString();
        
        // 화폐 옵션 업데이트
        moneyOptionsContainer.innerHTML = '';
        
        currencyData.forEach(money => {
            const moneyButton = document.createElement('div');
            moneyButton.className = 'col-md-3 col-6';
            moneyButton.innerHTML = `
                <button class="btn btn-outline-primary money-btn w-100" 
                        data-value="${money.value}">
                    ${money.image}
                </button>
            `;
            moneyOptionsContainer.appendChild(moneyButton);
        });
        
        // 선택한 화폐 초기화
        resetSelectedChange();
        
        // 화폐 버튼 이벤트 설정
        container.querySelectorAll('.money-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = parseInt(btn.getAttribute('data-value'));
                addSelectedMoney(value);
            });
        });
        
        // 메시지 초기화
        questionMessage.className = 'alert d-none';
        questionMessage.textContent = '';
    }
    
    // 선택한 화폐 추가
    function addSelectedMoney(value) {
        const moneyItem = document.createElement('div');
        moneyItem.className = 'col-md-3 col-6';
        moneyItem.innerHTML = `
            <div class="selected-money-item p-2 rounded text-center">
                ${value.toLocaleString()}원
                <button class="btn-close remove-money" data-value="${value}"></button>
            </div>
        `;
        
        selectedMoney.appendChild(moneyItem);
        
        // 금액 합계 업데이트
        updateSelectedTotal();
        
        // 삭제 버튼 이벤트
        moneyItem.querySelector('.remove-money').addEventListener('click', () => {
            moneyItem.remove();
            updateSelectedTotal();
        });
    }
    
    // 선택한 금액 합계 업데이트
    function updateSelectedTotal() {
        let total = 0;
        container.querySelectorAll('.selected-money-item').forEach(item => {
            const value = parseInt(item.querySelector('.remove-money').getAttribute('data-value'));
            total += value;
        });
        
        selectedTotal.textContent = total.toLocaleString();
    }
    
    // 선택한 화폐 초기화
    function resetSelectedChange() {
        selectedMoney.innerHTML = '';
        selectedTotal.textContent = '0';
    }
    
    // 정답 확인
    function checkAnswer() {
        // 선택한 금액 합계 계산
        let total = 0;
        container.querySelectorAll('.selected-money-item').forEach(item => {
            const value = parseInt(item.querySelector('.remove-money').getAttribute('data-value'));
            total += value;
        });
        
        // 정답 확인
        const isCorrect = total === currentQuestion.changeAmount;
        
        // 결과 표시
        if (isCorrect) {
            questionMessage.className = 'alert alert-success';
            questionMessage.textContent = '정답입니다! 🎉';
            
            // 점수 증가
            const pointsEarned = 10 * level;
            score += pointsEarned;
            scoreElement.textContent = score;
            
            // 타이머 정지
            clearInterval(timerInterval);
            
            // 3초 후 다음 레벨
            setTimeout(() => {
                level++;
                levelElement.textContent = level;
                
                // 타이머 재설정
                timeLeft = Math.max(20, 30 - (level * 2));
                timerElement.textContent = timeLeft;
                
                // 새 문제 생성
                generateQuestion();
                
                // 타이머 시작
                startTimer();
            }, 2000);
        } else {
            questionMessage.className = 'alert alert-danger';
            
            // 금액이 맞지 않는 경우
            if (total !== currentQuestion.changeAmount) {
                questionMessage.textContent = `틀렸습니다. 정확한 거스름돈은 ${currentQuestion.changeAmount.toLocaleString()}원 입니다.`;
            }
            
            // 생명 감소
            lives--;
            livesElement.textContent = '❤️'.repeat(lives);
            
            if (lives <= 0) {
                // 게임 종료
                endGame();
            } else {
                // 2초 후 재시도
                setTimeout(() => {
                    resetSelectedChange();
                    questionMessage.className = 'alert d-none';
                }, 2000);
            }
        }
    }
    
    // 타이머 함수
    function startTimer() {
        clearInterval(timerInterval);
        
        timerBar.style.width = '100%';
        timerElement.textContent = timeLeft;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            timerBar.style.width = `${(timeLeft / 30) * 100}%`;
            
            if (timeLeft <= 0) {
                // 시간 초과
                clearInterval(timerInterval);
                
                questionMessage.className = 'alert alert-warning';
                questionMessage.textContent = '시간 초과!';
                
                // 생명 감소
                lives--;
                livesElement.textContent = '❤️'.repeat(lives);
                
                if (lives <= 0) {
                    // 게임 종료
                    endGame();
                } else {
                    // 2초 후 다시 시작
                    setTimeout(() => {
                        // 타이머 재설정
                        timeLeft = Math.max(20, 30 - (level * 2));
                        timerElement.textContent = timeLeft;
                        
                        // 새 문제 생성
                        generateQuestion();
                        
                        // 타이머 시작
                        startTimer();
                    }, 2000);
                }
            }
        }, 1000);
    }
    
    // 게임 종료
    function endGame() {
        clearInterval(timerInterval);
        gameActive = false;
        
        // 메시지 표시
        messageElement.innerHTML = `
            <h3 class="text-danger">게임 종료!</h3>
            <p>최종 점수: ${score}점</p>
            <p>최종 레벨: ${level}</p>
        `;
        
        // 버튼 상태 변경
        restartButton.classList.remove('d-none');
    }
}

// 게임 페이지에서 자동으로 게임 목록 로드
if (document.querySelector('.games-grid')) {
    document.addEventListener('DOMContentLoaded', function() {
        fetchGames();
    });
} 