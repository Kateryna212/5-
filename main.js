const resultInput = document.getElementById('result');
const buttons = document.querySelector('.buttons');

let currentInput = '0'; // Число, що зараз вводиться
let operator = null;    // Поточний оператор
let previousInput = null; // Результат попередньої операції
let shouldResetDisplay = false; // Прапор для скидання дисплея при наступному введенні числа

// Оновити дисплей з поточним введенням
function updateDisplay() {
    resultInput.value = currentInput;
}

// Обробити введення числа та десяткової коми
function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        // Якщо поточне введення '0', замінити його новим числом (крім десяткової коми)
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else {
            // Не дозволяти кілька десяткових ком
            if (num === '.' && currentInput.includes('.')) {
                return;
            }
            currentInput += num;
        }
    }
    updateDisplay();
}

// Обробити введення оператора
function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    // Якщо є попереднє обчислення, яке очікує на виконання, обчислити його спочатку
    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const result = calculate();
        
        if (result === null) return; // Виникла помилка
        
        currentInput = String(result);
        previousInput = result;
        updateDisplay();
    }

    shouldResetDisplay = true;
    operator = nextOperator;
}

// Виконати обчислення на основі поточного оператора
function calculate() {
    const prev = previousInput;
    const current = parseFloat(currentInput);

    if (prev === null || operator === null) {
        return null;
    }

    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Помилка: Ділення на нуль!');
                clear();
                return null;
            }
            result = prev / current;
            break;
        default:
            return null;
    }

    // Округлити для запобігання проблем з точністю чисел з плаваючою комою
    result = Math.round(result * 100000000) / 100000000;
    
    return result;
}

// Обробити кнопку дорівнює
function equals() {
    if (operator === null || previousInput === null) {
        return;
    }

    const result = calculate();
    
    if (result === null) return; // Виникла помилка

    currentInput = String(result);
    previousInput = null;
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Очистити стан калькулятора
function clear() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Обробити натискання кнопок
function handleButtonClick(target) {
    const value = target.getAttribute('data-value');
    
    if (!value) return;

    // Обробити числа та десяткову кому
    if (!isNaN(value) || value === '.') {
        inputNumber(value);
    }
    // Обробити оператори
    else if (['+', '-', '*', '/'].includes(value)) {
        inputOperator(value);
    }
    // Обробити дорівнює
    else if (value === '=') {
        equals();
    }
    // Обробити очищення
    else if (value === 'C') {
        clear();
    }
}

// Додати обробник подій до контейнера кнопок (делегування подій)
buttons.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        handleButtonClick(e.target);
    }
});

// Додати підтримку клавіатури
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    
    const key = e.key;
    
    // Числа та десяткова кома
    if (!isNaN(key) || key === '.') {
        inputNumber(key);
    }
    // Оператори
    else if (key === '+') {
        inputOperator('+');
    }
    else if (key === '-') {
        inputOperator('-');
    }
    else if (key === '*') {
        inputOperator('*');
    }
    else if (key === '/') {
        inputOperator('/');
    }
    // Дорівнює
    else if (key === 'Enter' || key === '=') {
        equals();
    }
    // Очищення
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clear();
    }
    // Backspace (видалити останню цифру)
    else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});

// Ініціалізувати дисплей
updateDisplay();
