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

function preventSameCurrency(event) {
  const sourceChecked = Array.from(sourceRadios).find((radio) => radio.checked);
  const resultChecked = Array.from(resultRadios).find((radio) => radio.checked);

  if (
    event.target.name === "source" &&
    sourceChecked.value === resultChecked.value
  ) {
    const newResult = Array.from(resultRadios).find(
      (radio) => radio.value !== sourceChecked.value
    );
    if (newResult) {
      newResult.checked = true;
    }
  } else if (
    event.target.name === "result" &&
    sourceChecked.value === resultChecked.value
  ) {
    const newSource = Array.from(sourceRadios).find(
      (radio) => radio.value !== resultChecked.value
    );
    if (newSource) {
      newSource.checked = true;
    }
  }
}

swapButton.addEventListener("click", swapCurrencies);

sourceRadios.forEach((radio) =>
  radio.addEventListener("change", preventSameCurrency)
);
resultRadios.forEach((radio) =>
  radio.addEventListener("change", preventSameCurrency)
);
