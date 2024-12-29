import './index.scss';

import { swapCurrencies } from "../components/swap";

const sourceInput = document.querySelector('.currency__value.source');
const resultInput = document.querySelector('.currency__value.result');
const sourceInfo = document.querySelector('.currency__info.source');
const resultInfo = document.querySelector('.currency__info.result');
const sourceRadios = document.querySelectorAll('.radio__input[name="source"]');
const resultRadios = document.querySelectorAll('.radio__input[name="result"]');
const swapButton = document.querySelector('.swap-button');

const symbol = {
  'RUB': '₽',
  'USD': '$',
  'EUR': '€',
};

// Замена точки на запятую
function formatValue(value) {
  return value.toString().replace(/\./g, ',');
}

// Ограничение нажатия клавиш для контроля за вводимыми данными
function handleKeyDown(event) {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ',', '.'];
  const isDigit = /\d/.test(event.key);

  if (!isDigit && !allowedKeys.includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === ',') {
    const value = event.target.value;
    if (value.includes(',')) {
      event.preventDefault();
    }
  }
}

// Форматирование: Удаление любых символов кроме цифр и одной запятой
function handleInput(event) {
  let value = event.target.value;

  value = value.replace(/[^\d,\.]/g, '').replace(/\./g, ',');

  const parts = value.split(',');
  console.log('parts', parts);
  
  if (parts.length > 2) {
    value = parts[0] + ',' + parts.slice(1).join('');
  }

  event.target.value = value;
}

// Ограничение ввода в поле
function validateInput(inputElement) {
  inputElement.addEventListener('keydown', handleKeyDown);
  inputElement.addEventListener('input', handleInput);
}

// Получение данных курса
async function fetchExchangeRate(from, to, amount) {
  const amountWithDot = String(amount).replace(',', '.');
  const response = await fetch(`https://currency-converter.hopto.org/api/convert?from=${from}&to=${to}&amount=${amountWithDot}`);
    const data = await response.json();
  return data;
}

// Обновление данных конвертации
async function updateConversion(start = 'left') {

  let sourceValue = sourceInput.value.trim();
  let resultValue = resultInput.value.trim();
  const sourceCurrency = document.querySelector('.radio__input[name="source"]:checked').value.toUpperCase();
  const resultCurrency = document.querySelector('.radio__input[name="result"]:checked').value.toUpperCase();

  let initialValue;
  let fromCurrency;
  let toCurrency;

  if (start === 'right') {
    initialValue = resultValue;
    fromCurrency = resultCurrency;
    toCurrency = sourceCurrency;
  } else {
    initialValue = sourceValue;
    fromCurrency = sourceCurrency;
    toCurrency = resultCurrency;
  }

  if (!initialValue || initialValue === ',' || initialValue <= 0) {
    start === 'right' 
      ? sourceInput.value = '' 
      : resultInput.value = '';
    sourceInfo.textContent = '';
    resultInfo.textContent = '';
    return;
  }

  if (initialValue.includes(',') && !/\d/.test(initialValue.split(',')[1])) {
    return;
  }

  const numericValue = parseFloat(initialValue.replace(',', '.'));

  if (isNaN(numericValue) || sourceCurrency === resultCurrency) {
    resultInput.value = formatValue(initialValue);
    sourceInfo.textContent = formatValue(`1 ${symbol[sourceCurrency]} = 1 ${symbol[resultCurrency]}`);
    resultInfo.textContent = formatValue(`1 ${symbol[resultCurrency]} = 1 ${symbol[sourceCurrency]}`);
    return;
  }

  try {
    const data = await fetchExchangeRate(fromCurrency, toCurrency, initialValue);

    if (start === 'right') {
      sourceInput.value = formatValue(data.result.toFixed(2));
    } else {
      resultInput.value = formatValue(data.result.toFixed(2));
    }

    const rate = data.info.rate;
    sourceInfo.textContent = formatValue(`1 ${symbol[fromCurrency]} = ${rate.toFixed(2)} ${symbol[toCurrency]}`);
    resultInfo.textContent = formatValue(`1 ${symbol[toCurrency]} = ${(1 / rate).toFixed(2)} ${symbol[fromCurrency]}`);
  } catch (error) {
    console.error('Ошибка получения данных:', error);
  }
}

// Инвертирование по кнопке
swapButton.addEventListener('click', () => {
  swapCurrencies();
  updateConversion();
});

// Обработчики для изменения радиокнопок и ввода значений
sourceRadios.forEach((radio) => radio.addEventListener('change', updateConversion));
resultRadios.forEach((radio) => radio.addEventListener('change', updateConversion));

sourceInput.addEventListener('input', updateConversion);
// sourceInput.addEventListener('input', () => updateConversion('left'));
resultInput.addEventListener('input', () => updateConversion('right'));

validateInput(sourceInput);
validateInput(resultInput);

updateConversion();
