interface Problem {
  question: string;
  answer: number;
  options: number[];
}

// 학년별 문제 범위 설정
const GRADE_RANGES = {
  1: { min: 1, max: 10, operations: ['+', '-'] },
  2: { min: 1, max: 20, operations: ['+', '-', '*'] },
  3: { min: 1, max: 50, operations: ['+', '-', '*', '/'] },
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
function generateOptions(answer: number, grade: number): number[] {
  const options = [answer];
  const range = grade <= 2 ? 5 : 10;

  while (options.length < 4) {
    const option = answer + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * range) + 1);
    if (!options.includes(option) && option >= 0) {
      options.push(option);
    }
  }

  return options.sort(() => Math.random() - 0.5);
}

// 문제 생성
export function generateProblem(grade: number): Problem {
  const operations = grade <= 2 ? ['+', '-'] : ['+', '-', '*', '/'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number, num2: number;
  
  switch (grade) {
    case 1:
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      break;
    case 2:
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
      break;
    case 3:
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      break;
    default:
      num1 = Math.floor(Math.random() * 100) + 1;
      num2 = Math.floor(Math.random() * 100) + 1;
  }

  let answer: number;
  let question: string;

  switch (operation) {
    case '+':
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case '-':
      if (num1 < num2) [num1, num2] = [num2, num1];
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;
    case '*':
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    case '/':
      answer = num1;
      num1 = num1 * num2;
      question = `${num1} ÷ ${num2} = ?`;
      break;
    default:
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
  }

  const options = generateOptions(answer, grade);

  return {
    question,
    answer,
    options
  };
} 