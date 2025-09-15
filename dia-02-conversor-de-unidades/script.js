document.addEventListener("DOMContentLoaded", () => {
  // 1. MAPEAMENTO DOS ELEMENTOS
  const categorySelect = document.getElementById("category");
  const fromUnitSelect = document.getElementById("from-unit");
  const toUnitSelect = document.getElementById("to-unit");
  const inputValue = document.getElementById("input-value");
  const resultDiv = document.getElementById("result");
  const swapButton = document.getElementById("swap-button");
  const formulaDisplay = document.getElementById("formula-display");

  // 2. ESTRUTURA DE DADOS COM AS FÓRMULAS
  // A chave é usar uma unidade base para cada categoria (ex: metro, grama, celsius)
  // e criar funções para converter para e a partir dessa base.
  const formulas = {
    length: {
      name: "Comprimento",
      base: "meter",
      units: {
        meter: {
          name: "Metros (m)",
          to_base: (v) => v,
          from_base: (v) => v,
          formula: "m",
        },
        kilometer: {
          name: "Quilômetros (km)",
          to_base: (v) => v * 1000,
          from_base: (v) => v / 1000,
          formula: "km",
        },
        mile: {
          name: "Milhas (mi)",
          to_base: (v) => v * 1609.34,
          from_base: (v) => v / 1609.34,
          formula: "mi",
        },
        foot: {
          name: "Pés (ft)",
          to_base: (v) => v * 0.3048,
          from_base: (v) => v / 0.3048,
          formula: "ft",
        },
      },
    },
    weight: {
      name: "Peso",
      base: "gram",
      units: {
        gram: {
          name: "Gramas (g)",
          to_base: (v) => v,
          from_base: (v) => v,
          formula: "g",
        },
        kilogram: {
          name: "Quilogramas (kg)",
          to_base: (v) => v * 1000,
          from_base: (v) => v / 1000,
          formula: "kg",
        },
        pound: {
          name: "Libras (lb)",
          to_base: (v) => v * 453.592,
          from_base: (v) => v / 453.592,
          formula: "lb",
        },
        ounce: {
          name: "Onças (oz)",
          to_base: (v) => v * 28.3495,
          from_base: (v) => v / 28.3495,
          formula: "oz",
        },
      },
    },
    temperature: {
      name: "Temperatura",
      base: "celsius",
      units: {
        celsius: {
          name: "Celsius (°C)",
          to_base: (v) => v,
          from_base: (v) => v,
          formula: "°C",
        },
        fahrenheit: {
          name: "Fahrenheit (°F)",
          to_base: (v) => ((v - 32) * 5) / 9,
          from_base: (v) => (v * 9) / 5 + 32,
          formula: "°F",
        },
        kelvin: {
          name: "Kelvin (K)",
          to_base: (v) => v - 273.15,
          from_base: (v) => v + 273.15,
          formula: "K",
        },
      },
    },
  };

  // 3. FUNÇÕES PRINCIPAIS

  // Popula os selects de unidades com base na categoria escolhida
  function updateUnitOptions() {
    const category = categorySelect.value;
    const units = formulas[category].units;

    fromUnitSelect.innerHTML = "";
    toUnitSelect.innerHTML = "";

    for (const unitKey in units) {
      const unitName = units[unitKey].name;
      const option1 = new Option(unitName, unitKey);
      const option2 = new Option(unitName, unitKey);
      fromUnitSelect.add(option1);
      toUnitSelect.add(option2);
    }
    // Define unidades padrão diferentes para começar
    fromUnitSelect.selectedIndex = 0;
    toUnitSelect.selectedIndex = 1;

    convert(); // Faz uma conversão inicial
  }

  // Realiza o cálculo da conversão
  function convert() {
    const fromUnitKey = fromUnitSelect.value;
    const toUnitKey = toUnitSelect.value;
    const category = categorySelect.value;
    const value = parseFloat(inputValue.value);

    // Verifica se a entrada é um número válido
    if (isNaN(value)) {
      resultDiv.textContent = "--";
      formulaDisplay.textContent = "Fórmula: --";
      return;
    }

    const fromUnit = formulas[category].units[fromUnitKey];
    const toUnit = formulas[category].units[toUnitKey];

    // Passo 1: Converter o valor de entrada para a unidade base
    const valueInBase = fromUnit.to_base(value);

    // Passo 2: Converter o valor base para a unidade de destino
    const finalResult = toUnit.from_base(valueInBase);

    // Exibe o resultado formatado
    resultDiv.textContent = parseFloat(finalResult.toFixed(4));

    // Exibe a fórmula/unidades
    formulaDisplay.textContent = `1 ${fromUnit.formula} ≈ ${toUnit
      .from_base(fromUnit.to_base(1))
      .toFixed(4)} ${toUnit.formula}`;
  }

  // Inverte as unidades selecionadas
  function swapUnits() {
    const fromValue = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = fromValue;
    convert();
  }

  // 4. EVENT LISTENERS
  categorySelect.addEventListener("change", updateUnitOptions);
  inputValue.addEventListener("input", convert);
  fromUnitSelect.addEventListener("change", convert);
  toUnitSelect.addEventListener("change", convert);
  swapButton.addEventListener("click", swapUnits);

  // 5. INICIALIZAÇÃO
  updateUnitOptions(); // Chama a função uma vez para popular os selects iniciais
});
