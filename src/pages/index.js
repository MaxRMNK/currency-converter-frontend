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

// Получение данных курса валют
async function fetchExchangeRate(from, to, amount) {
  // Наше API (расскоментить при готовом бэке)
  const response = await fetch(`https://currency-converter.hopto.org/api/convert?from=${from}&to=${to}&amount=${amount}`);

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

// Обновление данных конвертации
async function updateConversion(start = 'left') {
  const sourceValue = parseFloat(document.querySelector('.currency__value.source').value) || 0;
  const resultValue = parseFloat(document.querySelector('.currency__value.result').value) || 0;
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


  if (initialValue <= 0) {
    start === 'right' 
      ? sourceInput.value = 0 
      : resultInput.value = 0;
    sourceInfo.textContent = '';
    resultInfo.textContent = '';
    return;
  } 

  if (sourceCurrency === resultCurrency) {
    resultInput.value = initialValue;
    sourceInfo.textContent = `1 ${symbol[sourceCurrency]} = 1 ${symbol[resultCurrency]}`;
    resultInfo.textContent = `1 ${symbol[resultCurrency]} = 1 ${symbol[sourceCurrency]}`;
    return;
  }

  try {
    const data = await fetchExchangeRate(fromCurrency, toCurrency, initialValue);

    if (start === 'right') {
      sourceInput.value = data.result.toFixed(2);
    } else {
      resultInput.value = data.result.toFixed(2);
    }

    const rate = data.info.rate;
    sourceInfo.textContent = `1 ${symbol[fromCurrency]} = ${rate.toFixed(2)} ${symbol[toCurrency]}`;
    resultInfo.textContent = `1 ${symbol[toCurrency]} = ${(1 / rate).toFixed(2)} ${symbol[fromCurrency]}`;
  } catch (error) {
    console.error('Ошибка получения данных:', error);
  }
}

// Инвертирование по кнопке
swapButton.addEventListener('click', () => {
  swapCurrencies();
  updateConversion();
  // console.log('Swap button clicked');
});

// Обработчики для изменения радиокнопок и ввода значений
sourceRadios.forEach((radio) => radio.addEventListener('change', updateConversion));
resultRadios.forEach((radio) => radio.addEventListener('change', updateConversion));

sourceInput.addEventListener('input', updateConversion);
// sourceInput.addEventListener('input', () => updateConversion('left'));
resultInput.addEventListener('input', () => updateConversion('right'));

updateConversion();
