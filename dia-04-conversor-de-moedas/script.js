document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DO DOM ---
  const amountInput = document.getElementById("amount");
  const fromCurrencySelect = document.getElementById("from-currency");
  const toCurrencySelect = document.getElementById("to-currency");
  const fromFlagImg = document.getElementById("from-flag");
  const toFlagImg = document.getElementById("to-flag");
  const swapButton = document.getElementById("swap-button");
  const rateDisplay = document.getElementById("rate-display");
  const resultDisplay = document.getElementById("result-display");
  const lastUpdatedSpan = document.getElementById("last-updated");
  const loadingOverlay = document.querySelector(".loading-overlay");

  const API_BASE_URL = "https://api.frankfurter.app";

  // Mapeamento de moedas para códigos de país para as bandeiras
  const currencyCountryMap = {
    USD: "us",
    EUR: "eu",
    JPY: "jp",
    GBP: "gb",
    AUD: "au",
    CAD: "ca",
    CHF: "ch",
    CNY: "cn",
    SEK: "se",
    NZD: "nz",
    MXN: "mx",
    SGD: "sg",
    HKD: "hk",
    NOK: "no",
    KRW: "kr",
    TRY: "tr",
    RUB: "ru",
    INR: "in",
    BRL: "br",
    ZAR: "za",
    PLN: "pl",
    THB: "th",
    IDR: "id",
    HUF: "hu",
    CZK: "cz",
    ILS: "il",
    DKK: "dk",
  };

  // --- FUNÇÕES ---

  // Mostra/esconde o overlay de carregamento
  function toggleLoading(isLoading) {
    loadingOverlay.classList.toggle("hidden", !isLoading);
  }

  // Busca e popula os seletores de moeda
  async function populateCurrencies() {
    toggleLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/currencies`);
      const currencies = await response.json();

      for (const currency in currencies) {
        if (currencyCountryMap[currency]) {
          // Apenas adiciona moedas que temos bandeira
          const optionFrom = document.createElement("option");
          optionFrom.value = currency;
          optionFrom.textContent = `${currency} - ${currencies[currency]}`;
          fromCurrencySelect.appendChild(optionFrom);

          const optionTo = document.createElement("option");
          optionTo.value = currency;
          optionTo.textContent = `${currency} - ${currencies[currency]}`;
          toCurrencySelect.appendChild(optionTo);
        }
      }
      // Define valores padrão
      fromCurrencySelect.value = "USD";
      toCurrencySelect.value = "BRL";
      updateFlags();
      await convertCurrency();
    } catch (error) {
      console.error("Erro ao buscar moedas:", error);
      resultDisplay.textContent = "Erro ao carregar.";
    } finally {
      toggleLoading(false);
    }
  }

  // Atualiza as bandeiras com base na moeda selecionada
  function updateFlags() {
    const fromCountry = currencyCountryMap[fromCurrencySelect.value];
    const toCountry = currencyCountryMap[toCurrencySelect.value];
    fromFlagImg.src = `https://flagcdn.com/${fromCountry}.svg`;
    toFlagImg.src = `https://flagcdn.com/${toCountry}.svg`;
  }

  // Realiza a conversão
  async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (isNaN(amount) || amount === 0) {
      resultDisplay.textContent = "--";
      rateDisplay.textContent = "--";
      return;
    }

    if (fromCurrency === toCurrency) {
      resultDisplay.textContent = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: toCurrency,
      }).format(amount);
      rateDisplay.textContent = `1 ${fromCurrency} = 1.00 ${toCurrency}`;
      return;
    }

    toggleLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await response.json();

      const rate = data.rates[toCurrency];
      const singleRate = (rate / amount).toFixed(4);

      resultDisplay.textContent = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: toCurrency,
      }).format(rate);
      rateDisplay.textContent = `1 ${fromCurrency} = ${singleRate} ${toCurrency}`;
      lastUpdatedSpan.textContent = data.date;
    } catch (error) {
      console.error("Erro na conversão:", error);
      resultDisplay.textContent = "Erro.";
    } finally {
      toggleLoading(false);
    }
  }

  // Inverte as moedas
  function swapCurrencies() {
    const fromValue = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = fromValue;
    updateFlags();
    convertCurrency();
  }

  // --- EVENT LISTENERS ---
  amountInput.addEventListener("input", convertCurrency);
  fromCurrencySelect.addEventListener("change", () => {
    updateFlags();
    convertCurrency();
  });
  toCurrencySelect.addEventListener("change", () => {
    updateFlags();
    convertCurrency();
  });
  swapButton.addEventListener("click", swapCurrencies);

  // --- INICIALIZAÇÃO ---
  populateCurrencies();
});
