// 게임 상태 관리
const gameState = {
    currentGame: null,
    score: 0,
    currentLevel: 1,
    maxLevel: 10, // 최대 레벨 증가
    correctAnswers: 0,
    requiredCorrectAnswers: 3,
    treasures: [],
    usableTreasures: 0, // 레벨업에 사용 가능한 보물 수
    monsterHealth: 100,
    gameHistory: {},
    playerName: '조하윤', // 기본 플레이어 이름
    isLoggedIn: false,
    playerStats: {
        totalScore: 0,
        gamesPlayed: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        treasuresCollected: 0,
        currentLevel: 1
    }
};

// 효과음 관리
const soundEffects = {
    correct: new Audio('assets/sounds/correct.mp3'),
    wrong: new Audio('assets/sounds/wrong.mp3'),
    levelUp: new Audio('assets/sounds/levelup.mp3'),
    treasure: new Audio('assets/sounds/treasure.mp3'),
    monsterDefeat: new Audio('assets/sounds/monster_defeat.mp3'),
    buttonClick: new Audio('assets/sounds/click.mp3'),
    
    // 효과음 재생 함수
    play: function(sound) {
        // 효과음 파일이 없을 경우 콘솔에 메시지만 출력
        try {
            this[sound].currentTime = 0;
            this[sound].play().catch(e => console.log('효과음 재생 실패:', e));
        } catch (error) {
            console.log(`${sound} 효과음을 재생할 수 없습니다:`, error);
        }
    }
};

// 로컬 스토리지에서 게임 데이터 불러오기
function loadGameData() {
    const savedData = localStorage.getItem('mathHeroesData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        gameState.treasures = parsedData.treasures || [];
        gameState.gameHistory = parsedData.gameHistory || {};
        gameState.usableTreasures = parsedData.usableTreasures || 0;
        gameState.playerName = parsedData.playerName || '조하윤';
        gameState.isLoggedIn = parsedData.isLoggedIn || false;
        gameState.playerStats = parsedData.playerStats || {
            totalScore: 0,
            gamesPlayed: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            treasuresCollected: 0,
            currentLevel: 1
        };
    }
}

// 게임 데이터 저장하기
function saveGameData() {
    const dataToSave = {
        treasures: gameState.treasures,
        gameHistory: gameState.gameHistory,
        usableTreasures: gameState.usableTreasures,
        playerName: gameState.playerName,
        isLoggedIn: gameState.isLoggedIn,
        playerStats: gameState.playerStats
    };
    localStorage.setItem('mathHeroesData', JSON.stringify(dataToSave));
}

// 게임 초기화
function initializeGame() {
    loadGameData();
    setupEventListeners();
    
    // 로그인 상태 확인 및 표시
    updateLoginStatus();
}

