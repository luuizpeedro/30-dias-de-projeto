document.addEventListener("DOMContentLoaded", () => {
  // MAPEAMENTO DE ELEMENTOS
  const timeDisplay = document.getElementById("time-display");
  const startStopBtn = document.getElementById("start-stop-btn");
  const resetLapBtn = document.getElementById("reset-lap-btn");
  const lapsList = document.getElementById("laps-list");
  const tabs = document.querySelectorAll(".tab-button");
  const timerInputs = document.querySelector(".timer-inputs");
  const lapsContainer = document.querySelector(".laps");
  const alarmSound = document.getElementById("alarm-sound");
  const appContainer = document.querySelector(".app-container");

  // VARIÁVEIS DE ESTADO
  let mode = "stopwatch"; // 'stopwatch' ou 'timer'
  let intervalId = null;
  let isRunning = false;

  // Estado do Cronômetro
  let startTime = 0;
  let elapsedTime = 0;
  let lapCounter = 1;

  // Estado do Timer
  let timerDuration = 0;
  let timeRemaining = 0;

  // --- FUNÇÕES DE LÓGICA ---

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    const ms = (milliseconds % 1000).toString().padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  function updateDisplay() {
    const timeToShow = mode === "stopwatch" ? elapsedTime : timeRemaining;
    timeDisplay.textContent = formatTime(timeToShow);
  }

  function startStopwatch() {
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      updateDisplay();
    }, 10); // Atualiza a cada 10ms para mostrar os milissegundos
  }

  function startTimer() {
    const endTime = Date.now() + timeRemaining;
    intervalId = setInterval(() => {
      timeRemaining = Math.max(0, endTime - Date.now());
      updateDisplay();

      if (timeRemaining === 0) {
        stop();
        alarmSound.play();
        appContainer.classList.add("timer-finished");
      }
    }, 10);
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    startStopBtn.textContent = "Parar";
    if (mode === "stopwatch") {
      resetLapBtn.textContent = "Volta";
      startStopwatch();
    } else {
      const h = parseInt(document.getElementById("hours").value) || 0;
      const m = parseInt(document.getElementById("minutes").value) || 0;
      const s = parseInt(document.getElementById("seconds").value) || 0;
      if (timerDuration === 0) {
        timerDuration = (h * 3600 + m * 60 + s) * 1000;
      }
      if (timeRemaining === 0) timeRemaining = timerDuration;

      if (timeRemaining > 0) {
        startTimer();
      } else {
        stop(); // Não inicia se o tempo for zero
      }
    }
  }

  function stop() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(intervalId);
    startStopBtn.textContent = "Continuar";
    if (mode === "stopwatch") {
      resetLapBtn.textContent = "Resetar";
    }
  }

  function reset() {
    stop();
    appContainer.classList.remove("timer-finished");
    alarmSound.pause();
    alarmSound.currentTime = 0;

    if (mode === "stopwatch") {
      elapsedTime = 0;
      lapsList.innerHTML = "";
      lapCounter = 1;
    } else {
      timerDuration = 0;
      timeRemaining = 0;
      ["hours", "minutes", "seconds"].forEach(
        (id) => (document.getElementById(id).value = "")
      );
    }
    updateDisplay();
    startStopBtn.textContent = "Iniciar";
    resetLapBtn.textContent = "Resetar";
  }

  function recordLap() {
    if (!isRunning) return;
    const lapTime = formatTime(elapsedTime);
    const li = document.createElement("li");
    li.textContent = `Volta ${lapCounter}: ${lapTime}`;
    lapsList.prepend(li);
    lapCounter++;
  }

  function switchMode(newMode) {
    mode = newMode;
    reset(); // Reseta tudo ao trocar de modo

    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mode === newMode);
    });

    timerInputs.classList.toggle("hidden", newMode !== "timer");
    lapsContainer.classList.toggle("hidden", newMode !== "stopwatch");
  }

  // --- EVENT LISTENERS ---
  startStopBtn.addEventListener("click", () => {
    isRunning ? stop() : start();
  });

  resetLapBtn.addEventListener("click", () => {
    if (mode === "stopwatch" && isRunning) {
      recordLap();
    } else {
      reset();
    }
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchMode(tab.dataset.mode));
  });

  // INICIALIZAÇÃO
  updateDisplay();
});
