// 게임 상태 관리
const gameState = {
    currentGame: null,
    score: 0,
    currentLevel: 1,
    maxLevel: 10,
    correctAnswers: 0,
    requiredCorrectAnswers: 3,
    treasures: [],
    usableTreasures: 0,
    monsterHealth: 100,
    gameHistory: {},
    playerName: '조하윤',
    isLoggedIn: false,
    snackCoupons: 0,
    leaderboard: [],
    playerStats: {
        totalScore: 0,
        gamesPlayed: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        treasuresCollected: 0,
        currentLevel: 1
    }
};

// 소리 효과 객체 정의
const soundEffects = {
    sounds: {},
    load: function() {
        this.sounds = {
            buttonClick: new Audio('assets/sounds/click.mp3'),
            correct: new Audio('assets/sounds/correct.mp3'),
            wrong: new Audio('assets/sounds/wrong.mp3'),
            treasure: new Audio('assets/sounds/treasure.mp3'),
            levelUp: new Audio('assets/sounds/levelup.mp3'),
            monsterDefeat: new Audio('assets/sounds/monster_defeat.mp3')
        };
    },
    play: function(sound) {
        if (this.sounds[sound]) {
            try {
                this.sounds[sound].currentTime = 0;
                this.sounds[sound].play().catch(e => console.log('소리 재생 오류:', e));
            } catch (e) {
                console.log('소리 재생 오류:', e);
            }
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
        gameState.snackCoupons = parsedData.snackCoupons || 0;
        gameState.leaderboard = parsedData.leaderboard || [];
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
        snackCoupons: gameState.snackCoupons,
        leaderboard: gameState.leaderboard,
        playerStats: gameState.playerStats
    };
    localStorage.setItem('mathHeroesData', JSON.stringify(dataToSave));
}

// 로그인 상태 업데이트 함수
function updateLoginStatus() {
    const loginStatus = document.getElementById('login-status');
    if (!loginStatus) return;
    
    if (gameState.isLoggedIn) {
        loginStatus.innerHTML = `
            <div class="logged-in-info">
                <span class="user-name">${gameState.playerName}님</span>
                <span class="level-info">레벨: ${gameState.playerStats.currentLevel}</span>
                <button id="dashboard-button" class="dashboard-button">대시보드</button>
                <button id="logout-button" class="logout-button">로그아웃</button>
            </div>
        `;
        
        // 대시보드 버튼 이벤트 리스너
        document.getElementById('dashboard-button').addEventListener('click', () => {
            soundEffects.play('buttonClick');
            showDashboard();
        });
        
        // 로그아웃 버튼 이벤트 리스너
        document.getElementById('logout-button').addEventListener('click', () => {
            soundEffects.play('buttonClick');
            gameState.isLoggedIn = false;
            saveGameData();
            updateLoginStatus();
        });
    } else {
        loginStatus.innerHTML = `
            <div class="login-prompt">
                <input type="text" id="player-name" placeholder="이름을 입력하세요" value="${gameState.playerName}">
                <button id="login-button" class="login-button">로그인</button>
            </div>
        `;
        
        // 로그인 버튼 이벤트 리스너
        document.getElementById('login-button').addEventListener('click', () => {
            const playerNameInput = document.getElementById('player-name');
            const playerName = playerNameInput.value.trim();
            
            if (playerName) {
                gameState.playerName = playerName;
                gameState.isLoggedIn = true;
                saveGameData();
                updateLoginStatus();
                soundEffects.play('buttonClick');
            }
        });
    }
}

// 게임 초기화
function initializeGame() {
    // 소리 효과 로드
    soundEffects.load();
    
    loadGameData();
    setupEventListeners();
    
    // 로그인 상태 확인 및 표시
    updateLoginStatus();
    
    // 미니게임 버튼을 메인 화면에 추가
    addMiniGameButton();
}

// 미니게임 버튼 추가 함수
function addMiniGameButton() {
    // 보물상자 섹션 찾기
    const treasureSection = document.querySelector('.treasure-box');
    if (!treasureSection) return;
    
    // 이미 추가되어 있는지 확인
    if (document.querySelector('.minigame-container')) return;
    
    // 미니게임 컨테이너 생성
    const minigameContainer = document.createElement('section');
    minigameContainer.className = 'minigame-container';
    minigameContainer.innerHTML = `
        <h2 class="minigame-title">수학 보드 게임</h2>
        <p class="minigame-description">주사위를 굴려 문제를 풀고 보물을 찾아보세요!</p>
        <button id="minigame-button" class="minigame-button">보드게임 하기</button>
    `;
    
    // 메인 화면에 미니게임 컨테이너 추가
    treasureSection.after(minigameContainer);
    
    // 미니게임 버튼에 이벤트 리스너 추가
    document.getElementById('minigame-button').addEventListener('click', () => {
        soundEffects.play('buttonClick');
        startBoardGame();
    });
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
    document.getElementById('division-game').addEventListener('click', () => {
        soundEffects.play('buttonClick');
        startGame('division');
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
    
    if (gameState.treasures.length === 0) {
        treasuresGrid.innerHTML = '<p>아직 모은 보물이 없어요. 게임에서 승리해서 보물을 모아보세요!</p>';
    } else {
        gameState.treasures.forEach(treasure => {
            const treasureItem = document.createElement('div');
            treasureItem.className = 'treasure-item';
            treasureItem.textContent = treasure.icon;
            treasureItem.title = treasure.name;
            treasuresGrid.appendChild(treasureItem);
        });
    }
    
    document.getElementById('treasure-modal').classList.remove('hidden');
}

// 게임 시작
function startGame(gameType) {
    gameState.currentGame = gameType;
    gameState.score = 0;
    gameState.currentLevel = 1;
    gameState.correctAnswers = 0;
    gameState.monsterHealth = 100;
    
    // 메인 화면 숨기기
    document.querySelector('.container').classList.add('hidden');
    
    // 게임 화면 준비 및 표시
    const gameContainer = document.getElementById('game-container');
    gameContainer.classList.remove('hidden');
    
    // 게임 화면 구성
    setupGameScreen(gameType);
    
    // 첫 번째 문제 생성
    generateProblem();
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
        case 'division':
            gameTitle = '나눗셈 게임';
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
            <div class="options-container" id="options-container"></div>
            
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
        case 'division':
            ({ problem, options, correctAnswer } = generateDivisionProblem());
            break;
    }
    
    // 문제 표시
    problemDisplay.textContent = problem;
    
    // 힌트 텍스트 숨기기
    document.getElementById('hint-text').classList.add('hidden');
    
    // 보기 버튼 생성
    optionsContainer.innerHTML = '';
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        
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

// 나눗셈 문제 생성
function generateDivisionProblem() {
    // 초등학생 수준의 나눗셈 문제를 생성합니다
    // 결과가 정수인 간단한 나눗셈만 사용합니다
    const maxDivisor = Math.min(5 + Math.floor(gameState.currentLevel / 2), 10);
    const divisor = Math.floor(Math.random() * maxDivisor) + 1;
    
    // 몫은 1에서 10까지의 정수로 제한
    const quotient = Math.floor(Math.random() * 10) + 1;
    
    // 피제수 = 제수 × 몫 (나머지 없는 나눗셈을 위해)
    const dividend = divisor * quotient;
    
    const problem = `${dividend} ÷ ${divisor} = ?`;
    const correctAnswer = quotient;
    
    // 보기 생성 (정답 + 3개의 오답)
    const options = [correctAnswer];
    while (options.length < 4) {
        // 정답에서 -2부터 +3까지의 값을 오답으로 생성
        const offset = Math.floor(Math.random() * 6) - 2;
        const wrongAnswer = correctAnswer + offset;
        
        if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    // 보기 섞기
    shuffleArray(options);
    
    return { problem, options, correctAnswer };
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
    const isCorrect = parseInt(selectedAnswer) === correctAnswer;
    
    if (isCorrect) {
        // 정답 처리
        handleCorrectAnswer();
    } else {
        // 오답 처리
        handleWrongAnswer(correctAnswer);
    }
}

// 정답 처리
function handleCorrectAnswer() {
    // 효과음 재생
    soundEffects.play('correct');
    
    // 점수 증가
    gameState.score += 10;
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
        setTimeout(completeLevel, 800);
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
    // 효과음 재생
    soundEffects.play('wrong');
    
    let correctAnswerText;
    
    if (gameState.currentGame === 'division') {
        correctAnswerText = correctAnswer;
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
        case 'division':
            hintMessage = '큰 숫자를 작은 숫자로 나누면 몇 번 들어갈까요?';
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
    saveGameData();
    
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

// 보드 게임 시작
function startBoardGame() {
    // 메인 화면 숨기기
    document.querySelector('.container').classList.add('hidden');
    
    // 미니게임 화면 생성
    const gameContainer = document.createElement('div');
    gameContainer.id = 'minigame-container';
    gameContainer.className = 'game-container';
    
    gameContainer.innerHTML = `
        <div class="game-header">
            <button class="back-button">← 메인으로</button>
            <h2 class="game-title">수학 보드 게임</h2>
            <div class="score">점수: <span id="minigame-score">0</span></div>
        </div>
        
        <div class="board-game-container" id="board-game">
            <div class="board-info">
                <div class="player-info">
                    <div class="player-avatar">🧒</div>
                    <div class="player-position">위치: <span id="player-position">0</span>칸</div>
                </div>
                <div class="dice-container">
                    <div class="dice" id="dice">🎲</div>
                    <button id="roll-dice" class="roll-button">주사위 굴리기</button>
                </div>
            </div>
            <div class="board-grid" id="board-grid">
                <!-- 보드판은 JavaScript로 동적 생성됩니다 -->
            </div>
            <div class="game-message" id="game-message">
                주사위를 굴려 게임을 시작하세요!
            </div>
        </div>
        
        <div class="minigame-instructions">
            <p>주사위를 굴려 보드판을 진행하세요.</p>
            <p>🎁 보물 칸, ❓ 문제 칸, ⚡ 함정 칸, 🌟 보너스 칸이 있어요!</p>
            <p>보드판을 한 바퀴 돌면 보물을 1개 얻을 수 있어요!</p>
        </div>
    `;
    
    document.body.appendChild(gameContainer);
    
    // 뒤로 가기 버튼 이벤트 리스너
    gameContainer.querySelector('.back-button').addEventListener('click', () => {
        soundEffects.play('buttonClick');
        document.body.removeChild(gameContainer);
        document.querySelector('.container').classList.remove('hidden');
    });
    
    // 보드게임 초기화
    initializeBoardGame();
}

// 보드 게임 초기화
function initializeBoardGame() {
    const boardGrid = document.getElementById('board-grid');
    const diceButton = document.getElementById('roll-dice');
    const gameMessage = document.getElementById('game-message');
    
    // 게임 상태
    const boardGame = {
        totalCells: 20,
        playerPosition: 0,
        score: 0,
        hasRolled: false,
        gameOver: false
    };
    
    // 보드판 생성
    createBoardGrid();
    
    // 주사위 굴리기 버튼 이벤트 리스너
    diceButton.addEventListener('click', () => {
        if (boardGame.gameOver) return;
        
        soundEffects.play('buttonClick');
        rollDice();
    });
    
    // 보드판 생성 함수
    function createBoardGrid() {
        boardGrid.innerHTML = '';
        
        // 보드판 셀 타입
        const cellTypes = [
            {type: 'normal', icon: '🔢', frequency: 0.5},
            {type: 'treasure', icon: '🎁', frequency: 0.1},
            {type: 'question', icon: '❓', frequency: 0.2},
            {type: 'trap', icon: '⚡', frequency: 0.1},
            {type: 'bonus', icon: '🌟', frequency: 0.1}
        ];
        
        // 시작 지점 추가
        const startCell = document.createElement('div');
        startCell.className = 'board-cell start-cell';
        startCell.textContent = '🏠';
        startCell.dataset.position = 0;
        startCell.dataset.type = 'start';
        boardGrid.appendChild(startCell);
        
        // 나머지 칸 랜덤 생성
        for (let i = 1; i <= boardGame.totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'board-cell';
            cell.dataset.position = i;
            
            // 랜덤 타입 선택
            let typeChoice = Math.random();
            let accumulatedFrequency = 0;
            let selectedType;
            
            for (const cellType of cellTypes) {
                accumulatedFrequency += cellType.frequency;
                if (typeChoice <= accumulatedFrequency) {
                    selectedType = cellType;
                    break;
                }
            }
            
            cell.dataset.type = selectedType.type;
            cell.textContent = selectedType.icon;
            boardGrid.appendChild(cell);
        }
        
        // 플레이어 위치 표시
        updatePlayerPosition(0);
    }
    
    // 주사위 굴리기
    function rollDice() {
        // 주사위 애니메이션
        const dice = document.getElementById('dice');
        dice.classList.add('rolling');
        diceButton.disabled = true;
        
        // 랜덤 주사위 값
        setTimeout(() => {
            const diceValue = Math.floor(Math.random() * 6) + 1;
            dice.textContent = getDiceEmoji(diceValue);
            dice.classList.remove('rolling');
            
            // 플레이어 이동
            const newPosition = (boardGame.playerPosition + diceValue) % (boardGame.totalCells + 1);
            movePlayer(newPosition);
            
            // 다음 주사위 굴리기 활성화
            setTimeout(() => {
                diceButton.disabled = false;
            }, 1500);
        }, 800);
    }
    
    // 주사위 이모지
    function getDiceEmoji(value) {
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceEmojis[value - 1];
    }
    
    // 플레이어 이동
    function movePlayer(newPosition) {
        // 한바퀴 돌았는지 체크
        if (newPosition < boardGame.playerPosition) {
            // 시작점 지나침 (한바퀴 완료)
            completeLap();
        }
        
        // 플레이어 위치 업데이트
        updatePlayerPosition(newPosition);
        
        // 현재 칸의 이벤트 실행
        const currentCell = document.querySelector(`.board-cell[data-position="${newPosition}"]`);
        
        if (currentCell) {
            // 칸 타입에 따른 이벤트
            switch (currentCell.dataset.type) {
                case 'start':
                    showMessage('시작 지점에 도착했어요!');
                    break;
                    
                case 'treasure':
                    soundEffects.play('treasure');
                    boardGame.score += 10;
                    showMessage('보물을 찾았어요! 10점을 획득했습니다!');
                    break;
                    
                case 'question':
                    // 수학 문제 출제
                    showQuestion();
                    break;
                    
                case 'trap':
                    soundEffects.play('wrong');
                    boardGame.score = Math.max(0, boardGame.score - 5);
                    showMessage('함정에 빠졌어요! 5점을 잃었습니다.');
                    break;
                    
                case 'bonus':
                    soundEffects.play('levelUp');
                    boardGame.score += 5;
                    showMessage('보너스 칸! 5점을 획득했습니다!');
                    break;
                    
                default:
                    showMessage('일반 칸에 도착했어요.');
                    break;
            }
            
            // 점수 업데이트
            document.getElementById('minigame-score').textContent = boardGame.score;
        }
    }
    
    // 플레이어 위치 업데이트
    function updatePlayerPosition(position) {
        // 이전 위치 표시 제거
        const previousCell = document.querySelector('.board-cell.current');
        if (previousCell) {
            previousCell.classList.remove('current');
        }
        
        // 새 위치 표시
        const currentCell = document.querySelector(`.board-cell[data-position="${position}"]`);
        if (currentCell) {
            currentCell.classList.add('current');
        }
        
        // 위치 업데이트
        boardGame.playerPosition = position;
        document.getElementById('player-position').textContent = position;
    }
    
    // 수학 문제 출제
    function showQuestion() {
        // 랜덤 문제 유형
        const questionTypes = ['addition', 'subtraction', 'multiplication', 'division'];
        const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        let problem, answer;
        
        switch (selectedType) {
            case 'addition':
                const num1 = Math.floor(Math.random() * 20) + 1;
                const num2 = Math.floor(Math.random() * 20) + 1;
                problem = `${num1} + ${num2} = ?`;
                answer = num1 + num2;
                break;
                
            case 'subtraction':
                const minuend = Math.floor(Math.random() * 20) + 10;
                const subtrahend = Math.floor(Math.random() * (minuend - 1)) + 1;
                problem = `${minuend} - ${subtrahend} = ?`;
                answer = minuend - subtrahend;
                break;
                
            case 'multiplication':
                const factor1 = Math.floor(Math.random() * 9) + 1;
                const factor2 = Math.floor(Math.random() * 9) + 1;
                problem = `${factor1} × ${factor2} = ?`;
                answer = factor1 * factor2;
                break;
                
            case 'division':
                const divisor = Math.floor(Math.random() * 9) + 1;
                const quotient = Math.floor(Math.random() * 9) + 1;
                const dividend = divisor * quotient;
                problem = `${dividend} ÷ ${divisor} = ?`;
                answer = quotient;
                break;
        }
        
        // 문제 표시
        const userAnswer = prompt(`${problem} (숫자만 입력하세요)`);
        
        // 정답 확인
        if (userAnswer !== null) {
            if (parseInt(userAnswer) === answer) {
                soundEffects.play('correct');
                boardGame.score += 15;
                showMessage('정답입니다! 15점을 획득했습니다!');
            } else {
                soundEffects.play('wrong');
                showMessage(`틀렸습니다. 정답은 ${answer}입니다.`);
            }
            
            // 점수 업데이트
            document.getElementById('minigame-score').textContent = boardGame.score;
        }
    }
    
    // 한 바퀴 완료
    function completeLap() {
        soundEffects.play('levelUp');
        showMessage('한 바퀴를 완료했습니다! 보물을 획득했어요!');
        
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
        gameState.usableTreasures++;
        gameState.playerStats.treasuresCollected++;
        saveGameData();
        
        // 결과 모달 표시
        const rewardModal = document.createElement('div');
        rewardModal.className = 'modal';
        rewardModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2 class="reward-title">보물을 획득했어요!</h2>
                <div class="reward-display">${reward.icon}</div>
                <p>계속 게임을 진행할 수 있어요!</p>
                <button class="modal-button">계속하기</button>
            </div>
        `;
        
        document.body.appendChild(rewardModal);
        
        // 모달 닫기 이벤트 리스너
        rewardModal.querySelector('.close-button').addEventListener('click', () => {
            document.body.removeChild(rewardModal);
        });
        
        rewardModal.querySelector('.modal-button').addEventListener('click', () => {
            document.body.removeChild(rewardModal);
        });
        
        // 보너스 점수
        boardGame.score += 20;
        document.getElementById('minigame-score').textContent = boardGame.score;
    }
    
    // 메시지 표시
    function showMessage(message) {
        gameMessage.textContent = message;
        
        // 메시지 강조 애니메이션
        gameMessage.classList.add('highlight');
        setTimeout(() => {
            gameMessage.classList.remove('highlight');
        }, 1000);
    }
}

// 보석 잡기 게임 설정 (삭제)
function startGemsGame() {
    // 이 함수는 더 이상 사용되지 않습니다
    // 대신 보드 게임으로 대체되었습니다
    startBoardGame();
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
        
        // 10단위 레벨 달성시 간식쿠폰 지급
        let couponMessage = '';
        if (gameState.playerStats.currentLevel % 10 === 0) {
            gameState.snackCoupons++;
            couponMessage = `
                <div class="coupon-message">
                    <p>🎉 레벨 ${gameState.playerStats.currentLevel} 달성 축하해요! 🎉</p>
                    <p>1만원 간식쿠폰을 획득했어요! (총 ${gameState.snackCoupons}개)</p>
                    <p class="coupon-note">※ 간식쿠폰은 부모님께 요청하세요.</p>
                </div>
            `;
        }
        
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
                ${couponMessage}
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
        
        // 리더보드 업데이트
        updateLeaderboard();
        
        // 게임 데이터 저장
        saveGameData();
        
        // 보물상자 UI 업데이트
        openTreasureBox();
    } else {
        alert('레벨업을 위해서는 보물이 3개 이상 필요합니다!');
    }
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
            
            <div class="coupon-container">
                <h3>나의 간식쿠폰</h3>
                <div class="coupon-display">
                    <div class="coupon-count">${gameState.snackCoupons}</div>
                    <div class="coupon-label">🍭 간식쿠폰 (1만원)</div>
                    <p class="coupon-note">※ 간식쿠폰은 부모님께 요청하세요.</p>
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
                        <div class="history-label">나눗셈 게임:</div>
                        <div class="history-value">${gameState.gameHistory.division || 0}회</div>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-buttons">
                <button id="leaderboard-button" class="dashboard-button">친구들 순위 보기</button>
                <button class="modal-button">닫기</button>
            </div>
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
    
    // 리더보드 버튼에 이벤트 리스너 추가
    dashboardModal.querySelector('#leaderboard-button').addEventListener('click', () => {
        document.body.removeChild(dashboardModal);
        showLeaderboard();
    });
}

// 리더보드 기능 추가
function updateLeaderboard() {
    // 현재 플레이어의 기록 찾기
    const playerIndex = gameState.leaderboard.findIndex(player => player.name === gameState.playerName);
    
    if (playerIndex !== -1) {
        // 기존 플레이어 업데이트
        gameState.leaderboard[playerIndex] = {
            name: gameState.playerName,
            level: gameState.playerStats.currentLevel,
            score: gameState.playerStats.totalScore
        };
    } else {
        // 새 플레이어 추가
        gameState.leaderboard.push({
            name: gameState.playerName,
            level: gameState.playerStats.currentLevel,
            score: gameState.playerStats.totalScore
        });
    }
    
    // 레벨 순으로 정렬 (레벨이 같으면 점수 순)
    gameState.leaderboard.sort((a, b) => {
        if (b.level === a.level) {
            return b.score - a.score;
        }
        return b.level - a.level;
    });
    
    saveGameData();
}

// 리더보드 표시
function showLeaderboard() {
    const leaderboardModal = document.createElement('div');
    leaderboardModal.className = 'modal';
    leaderboardModal.id = 'leaderboard-modal';
    
    // 리더보드 HTML 생성
    let leaderboardHTML = '';
    
    if (gameState.leaderboard.length === 0) {
        leaderboardHTML = '<p class="no-data">아직 리더보드 데이터가 없습니다.</p>';
    } else {
        leaderboardHTML = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>순위</th>
                        <th>이름</th>
                        <th>레벨</th>
                        <th>점수</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        gameState.leaderboard.forEach((player, index) => {
            const isCurrentPlayer = player.name === gameState.playerName;
            leaderboardHTML += `
                <tr class="${isCurrentPlayer ? 'current-player' : ''}">
                    <td>${index + 1}</td>
                    <td>${player.name}${isCurrentPlayer ? ' (나)' : ''}</td>
                    <td>${player.level}</td>
                    <td>${player.score}</td>
                </tr>
            `;
        });
        
        leaderboardHTML += `
                </tbody>
            </table>
        `;
    }
    
    leaderboardModal.innerHTML = `
        <div class="modal-content leaderboard-content">
            <span class="close-button">&times;</span>
            <h2>친구들 순위</h2>
            <div class="leaderboard-container">
                ${leaderboardHTML}
            </div>
            <div class="leaderboard-note">
                <p>더 많은 문제를 풀고 레벨을 올려서 1등을 해보세요!</p>
            </div>
            <button class="modal-button">닫기</button>
        </div>
    `;
    
    document.body.appendChild(leaderboardModal);
    
    // 모달 닫기 버튼에 이벤트 리스너 추가
    leaderboardModal.querySelector('.close-button').addEventListener('click', () => {
        document.body.removeChild(leaderboardModal);
        showDashboard(); // 대시보드로 돌아가기
    });
    
    leaderboardModal.querySelector('.modal-button').addEventListener('click', () => {
        document.body.removeChild(leaderboardModal);
        showDashboard(); // 대시보드로 돌아가기
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

/* 로그인 관련 스타일 */
.login-status {
    padding: 10px 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    background-color: #f5f7ff;
    display: flex;
    justify-content: center;
}

.logged-in-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-name {
    font-weight: bold;
    color: #4a6cd4;
}

.level-info {
    color: #666;
}

.dashboard-button, .logout-button, .login-button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    background-color: #6983e0;
    color: white;
    cursor: pointer;
    font-family: 'Gaegu', cursive;
    transition: background-color 0.3s;
}

.dashboard-button:hover, .logout-button:hover, .login-button:hover {
    background-color: #4a6cd4;
}

.login-prompt {
    display: flex;
    gap: 10px;
    align-items: center;
}

#player-name {
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: 'Gaegu', cursive;
}

.coupon-container {
    margin-top: 20px;
    background-color: #fff8e6;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.coupon-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.coupon-count {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ff9900;
}

.coupon-label {
    font-size: 1.2rem;
    color: #333;
}

.coupon-note {
    font-size: 0.8rem;
    color: #888;
    margin-top: 5px;
}

.coupon-message {
    background-color: #fff8e6;
    border-radius: 10px;
    padding: 15px;
    margin-top: 15px;
    text-align: center;
    border: 2px dashed #ffcc66;
}

/* 리더보드 스타일 */
.leaderboard-content {
    max-width: 600px;
}

.leaderboard-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
}

.leaderboard-table th, .leaderboard-table td {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #eee;
}

.leaderboard-table th {
    background-color: #f5f7ff;
    color: #4a6cd4;
    font-weight: bold;
}

.leaderboard-table .current-player {
    background-color: #fffbea;
    font-weight: bold;
}

.no-data {
    text-align: center;
    color: #888;
    margin: 20px 0;
}

.leaderboard-note {
    margin-top: 15px;
    text-align: center;
    color: #666;
    font-size: 0.9rem;
}

/* 미니게임 스타일 */
.minigame-container {
    margin-top: 30px;
    padding: 20px;
    background-color: #f5f8ff;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.minigame-title {
    color: #4a6cd4;
    margin-bottom: 10px;
}

.minigame-description {
    color: #666;
    margin-bottom: 15px;
}

.minigame-button {
    background-color: #6983e0;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-family: 'Gaegu', cursive;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.minigame-button:hover {
    background-color: #4a6cd4;
}

.game-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.back-button {
    background-color: #6983e0;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}

.gems-game-container {
    width: 100%;
    height: 400px;
    background-color: #f5f8ff;
    border: 2px solid #4a6cd4;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
}

.player-character {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    user-select: none;
}

.gem {
    position: absolute;
    font-size: 1.5rem;
    user-select: none;
}

.gems-score, .gems-time {
    position: absolute;
    top: 10px;
    padding: 5px 10px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    font-size: 0.9rem;
}

.gems-score {
    left: 10px;
}

.gems-time {
    right: 10px;
}

.minigame-instructions {
    margin-top: 15px;
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    font-size: 0.9rem;
    line-height: 1.4;
}

.reward-display {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin: 15px 0;
    font-size: 2rem;
}

/* 보드게임 스타일 */
.board-game-container {
    width: 100%;
    padding: 15px;
    background-color: #f5f8ff;
    border-radius: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
}

.board-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.player-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.player-avatar {
    font-size: 2rem;
}

.player-position {
    background-color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
}

.dice-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.dice {
    font-size: 3rem;
    transition: transform 0.5s;
}

.dice.rolling {
    animation: roll 0.8s ease-in-out;
}

.roll-button {
    padding: 8px 15px;
    background-color: #6983e0;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Gaegu', cursive;
}

.roll-button:hover {
    background-color: #4a6cd4;
}

.roll-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.board-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
    margin-bottom: 15px;
}

.board-cell {
    width: 60px;
    height: 60px;
    background-color: #fff;
    border: 2px solid #ddd;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    transition: all 0.3s;
}

.board-cell.current {
    border-color: #ff9900;
    background-color: #fffbea;
    box-shadow: 0 0 10px rgba(255, 153, 0, 0.5);
    transform: scale(1.05);
}

.start-cell {
    background-color: #e6ffea;
    border-color: #00cc66;
}

.game-message {
    padding: 10px;
    background-color: #fff;
    border-radius: 5px;
    text-align: center;
    min-height: 40px;
    transition: all 0.3s;
}

.game-message.highlight {
    background-color: #fffbea;
    font-weight: bold;
    transform: scale(1.02);
}

@keyframes roll {
    0% { transform: rotate(0deg); }
    25% { transform: rotate(90deg); }
    50% { transform: rotate(180deg); }
    75% { transform: rotate(270deg); }
    100% { transform: rotate(360deg); }
}

/* 모바일 대응 */
@media (max-width: 768px) {
    .board-grid {
        grid-template-columns: repeat(5, 1fr);
    }
    
    .board-cell {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
    }
}

@media (max-width: 480px) {
    .board-grid {
        grid-template-columns: repeat(4, 1fr);
    }
    
    .board-cell {
        width: 40px;
        height: 40px;
        font-size: 1rem;
    }
}
</style>
`); 