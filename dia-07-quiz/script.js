document.addEventListener("DOMContentLoaded", () => {
  // Array de perguntas do quiz
  const questions = [
    {
      question: "O que significa a sigla 'HTTP'?",
      answers: [
        { text: "HyperText Transfer Protocol", correct: true },
        { text: "High Tech Transfer Protocol", correct: false },
        { text: "Hyperlink and Text Transfer Protocol", correct: false },
        { text: "Home Transfer to Page", correct: false },
      ],
    },
    {
      question: "Qual componente é considerado o 'cérebro' do computador?",
      answers: [
        { text: "Memória RAM", correct: false },
        { text: "CPU (Unidade Central de Processamento)", correct: true },
        { text: "GPU (Unidade de Processamento Gráfico)", correct: false },
        { text: "Disco Rígido (HD/SSD)", correct: false },
      ],
    },
    {
      question: "No contexto da cibersegurança, o que é 'phishing'?",
      answers: [
        {
          text: "Um tipo de vírus que se espalha rapidamente.",
          correct: false,
        },
        { text: "Um software que protege o computador.", correct: false },
        {
          text: "Uma tentativa de enganar uma pessoa para que ela revele informações sensíveis.",
          correct: true,
        },
        {
          text: "A prática de minerar criptomoedas sem permissão.",
          correct: false,
        },
      ],
    },
    {
      question:
        "Qual linguagem é usada para a estilização visual de páginas web?",
      answers: [
        { text: "HTML", correct: false },
        { text: "JavaScript", correct: false },
        { text: "Python", correct: false },
        { text: "CSS", correct: true },
      ],
    },
    {
      question:
        "Qual tecnologia é a base para o funcionamento de criptomoedas como o Bitcoin?",
      answers: [
        { text: "Inteligência Artificial", correct: false },
        { text: "Blockchain", correct: true },
        { text: "Computação em Nuvem", correct: false },
        { text: "Internet das Coisas (IoT)", correct: false },
      ],
    },
  ];

  // MAPEAMENTO DE ELEMENTOS
  const questionElement = document.getElementById("question");
  const answerButtonsElement = document.getElementById("answer-buttons");
  const nextButton = document.getElementById("next-btn");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const finalScoreElement = document.getElementById("final-score");
  const scoreTextElement = document.getElementById("score-text");
  const restartButton = document.getElementById("restart-btn");

  let currentQuestionIndex, score;

  function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    finalScoreElement.classList.add("hidden");
    questionElement.classList.remove("hidden");
    answerButtonsElement.classList.remove("hidden");
    document.querySelector(".quiz-header").classList.remove("hidden");
    nextButton.classList.add("hidden");
    nextButton.textContent = "Próxima";
    showQuestion();
  }

  function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.innerText = answer.text;
      button.classList.add("btn");
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener("click", selectAnswer);
      answerButtonsElement.appendChild(button);
    });

    updateProgress();
  }

  function resetState() {
    nextButton.classList.add("hidden");
    while (answerButtonsElement.firstChild) {
      answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
  }

  function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";

    if (correct) {
      score++;
    }

    Array.from(answerButtonsElement.children).forEach((button) => {
      setStatusClass(button, button.dataset.correct === "true");
      button.disabled = true; // Desabilita todos os botões após a escolha
    });

    if (questions.length > currentQuestionIndex + 1) {
      nextButton.classList.remove("hidden");
    } else {
      showFinalScore();
    }
  }

  function setStatusClass(element, correct) {
    if (correct) {
      element.classList.add("correct");
    } else {
      element.classList.add("incorrect");
    }
  }

  function showFinalScore() {
    questionElement.classList.add("hidden");
    answerButtonsElement.classList.add("hidden");
    nextButton.classList.add("hidden");
    document.querySelector(".quiz-header").classList.add("hidden");

    finalScoreElement.classList.remove("hidden");
    scoreTextElement.textContent = `${score} de ${questions.length}`;
  }

  function updateProgress() {
    const progressPercentage =
      ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `Pergunta ${currentQuestionIndex + 1} de ${
      questions.length
    }`;
  }

  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    showQuestion();
  });

  restartButton.addEventListener("click", startQuiz);

  // INICIALIZAÇÃO
  startQuiz();
});
