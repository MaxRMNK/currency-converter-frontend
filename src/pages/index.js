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
async function updateConversion() {
  const sourceValue = parseFloat(document.querySelector('.currency__value.source').value) || 0;
  const sourceCurrency = document.querySelector('.radio__input[name="source"]:checked').value.toUpperCase();
  const resultCurrency = document.querySelector('.radio__input[name="result"]:checked').value.toUpperCase();
  // const amount = parseFloat(sourceInput.value) || 0;

  if (sourceCurrency === resultCurrency || sourceValue <= 0) {
    resultInput.value = sourceValue;
    sourceInfo.textContent = `1 ${sourceCurrency} = 1 ${resultCurrency}`;
    resultInfo.textContent = `1 ${resultCurrency} = 1 ${sourceCurrency}`;
    return;
  }

  try {
    const data = await fetchExchangeRate(sourceCurrency, resultCurrency, sourceValue);
    const rate = data.info.rate;
    resultInput.value = data.result.toFixed(2);
    sourceInfo.textContent = `1 ${sourceCurrency} = ${rate.toFixed(2)} ${resultCurrency}`;
    resultInfo.textContent = `1 ${resultCurrency} = ${(1 / rate).toFixed(2)} ${sourceCurrency}`;
  } catch (error) {
    console.error('Ошибка получения данных:', error);
  }
}

// Инвертирование по кнопке
swapButton.addEventListener('click', () => {
  swapCurrencies;
  updateConversion();
  // console.log('Swap button clicked');
});
// swapButton.addEventListener('click', swapCurrencies);

// Обработчики для изменения радиокнопок и ввода значений
sourceRadios.forEach((radio) => radio.addEventListener('change', updateConversion));
resultRadios.forEach((radio) => radio.addEventListener('change', updateConversion));
sourceInput.addEventListener('input', updateConversion);

updateConversion();
