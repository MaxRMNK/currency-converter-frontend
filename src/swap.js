const swapButton = document.querySelector('.swap-button');
const sourceRadios = document.querySelectorAll('input[name="source"]');
const resultRadios = document.querySelectorAll('input[name="result"]');

let valueSource = Array.from(sourceRadios).find((radio) => radio.checked).value;
let valueResult = Array.from(resultRadios).find((radio) => radio.checked).value;


export function swapCurrencies() {
  let selectedSource = Array.from(sourceRadios).find((radio) => radio.checked);
  let selectedResult = Array.from(resultRadios).find((radio) => radio.checked);

  if (selectedSource && selectedResult) {
    const tempValue = selectedSource.value;

    selectedSource.checked = false;
    selectedResult.checked = false;

    Array.from(sourceRadios).find(
      (radio) => radio.value === selectedResult.value
    ).checked = true;

    Array.from(resultRadios).find(
      (radio) => radio.value === tempValue
    ).checked = true;
  }
}

function preventSameCurrency(event) {
  const sourceChecked = Array.from(sourceRadios).find((radio) => radio.checked);
  const resultChecked = Array.from(resultRadios).find((radio) => radio.checked);

  if (
    event.target.name === 'source' &&
    sourceChecked.value === resultChecked.value
  ) {
    const newResult = Array.from(resultRadios).find(
      (radio) => radio.value === valueSource
    );
  
    if (newResult) {
      newResult.checked = true;
      valueResult = newResult.value;
    }

  } else if (
    event.target.name === 'result' &&
    sourceChecked.value === resultChecked.value
  ) {
    const newResult = Array.from(sourceRadios).find(
      (radio) => radio.value === valueResult
    );
  
    if (newResult) {
      newResult.checked = true;
      valueSource = newResult.value;
    }
  }

  if (event.target.name === 'source') {
    valueSource = event.target.value;
  } 
  if ( event.target.name === 'result' ) {
    valueResult = event.target.value;
  }

}


swapButton.addEventListener('click', swapCurrencies);

sourceRadios.forEach((radio) =>
  radio.addEventListener('change', (e) => {preventSameCurrency(e)} )
);
resultRadios.forEach((radio) =>
  radio.addEventListener('change', (e) => {preventSameCurrency(e)})
);
