class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.initializeButtons();
        this.initializeKeyboard();
    }

    initializeButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target;
                const number = target.dataset.number;
                const operator = target.dataset.operator;
                const action = target.dataset.action;

                if (number) {
                    this.appendNumber(number);
                } else if (operator) {
                    this.chooseOperator(operator);
                } else if (action) {
                    if (action === 'clear') {
                        this.clear();
                    } else if (action === 'delete') {
                        this.delete();
                    } else if (action === 'equals') {
                        this.equals();
                    }
                }

                this.updateDisplay();
            });
        });
    }

    initializeKeyboard() {
        document.addEventListener('keydown', (e) => {
            const key = e.key;

            if (/\d/.test(key)) {
                this.appendNumber(key);
            } else if (['+', '-', '*', '/'].includes(key)) {
                this.chooseOperator(key);
            } else if (key === 'Enter' || key === '=') {
                e.preventDefault();
                this.equals();
            } else if (key === 'Backspace') {
                this.delete();
            } else if (key === 'Escape') {
                this.clear();
            } else if (key === '.') {
                this.appendNumber('.');
            }

            this.updateDisplay();
        });
    }

    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = number;
            this.shouldResetDisplay = false;
        } else {
            if (number === '.' && this.currentInput.includes('.')) return;
            this.currentInput = this.currentInput === '0' ? number : this.currentInput + number;
        }
    }

    chooseOperator(operator) {
        if (this.currentInput === '') return;

        if (this.previousInput !== '') {
            this.equals();
        }

        this.operator = operator;
        this.previousInput = this.currentInput;
        this.currentInput = '';
    }

    equals() {
        if (this.operator === null || this.currentInput === '' || this.previousInput === '') return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        switch (this.operator) {
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
                    this.displayError('Tidak bisa bagi 0');
                    this.clear();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        this.currentInput = result.toString();
        this.operator = null;
        this.previousInput = '';
        this.shouldResetDisplay = true;
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.shouldResetDisplay = false;
    }

    delete() {
        if (this.shouldResetDisplay) return;
        if (this.currentInput.length === 1) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
    }

    displayError(message) {
        this.display.textContent = message;
        this.display.style.color = '#ff4757';
        
        setTimeout(() => {
            this.display.style.color = '#ffffff';
        }, 2000);
    }

    updateDisplay() {
        this.display.textContent = this.currentInput;
        
        // Add animation effect
        this.display.style.animation = 'none';
        this.display.offsetHeight; /* trigger reflow */
        this.display.style.animation = 'pulse 0.3s ease';
    }

    run() {
        console.log('Calculator initialized successfully');
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    calculator.run();
});