// 로그인 상태 업데이트
function updateLoginStatus() {
    const loginStatusElement = document.getElementById('login-status');
    if (!loginStatusElement) return;
    
    if (gameState.isLoggedIn) {
        loginStatusElement.innerHTML = `
            <span>안녕하세요, ${gameState.playerName}님!</span>
            <button id="dashboard-button">대시보드</button>
            <button id="logout-button">로그아웃</button>
        `;
        
        // 대시보드와 로그아웃 버튼에 이벤트 리스너 추가
        document.getElementById('dashboard-button').addEventListener('click', showDashboard);
        document.getElementById('logout-button').addEventListener('click', logout);
    } else {
        loginStatusElement.innerHTML = `
            <button id="login-button">로그인</button>
        `;
        
        // 로그인 버튼에 이벤트 리스너 추가
        document.getElementById('login-button').addEventListener('click', showLoginForm);
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 게임 카드 클릭 이벤트
    document.getElementById('addition-game').addEventListener('click', () => {
        soundEffects.play('buttonClick');
        startGame('addition');
    });
    document.getElementById('subtraction-game').addEventListener('click', () => {
        soundEffects.play('buttonClick');
        startGame('subtraction');
    });
    document.getElementById('multiplication-game').addEventListener('click', () => {
        soundEffects.play('buttonClick');
        startGame('multiplication');
    });
    document.getElementById('clock-game').addEventListener('click', () => {
        soundEffects.play('buttonClick');
        startGame('clock');
    });
    
    // 보물상자 버튼 클릭 이벤트
    document.querySelector('.treasure-button').addEventListener('click', () => {
        soundEffects.play('buttonClick');
        openTreasureBox();
    });
    
    // 모달 닫기 버튼들
    document.querySelectorAll('.close-button, .modal-button').forEach(button => {
        button.addEventListener('click', () => {
            soundEffects.play('buttonClick');
            closeModal();
        });
    });
    
    // 레벨업 버튼 이벤트
    const levelUpButton = document.getElementById('level-up-button');
    if (levelUpButton) {
        levelUpButton.addEventListener('click', () => {
            soundEffects.play('buttonClick');
            levelUp();
        });
    }
}

// 모달 창 닫기
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

// 보물상자 열기
function openTreasureBox() {
    const treasuresGrid = document.getElementById('treasures-grid');
    treasuresGrid.innerHTML = '';
    
    // 레벨업 정보 추가
    const treasureInfo = document.createElement('div');
    treasureInfo.className = 'treasure-info';
    treasureInfo.innerHTML = `
        <p>현재 레벨: ${gameState.playerStats.currentLevel}</p>
        <p>사용 가능한 보물: ${gameState.usableTreasures}개</p>
        <button id="level-up-button" class="treasure-button" ${gameState.usableTreasures < 3 ? 'disabled' : ''}>
            보물 3개로 레벨업 하기
        </button>
    `;
    treasuresGrid.appendChild(treasureInfo);
    
    // 보물 목록 표시
    if (gameState.treasures.length === 0) {
        const noTreasures = document.createElement('p');
        noTreasures.textContent = '아직 모은 보물이 없어요. 게임에서 승리해서 보물을 모아보세요!';
        treasuresGrid.appendChild(noTreasures);
    } else {
        const treasuresList = document.createElement('div');
        treasuresList.className = 'treasures-list';
        
        gameState.treasures.forEach(treasure => {
            const treasureItem = document.createElement('div');
            treasureItem.className = 'treasure-item';
            treasureItem.textContent = treasure.icon;
            treasureItem.title = treasure.name;
            treasuresList.appendChild(treasureItem);
        });
        
        treasuresGrid.appendChild(treasuresList);
    }
    
    document.getElementById('treasure-modal').classList.remove('hidden');
    
    // 레벨업 버튼에 이벤트 리스너 추가
    const levelUpButton = document.getElementById('level-up-button');
    if (levelUpButton) {
        levelUpButton.addEventListener('click', () => {
            soundEffects.play('buttonClick');
            levelUp();
        });
    }
}

// 레벨업 기능
function levelUp() {
    if (gameState.usableTreasures >= 3) {
        gameState.usableTreasures -= 3;
        gameState.playerStats.currentLevel++;
        
        // 효과음 재생
        soundEffects.play('levelUp');
        
        // 레벨업 축하 메시지 표시
        const treasureModal = document.getElementById('treasure-modal');
        treasureModal.classList.add('hidden');
        
        const levelUpModal = document.createElement('div');
        levelUpModal.className = 'modal';
        levelUpModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2 class="reward-title">레벨 업!</h2>
                <div class="level-up-image">
                    <div class="big-level-icon">🏆</div>
                </div>
                <p class="reward-message">${gameState.playerName}님의 레벨이 ${gameState.playerStats.currentLevel}로 올랐습니다!</p>
                <p>더 높은 점수를 얻을 수 있게 되었어요!</p>
                <button class="modal-button">좋아요!</button>
            </div>
        `;
        
        document.body.appendChild(levelUpModal);
        
        // 모달 닫기 버튼에 이벤트 리스너 추가
        levelUpModal.querySelector('.close-button').addEventListener('click', () => {
            document.body.removeChild(levelUpModal);
        });
        
        levelUpModal.querySelector('.modal-button').addEventListener('click', () => {
            document.body.removeChild(levelUpModal);
        });
        
        // 게임 데이터 저장
        saveGameData();
        
        // 보물상자 UI 업데이트
        openTreasureBox();
    } else {
        alert('레벨업을 위해서는 보물이 3개 이상 필요합니다!');
    }
}

// 게임 시작
function startGame(gameType) {
    gameState.currentGame = gameType;
    gameState.score = 0;
    gameState.currentLevel = 1;
    gameState.correctAnswers = 0;
    gameState.monsterHealth = 100;
    
    // 게임 플레이 통계 업데이트
    gameState.playerStats.gamesPlayed++;
    
    // 메인 화면 숨기기
    document.querySelector('.container').classList.add('hidden');
    
    // 게임 화면 준비 및 표시
    const gameContainer = document.getElementById('game-container');
    gameContainer.classList.remove('hidden');
    
    // 게임 화면 구성
    setupGameScreen(gameType);
    
    // 첫 번째 문제 생성
    generateProblem();
    
    // 게임 데이터 저장
    saveGameData();
}

// 로그인 폼 표시
function showLoginForm() {
    const loginModal = document.createElement('div');
    loginModal.className = 'modal';
    loginModal.id = 'login-modal';
    loginModal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>로그인</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="player-name">이름:</label>
                    <input type="text" id="player-name" value="${gameState.playerName}" required>
                </div>
                <button type="submit" class="modal-button">로그인</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(loginModal);
    
    // 모달 닫기 버튼에 이벤트 리스너 추가
    loginModal.querySelector('.close-button').addEventListener('click', () => {
        document.body.removeChild(loginModal);
    });
    
    // 로그인 폼 제출 이벤트 리스너 추가
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const playerName = document.getElementById('player-name').value.trim();
        
        if (playerName) {
            gameState.playerName = playerName;
            gameState.isLoggedIn = true;
            saveGameData();
            
            document.body.removeChild(loginModal);
            updateLoginStatus();
            
            // 로그인 후 대시보드 표시
            showDashboard();
        }
    });
}

// 로그아웃 기능
function logout() {
    gameState.isLoggedIn = false;
    saveGameData();
    updateLoginStatus();
}

// 대시보드 표시
function showDashboard() {
    const dashboardModal = document.createElement('div');
    dashboardModal.className = 'modal';
    dashboardModal.id = 'dashboard-modal';
    dashboardModal.innerHTML = `
        <div class="modal-content dashboard-content">
            <span class="close-button">&times;</span>
            <h2>${gameState.playerName}님의 학습 대시보드</h2>
            
            <div class="dashboard-stats">
                <div class="stat-item">
                    <div class="stat-value">${gameState.playerStats.currentLevel}</div>
                    <div class="stat-label">현재 레벨</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${gameState.playerStats.totalScore}</div>
                    <div class="stat-label">총 점수</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${gameState.playerStats.gamesPlayed}</div>
                    <div class="stat-label">게임 횟수</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${gameState.playerStats.correctAnswers}</div>
                    <div class="stat-label">맞은 문제</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${gameState.playerStats.wrongAnswers}</div>
                    <div class="stat-label">틀린 문제</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${gameState.playerStats.treasuresCollected}</div>
                    <div class="stat-label">모은 보물</div>
                </div>
            </div>
            
            <div class="game-history">
                <h3>게임별 플레이 횟수</h3>
                <div class="history-items">
                    <div class="history-item">
                        <div class="history-label">덧셈 게임:</div>
                        <div class="history-value">${gameState.gameHistory.addition || 0}회</div>
                    </div>
                    <div class="history-item">
                        <div class="history-label">뺄셈 게임:</div>
                        <div class="history-value">${gameState.gameHistory.subtraction || 0}회</div>
                    </div>
                    <div class="history-item">
                        <div class="history-label">곱셈 게임:</div>
                        <div class="history-value">${gameState.gameHistory.multiplication || 0}회</div>
                    </div>
                    <div class="history-item">
                        <div class="history-label">시계 게임:</div>
                        <div class="history-value">${gameState.gameHistory.clock || 0}회</div>
                    </div>
                </div>
            </div>
            
            <button class="modal-button">닫기</button>
        </div>
    `;
    
    document.body.appendChild(dashboardModal);
    
    // 모달 닫기 버튼과 닫기 버튼에 이벤트 리스너 추가
    dashboardModal.querySelector('.close-button').addEventListener('click', () => {
        document.body.removeChild(dashboardModal);
    });
    
    dashboardModal.querySelector('.modal-button').addEventListener('click', () => {
        document.body.removeChild(dashboardModal);
    });
}

// 게임 화면 설정
function setupGameScreen(gameType) {
    const gameContainer = document.getElementById('game-container');
    let gameTitle = '';
    
    switch (gameType) {
        case 'addition':
            gameTitle = '덧셈 게임';
            break;
        case 'subtraction':
            gameTitle = '뺄셈 게임';
            break;
        case 'multiplication':
            gameTitle = '곱셈 게임';
            break;
        case 'clock':
            gameTitle = '시계 읽기 게임';
            break;
    }
    
    gameContainer.innerHTML = `
        <div class="game-header">
            <button class="back-button">← 메인으로</button>
            <h2 class="game-title">${gameTitle}</h2>
            <div class="score">점수: <span id="score-display">0</span></div>
        </div>
        
        <div class="game-area">
            <div class="monster-container">
                <img src="assets/characters/monster${Math.floor(Math.random() * 3) + 1}.svg" alt="몬스터" class="monster-image" id="monster-image">
            </div>
            
            <div class="health-bar-container">
                <div class="health-bar" id="health-bar"></div>
            </div>
            
            <div class="math-problem" id="problem-display"></div>
            
            ${gameType === 'clock' ? `
                <div class="clock-face" id="clock-face">
                    <div class="clock-center"></div>
                    <div class="hour-hand" id="hour-hand"></div>
                    <div class="minute-hand" id="minute-hand"></div>
                </div>
                <div class="time-options" id="options-container"></div>
            ` : `
                <div class="options-container" id="options-container"></div>
            `}
            
            <button class="hint-button" id="hint-button">힌트 보기</button>
            <p class="hint-text hidden" id="hint-text"></p>
            
            <div class="progress-container">
                <p class="progress-text">몬스터 처치까지: <span id="progress-counter">${gameState.correctAnswers}</span>/${gameState.requiredCorrectAnswers}</p>
                <div class="stars-container">
                    ${Array(gameState.requiredCorrectAnswers).fill().map(() => `<span class="star">★</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    // 뒤로 가기 버튼 이벤트 리스너
    document.querySelector('.back-button').addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        document.querySelector('.container').classList.remove('hidden');
    });
    
    // 힌트 버튼 이벤트 리스너
    document.getElementById('hint-button').addEventListener('click', showHint);
}

// 문제 생성
function generateProblem() {
    const problemDisplay = document.getElementById('problem-display');
    const optionsContainer = document.getElementById('options-container');
    let problem, options, correctAnswer;
    
    switch (gameState.currentGame) {
        case 'addition':
            ({ problem, options, correctAnswer } = generateAdditionProblem());
            break;
        case 'subtraction':
            ({ problem, options, correctAnswer } = generateSubtractionProblem());
            break;
        case 'multiplication':
            ({ problem, options, correctAnswer } = generateMultiplicationProblem());
            break;
        case 'clock':
            ({ problem, options, correctAnswer } = generateClockProblem());
            break;
    }
    
    // 문제 표시
    if (gameState.currentGame === 'clock') {
        problemDisplay.textContent = problem;
        setupClockFace(correctAnswer);
    } else {
        problemDisplay.textContent = problem;
    }
    
    // 힌트 텍스트 숨기기
    document.getElementById('hint-text').classList.add('hidden');
    
    // 보기 버튼 생성
    optionsContainer.innerHTML = '';
    options.forEach((option, index) => {
        const button = document.createElement('button');
        if (gameState.currentGame === 'clock') {
            button.className = 'time-option';
            button.textContent = option;
        } else {
            button.className = 'option-button';
            button.textContent = option;
        }
        
        button.addEventListener('click', () => {
            checkAnswer(option, correctAnswer);
        });
        
        optionsContainer.appendChild(button);
    });
}

// 덧셈 문제 생성
function generateAdditionProblem() {
    const maxNum = 20 + (gameState.currentLevel * 15);
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const correctAnswer = num1 + num2;
    
    const problem = `${num1} + ${num2} = ?`;
    
    // 보기 생성 (정답 + 3개의 오답)
    const options = [correctAnswer];
    while (options.length < 4) {
        const wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    // 보기 섞기
    shuffleArray(options);
    
    return { problem, options, correctAnswer };
}

// 뺄셈 문제 생성
function generateSubtractionProblem() {
    const maxNum = 20 + (gameState.currentLevel * 15);
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * num1) + 1; // num1보다 작은 수
    const correctAnswer = num1 - num2;
    
    const problem = `${num1} - ${num2} = ?`;
    
    // 보기 생성 (정답 + 3개의 오답)
    const options = [correctAnswer];
    while (options.length < 4) {
        const wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
        if (wrongAnswer !== correctAnswer && wrongAnswer >= 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    // 보기 섞기
    shuffleArray(options);
    
    return { problem, options, correctAnswer };
}

// 곱셈 문제 생성
function generateMultiplicationProblem() {
    const maxNum = Math.min(5 + Math.floor(gameState.currentLevel / 2), 10);
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const correctAnswer = num1 * num2;
    
    const problem = `${num1} × ${num2} = ?`;
    
    // 보기 생성 (정답 + 3개의 오답)
    const options = [correctAnswer];
    while (options.length < 4) {
        let wrongAnswer;
        // 비슷한 곱셈 결과 생성
        const randomChoice = Math.random();
        if (randomChoice < 0.3) {
            // num1 +/- 1 * num2
            wrongAnswer = (num1 + (Math.random() > 0.5 ? 1 : -1)) * num2;
        } else if (randomChoice < 0.6) {
            // num1 * (num2 +/- 1)
            wrongAnswer = num1 * (num2 + (Math.random() > 0.5 ? 1 : -1));
        } else {
            // 완전 랜덤
            wrongAnswer = Math.floor(Math.random() * (maxNum * maxNum)) + 1;
        }
        
        if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    // 보기 섞기
    shuffleArray(options);
    
    return { problem, options, correctAnswer };
}

// 시계 문제 생성
function generateClockProblem() {
    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const minutes = [0, 15, 30, 45]; // 초등학교 2학년 수준으로 단순화
    
    const hour = hours[Math.floor(Math.random() * hours.length)];
    const minute = minutes[Math.floor(Math.random() * minutes.length)];
    
    // 정답 형식: "hour:minute" (예: "3:15")
    const correctAnswer = `${hour}:${minute.toString().padStart(2, '0')}`;
    
    let problem;
    if (minute === 0) {
        problem = `시계가 ${hour}시 정각을 가리키고 있습니다. 시간은?`;
    } else if (minute === 30) {
        problem = `시계가 ${hour}시 30분을 가리키고 있습니다. 시간은?`;
    } else {
        problem = `시계가 ${hour}시 ${minute}분을 가리키고 있습니다. 시간은?`;
    }
    
    // 보기 생성
    const options = [formatTimeForDisplay(hour, minute)];
    
    // 오답 3개 생성
    while (options.length < 4) {
        const wrongHour = hours[Math.floor(Math.random() * hours.length)];
        const wrongMinute = minutes[Math.floor(Math.random() * minutes.length)];
        
        const wrongOption = formatTimeForDisplay(wrongHour, wrongMinute);
        
        if (!options.includes(wrongOption) && (wrongHour !== hour || wrongMinute !== minute)) {
            options.push(wrongOption);
        }
    }
    
    // 보기 섞기
    shuffleArray(options);
    
    return { problem, options, correctAnswer };
}

// 시계 표시를 위한 함수
function formatTimeForDisplay(hour, minute) {
    if (minute === 0) {
        return `${hour}시 정각`;
    } else {
        return `${hour}시 ${minute}분`;
    }
}

// 시계 화면 설정
function setupClockFace(timeString) {
    const [hour, minute] = timeString.split(':').map(Number);
    
    // 시침 각도 계산 (시간 + 분의 비율)
    const hourAngle = ((hour % 12) / 12) * 360 + ((minute / 60) * 30);
    
    // 분침 각도 계산
    const minuteAngle = (minute / 60) * 360;
    
    // 시계침 회전
    document.getElementById('hour-hand').style.transform = `translate(0, -50%) rotate(${hourAngle}deg)`;
    document.getElementById('minute-hand').style.transform = `translate(0, -50%) rotate(${minuteAngle}deg)`;
}

// 배열을 랜덤하게 섞는 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 정답 확인
function checkAnswer(selectedAnswer, correctAnswer) {
    let isCorrect;
    
    if (gameState.currentGame === 'clock') {
        // 시계 게임은 형식이 다르므로 별도 처리
        const correctTimeDisplay = formatTimeForDisplay(...correctAnswer.split(':').map(Number));
        isCorrect = selectedAnswer === correctTimeDisplay;
    } else {
        isCorrect = parseInt(selectedAnswer) === correctAnswer;
    }
    
    if (isCorrect) {
        // 정답 처리
        soundEffects.play('correct');
        gameState.playerStats.correctAnswers++;
        handleCorrectAnswer();
    } else {
        // 오답 처리
        soundEffects.play('wrong');
        gameState.playerStats.wrongAnswers++;
        handleWrongAnswer(correctAnswer);
    }
    
    // 게임 데이터 저장
    saveGameData();
}

// 정답 처리
function handleCorrectAnswer() {
    // 점수 증가 (현재 레벨에 따라 점수 증가)
    const scoreToAdd = 10 * gameState.playerStats.currentLevel;
    gameState.score += scoreToAdd;
    gameState.playerStats.totalScore += scoreToAdd;
    document.getElementById('score-display').textContent = gameState.score;
    
    // 몬스터 체력 감소
    gameState.monsterHealth -= 34; // 3번 맞으면 처치되도록
    updateMonsterHealth();
    
    // 정답 카운터 증가
    gameState.correctAnswers++;
    document.getElementById('progress-counter').textContent = gameState.correctAnswers;
    
    // 별 채우기
    const stars = document.querySelectorAll('.star');
    for (let i = 0; i < gameState.correctAnswers; i++) {
        if (stars[i]) stars[i].classList.add('filled');
    }
    
    // 몬스터를 물리쳤는지 확인
    if (gameState.correctAnswers >= gameState.requiredCorrectAnswers) {
        // 레벨 완료 처리
        setTimeout(() => {
            soundEffects.play('monsterDefeat');
            completeLevel();
        }, 800);
    } else {
        // 다음 문제 생성
        setTimeout(generateProblem, 800);
    }
    
    // 몬스터 피격 효과
    const monsterImage = document.getElementById('monster-image');
    monsterImage.classList.add('hit');
    setTimeout(() => {
        monsterImage.classList.remove('hit');
    }, 500);
}

// 오답 처리
function handleWrongAnswer(correctAnswer) {
    let correctAnswerText;
    
    if (gameState.currentGame === 'clock') {
        correctAnswerText = formatTimeForDisplay(...correctAnswer.split(':').map(Number));
    } else {
        correctAnswerText = correctAnswer;
    }
    
    // 힌트 표시
    const hintText = document.getElementById('hint-text');
    hintText.textContent = `정답은 ${correctAnswerText}입니다. 다시 도전해볼까요?`;
    hintText.classList.remove('hidden');
    
    // 2초 후 새 문제 생성
    setTimeout(() => {
        generateProblem();
    }, 2000);
}

// 몬스터 체력 업데이트
function updateMonsterHealth() {
    const healthBar = document.getElementById('health-bar');
    healthBar.style.width = `${Math.max(gameState.monsterHealth, 0)}%`;
    
    // 색상 변경
    if (gameState.monsterHealth < 30) {
        healthBar.style.backgroundColor = '#f44336'; // 빨간색
    } else if (gameState.monsterHealth < 70) {
        healthBar.style.backgroundColor = '#ff9800'; // 주황색
    }
}

// 힌트 표시
function showHint() {
    const hintText = document.getElementById('hint-text');
    let hintMessage = '';
    
    switch (gameState.currentGame) {
        case 'addition':
            hintMessage = '숫자를 더했을 때 나오는 값을 구하세요!';
            break;
        case 'subtraction':
            hintMessage = '큰 숫자에서 작은 숫자를 빼면 얼마가 남을까요?';
            break;
        case 'multiplication':
            hintMessage = '같은 숫자를 여러 번 더하는 것과 같아요!';
            break;
        case 'clock':
            hintMessage = '시침(짧은 바늘)은 시간을, 분침(긴 바늘)은 분을 가리켜요!';
            break;
    }
    
    hintText.textContent = hintMessage;
    hintText.classList.remove('hidden');
}

// 레벨 완료
function completeLevel() {
    // 보상 지급
    const rewards = [
        { icon: '⭐', name: '별' },
        { icon: '👑', name: '왕관' },
        { icon: '🏅', name: '메달' },
        { icon: '💎', name: '보석' },
        { icon: '🔮', name: '마법구슬' },
        { icon: '🧸', name: '곰인형' }
    ];
    
    // 랜덤 보상 선택
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    
    // 보상 저장
    gameState.treasures.push(reward);
    gameState.usableTreasures++; // 사용 가능한 보물 추가
    gameState.playerStats.treasuresCollected++;
    saveGameData();
    
    // 효과음 재생
    soundEffects.play('treasure');
    
    // 보상 이미지 설정 (이 예제에서는 아이콘으로 대체)
    const rewardTitle = document.querySelector('.reward-title');
    rewardTitle.textContent = '축하합니다! 몬스터를 물리쳤어요!';
    
    const rewardMessage = document.querySelector('.reward-message');
    rewardMessage.textContent = `${reward.name}을(를) 획득했어요!`;
    
    // 보상 모달 띄우기
    const rewardModal = document.getElementById('reward-modal');
    // 보상 아이콘 표시
    const rewardImage = document.getElementById('reward-item-image');
    if (rewardImage) {
        rewardImage.style.display = 'none';
    }
    const modalContent = rewardModal.querySelector('.reward-image');
    modalContent.innerHTML = `<div class="big-reward-icon">${reward.icon}</div>`;
    modalContent.querySelector('.big-reward-icon').style.fontSize = '5rem';
    
    rewardModal.classList.remove('hidden');
    
    // 게임 이력 업데이트
    if (!gameState.gameHistory[gameState.currentGame]) {
        gameState.gameHistory[gameState.currentGame] = 0;
    }
    gameState.gameHistory[gameState.currentGame]++;
    saveGameData();
    
    // 모달 닫기 버튼 이벤트 재설정
    rewardModal.querySelector('.modal-button').addEventListener('click', () => {
        closeModal();
        
        // 메인 화면으로 돌아가기
        document.getElementById('game-container').classList.add('hidden');
        document.querySelector('.container').classList.remove('hidden');
    });
}

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', initializeGame);

// CSS 애니메이션 클래스 추가
document.head.insertAdjacentHTML('beforeend', `
<style>
.hit {
    animation: shake 0.5s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.big-reward-icon {
    font-size: 5rem;
    margin: 20px 0;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}

.big-level-icon {
    font-size: 5rem;
    margin: 20px 0;
    animation: rotate 2s infinite;
    color: gold;
}

@keyframes rotate {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(1); }
}

/* 대시보드 스타일 */
.dashboard-content {
    max-width: 600px;
}

.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin: 20px 0;
}

.stat-item {
    background-color: #f5f7ff;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #4a6cd4;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 1rem;
    color: #666;
}

.game-history {
    margin-top: 20px;
    background-color: #f5f7ff;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.game-history h3 {
    margin-bottom: 10px;
    text-align: center;
}

.history-items {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.history-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
}

.history-label {
    font-weight: bold;
}

.history-value {
    color: #4a6cd4;
}

/* 보물상자 스타일 추가 */
.treasure-info {
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 20px;
    text-align: center;
}

.treasures-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 15px;
}

/* 로그인 폼 스타일 */
.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: 'Gaegu', cursive;
    font-size: 1rem;
}

/* 버튼 비활성화 스타일 */
button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
`); 