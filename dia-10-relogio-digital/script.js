document.addEventListener("DOMContentLoaded", () => {
  // MAPEAMENTO DE ELEMENTOS
  const hourDigits = document.querySelectorAll('[data-unit="hours"] .digit');
  const minuteDigits = document.querySelectorAll(
    '[data-unit="minutes"] .digit'
  );
  const secondDigits = document.querySelectorAll(
    '[data-unit="seconds"] .digit'
  );
  const dateContainer = document.getElementById("date-container");

  let previousTime = { hours: -1, minutes: -1, seconds: -1 };

  function flipDigit(digitElement, newValue) {
    const oldValue = digitElement.getAttribute("data-value");
    if (oldValue === newValue) return;

    const existingFlipper = digitElement.querySelector(".flipper");
    if (existingFlipper) existingFlipper.remove();

    const flipper = document.createElement("div");
    flipper.className = "flipper";
    flipper.setAttribute("data-old-value", oldValue);
    flipper.setAttribute("data-new-value", newValue);

    digitElement.setAttribute("data-value", newValue);
    digitElement.appendChild(flipper);

    // Adiciona a classe que dispara a animação CSS
    digitElement.classList.add("flipping");

    flipper.addEventListener(
      "transitionend",
      () => {
        digitElement.classList.remove("flipping");
        flipper.remove();
      },
      { once: true }
    );
  }

  function updateDate(now) {
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // +1 porque meses começam em 0
    const year = now.getFullYear();
    dateContainer.textContent = `${day} / ${month} / ${year}`;
  }

  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const currentTime = { hours, minutes, seconds };

    // Compara o tempo atual com o anterior e aciona a animação apenas se mudar
    if (previousTime.seconds !== currentTime.seconds) {
      flipDigit(secondDigits[0], seconds[0]);
      flipDigit(secondDigits[1], seconds[1]);
    }
    if (previousTime.minutes !== currentTime.minutes) {
      flipDigit(minuteDigits[0], minutes[0]);
      flipDigit(minuteDigits[1], minutes[1]);
    }
    if (previousTime.hours !== currentTime.hours) {
      flipDigit(hourDigits[0], hours[0]);
      flipDigit(hourDigits[1], hours[1]);
    }

    previousTime = currentTime;
  }

  // --- INICIALIZAÇÃO ---

  // Atualiza a data apenas uma vez ao carregar (não precisa ser a cada segundo)
  updateDate(new Date());

  // Atualiza o relógio a cada segundo
  setInterval(updateClock, 1000);
});
