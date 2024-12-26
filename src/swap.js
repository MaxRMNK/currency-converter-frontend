const swapButton = document.querySelector(".swap-button");
const sourceRadios = document.querySelectorAll('input[name="source"]');
const resultRadios = document.querySelectorAll('input[name="result"]');

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

swapButton.addEventListener("click", swapCurrencies);
