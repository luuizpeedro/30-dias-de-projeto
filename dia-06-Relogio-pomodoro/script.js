document.addEventListener("DOMContentLoaded", () => {
  // MAPEAMENTO DE ELEMENTOS
  const timeDisplay = document.getElementById("time-display");
  const startStopBtn = document.getElementById("start-stop-btn");
  const modeButtons = document.querySelectorAll(".mode-button");
  const sessionCountDisplay = document.getElementById("session-count");
  const notificationSound = document.getElementById("notification-sound");
  const progressBar = document.querySelector(".progress-bar");

  // CONFIGURAÇÕES DO POMODORO
  const timers = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  // ESTADO DA APLICAÇÃO
  let currentMode = "pomodoro";
  let timeRemaining = timers.pomodoro;
  let isRunning = false;
  let intervalId = null;
  let sessionCount = 0;
  const sessionsForLongBreak = 4;

  // FUNÇÕES
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  function updateDisplay() {
    timeDisplay.textContent = formatTime(timeRemaining);
    document.title = `${formatTime(timeRemaining)} - ${
      currentMode === "pomodoro" ? "Foco" : "Pausa"
    }`;

    const totalDuration = timers[currentMode];
    const progressPercent =
      ((totalDuration - timeRemaining) / totalDuration) * 100;
    progressBar.style.height = `${progressPercent}%`;
  }

  function switchMode(newMode) {
    currentMode = newMode;
    stopTimer(); // Para o timer ao trocar de modo
    timeRemaining = timers[newMode];

    modeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === newMode);
    });

    updateDisplay();
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startStopBtn.textContent = "PAUSAR";

    const endTime = Date.now() + timeRemaining * 1000;

    intervalId = setInterval(() => {
      timeRemaining = Math.round((endTime - Date.now()) / 1000);

      if (timeRemaining < 0) {
        timerFinished();
        return;
      }
      updateDisplay();
    }, 1000);
  }

  function stopTimer() {
    isRunning = false;
    clearInterval(intervalId);
    startStopBtn.textContent = "INICIAR";
  }

  function timerFinished() {
    stopTimer();
    notificationSound.play();

    if (currentMode === "pomodoro") {
      sessionCount++;
      if (sessionCount % sessionsForLongBreak === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      // Se uma pausa terminou, volta para o foco
      switchMode("pomodoro");
    }

    updateSessionInfo();
    // Inicia o próximo timer automaticamente após um pequeno delay
    setTimeout(startTimer, 1000);
  }

  function updateSessionInfo() {
    const cycleNumber = Math.floor(sessionCount / sessionsForLongBreak) + 1;
    const sessionInCycle =
      sessionCount % sessionsForLongBreak || sessionsForLongBreak;
    sessionCountDisplay.textContent = `Sessão: ${sessionInCycle}/${sessionsForLongBreak} (Ciclo ${cycleNumber})`;
  }

  // EVENT LISTENERS
  startStopBtn.addEventListener("click", () => {
    isRunning ? stopTimer() : startTimer();
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      switchMode(e.target.dataset.mode);
    });
  });

  // INICIALIZAÇÃO
  updateDisplay();
  updateSessionInfo();
});
