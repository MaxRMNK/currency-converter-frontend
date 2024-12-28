import './index.scss';

import { swapCurrencies } from "../swap";

const sourceInput = document.querySelector('.currency__value.source');
const resultInput = document.querySelector('.currency__value.result');
const sourceInfo = document.querySelector('.currency__info.source');
const resultInfo = document.querySelector('.currency__info.result');
const sourceRadios = document.querySelectorAll('.radio__input[name="source"]');
const resultRadios = document.querySelectorAll('.radio__input[name="result"]');
const swapButton = document.querySelector('.swap-button');

// Получение данных курса валют
async function fetchExchangeRate(from, to, amount) {
  // Преобразование запятой в точку перед отправкой
  const amountWithDot = String(amount).replace(',', '.');

  // Наше API (расскоментить при готовом бэке)
  const response = await fetch(`https://currency-converter.hopto.org/api/convert?from=${from}&to=${to}&amount=${amountWithDot}`);
  
  // Тестовый API удалить строчки от сюда
  // const myHeaders = new Headers();
  // myHeaders.append("apikey", "o6ucw6SxuL6ioWLv6DYCzmYMuXndpfgG");

  // const requestOptions = {
  //   method: 'GET',
  //   redirect: 'follow',
  //   headers: myHeaders,
  // };

  // const response = await fetch(
  //   `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
  //   requestOptions
  // );
  // до сюда

  const data = await response.json();
  return data;
}

// Замена точки на запятую
function formatValue(value) {
  return value.toString().replace(/\./g, ',');
}

// Ограничение ввода в поле
function validateInput(inputElement) {
  inputElement.addEventListener('input', (event) => {
    let value = inputElement.value;

    // Удаление всех символы, кроме цифр и запятой
    value = value.replace(/[^\d,]/g, '');

    // Удаление лишних запятых
    const parts = value.split(',');
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }

    inputElement.value = value;
  });
}

// Обновление данных конвертации
async function updateConversion() {
  let sourceValue = sourceInput.value.trim();
  const sourceCurrency = document.querySelector('.radio__input[name="source"]:checked').value.toUpperCase();
  const resultCurrency = document.querySelector('.radio__input[name="result"]:checked').value.toUpperCase();
  // const amount = parseFloat(sourceInput.value) || 0;

  // Проверка, если введенное значение пустое или только запятая
  if (!sourceValue || sourceValue === ',') {
    resultInput.value = '';
    return;
  }

  // Проверка, если после запятой нет цифры не отправляем запрос
  if (sourceValue.includes(',') && !/\d/.test(sourceValue.split(',')[1])) {
    return;
  }

  // Преобразование строки в число для отправки
  const numericValue = parseFloat(sourceValue.replace(',', '.'));

  if (isNaN(numericValue) || sourceCurrency === resultCurrency) {
    resultInput.value = formatValue(sourceValue);
    sourceInfo.textContent = formatValue(`1 ${sourceCurrency} = 1 ${resultCurrency}`);
    resultInfo.textContent = formatValue(`1 ${resultCurrency} = 1 ${sourceCurrency}`);
    return;
  }

  try {
    const data = await fetchExchangeRate(sourceCurrency, resultCurrency, sourceValue);
    const rate = data.info.rate;
    resultInput.value = formatValue(data.result.toFixed(2));
    sourceInfo.textContent = formatValue(`1 ${sourceCurrency} = ${rate.toFixed(2)} ${resultCurrency}`);
    resultInfo.textContent = formatValue(`1 ${resultCurrency} = ${(1 / rate).toFixed(2)} ${sourceCurrency}`);
  } catch (error) {
    console.error('Ошибка получения данных:', error);
  }
}

// Инвертирование по кнопке
swapButton.addEventListener('click', () => {
  swapCurrencies();
  updateConversion();
});

// swapButton.addEventListener('click', swapCurrencies);

// Обработчики для изменения радиокнопок и ввода значений
sourceRadios.forEach((radio) => radio.addEventListener('change', updateConversion));
resultRadios.forEach((radio) => radio.addEventListener('change', updateConversion));
sourceInput.addEventListener('input', updateConversion);

validateInput(sourceInput);
validateInput(resultInput);

updateConversion();
