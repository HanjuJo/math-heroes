// 게임 상태 관리
const gameState = {
    currentGame: null,
    score: 0,
    currentLevel: 1,
    maxLevel: 5,
    correctAnswers: 0,
    requiredCorrectAnswers: 3,
    treasures: [],
    monsterHealth: 100,
    gameHistory: {}
};

// 로컬 스토리지에서 게임 데이터 불러오기
function loadGameData() {
    const savedData = localStorage.getItem('mathHeroesData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        gameState.treasures = parsedData.treasures || [];
        gameState.gameHistory = parsedData.gameHistory || {};
    }
}

// 게임 데이터 저장하기
function saveGameData() {
    const dataToSave = {
        treasures: gameState.treasures,
        gameHistory: gameState.gameHistory
    };
    localStorage.setItem('mathHeroesData', JSON.stringify(dataToSave));
}

// 게임 초기화
function initializeGame() {
    loadGameData();
    setupEventListeners();
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 게임 카드 클릭 이벤트
    document.getElementById('addition-game').addEventListener('click', () => startGame('addition'));
    document.getElementById('subtraction-game').addEventListener('click', () => startGame('subtraction'));
    document.getElementById('multiplication-game').addEventListener('click', () => startGame('multiplication'));
    document.getElementById('clock-game').addEventListener('click', () => startGame('clock'));
    
    // 보물상자 버튼 클릭 이벤트
    document.querySelector('.treasure-button').addEventListener('click', openTreasureBox);
    
    // 모달 닫기 버튼들
    document.querySelectorAll('.close-button, .modal-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });
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
        handleCorrectAnswer();
    } else {
        // 오답 처리
        handleWrongAnswer(correctAnswer);
    }
}

// 정답 처리
function handleCorrectAnswer() {
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
</style>
`); 