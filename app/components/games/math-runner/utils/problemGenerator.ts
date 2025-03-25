export interface Problem {
  question: string;
  answer: number;
  options: number[];
}

// 학년별 문제 범위 설정
const GRADE_RANGES = {
  1: { min: 1, max: 10, operations: ['+', '-'] },
  2: { min: 1, max: 20, operations: ['+', '-'] },
  3: { min: 1, max: 50, operations: ['+', '-', '*'] },
  4: { min: 1, max: 100, operations: ['+', '-', '*', '/'] },
  5: { min: 1, max: 200, operations: ['+', '-', '*', '/'] },
  6: { min: 1, max: 500, operations: ['+', '-', '*', '/'] }
};

// 랜덤 숫자 생성
function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 랜덤 연산자 선택
function getRandomOperation(grade: number): string {
  const operations = GRADE_RANGES[grade as keyof typeof GRADE_RANGES].operations;
  return operations[Math.floor(Math.random() * operations.length)];
}

// 보기 생성
function generateOptions(answer: number, min: number, max: number): number[] {
  const options = [answer];
  while (options.length < 4) {
    const option = getRandomNumber(
      Math.max(min, answer - 10),
      Math.min(max, answer + 10)
    );
    if (!options.includes(option)) {
      options.push(option);
    }
  }
  return options.sort(() => Math.random() - 0.5);
}

// 문제 생성
export function generateProblem(grade: number): Problem {
  const { min, max } = GRADE_RANGES[grade as keyof typeof GRADE_RANGES];
  const operation = getRandomOperation(grade);
  
  let num1: number, num2: number, answer: number;
  
  do {
    num1 = getRandomNumber(min, max);
    num2 = getRandomNumber(min, max);
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      case '/':
        num2 = getRandomNumber(1, 10);
        num1 = num2 * getRandomNumber(1, 10);
        answer = num1 / num2;
        break;
      default:
        answer = 0;
    }
  } while (answer < min || answer > max);

  const question = `${num1} ${operation} ${num2} = ?`;
  const options = generateOptions(answer, min, max);

  return {
    question,
    answer,
    options
  };
} 