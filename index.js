// List of arrays of questions for the app
const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      { option: "Hyper Text Markup Language", correct: true },
      { option: "Hot Mail", correct: false },
      { option: "How to Make Links", correct: false },
      { option: "Home Tool Markup Language", correct: false },
    ],
  },
  {
    question: "Which language is used for styling web pages?",
    answers: [
      { option: "HTML", correct: false },
      { option: "JQuery", correct: false },
      { option: "CSS", correct: true },
      { option: "XML", correct: false },
    ],
  },
  {
    question: "Which is not a JavaScript Framework?",
    answers: [
      { option: "Python Script", correct: true },
      { option: "React", correct: false },
      { option: "Angular", correct: false },
      { option: "Vue", correct: false },
    ],
  },
];

// First let's get our elements from the Homepage
const titleElement = document.querySelector(".title");
const questionContainer = document.getElementById("question-container");
const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-container");
const nextButton = document.getElementById("nextButton");
const resultElement = document.getElementById("result");

let score = 0;
let currentQuestionIndex = 0;
let currentQuestions = [];

// Fisher-Yates shuffle algorithm for randomizing arrays
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// function to start the Quiz
function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  resultElement.textContent = "";
  questionContainer.style.display = "block";
  titleElement.style.display = "block"; // Show title when quiz starts
  nextButton.textContent = "Next";
  
  // Create a deep copy of the questions array so we don't modify the original
  const questionsCopy = JSON.parse(JSON.stringify(questions));
  
  // Randomize the order of questions
  shuffleArray(questionsCopy);
  
  // Randomize the order of answer options for each question
  questionsCopy.forEach(question => shuffleArray(question.answers));
  
  // Replace the current questions with the randomized ones
  currentQuestions = questionsCopy;
  
  showQuestion();
}

// function to display the Questions
function showQuestion() {
  cancelPrev();

  const currentQuestion = currentQuestions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.option;
    button.classList.add("optionBtns");
    answerButtons.appendChild(button);

    button.addEventListener("click", function () {
      evaluateOption(answer.correct);
    });
  });
}

// function to evaluate which among the options
function evaluateOption(param) {
  if (param === true) {
    score++;
  }

  // defining which answer is correct 
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isCorrect = currentQuestion.answers.find(
    (item) => item.correct === true
  );

  const correctAnswerText = isCorrect.option;

  // function to disable all buttons after a click on any options
  for (let btn of answerButtons.children) {
    btn.disabled = true;

    // function to provide background colors to options once an answer is chosen
    if (btn.textContent === correctAnswerText && param) {
      btn.style.backgroundColor = "green";
    } else {
      btn.style.backgroundColor = "red";
    }
  }
  nextButton.style.display = "inline-block";
}

// Function to display the next Button once an answer is clicked
nextButton.addEventListener("click", function () {
  // Check if we're in "Try Again" mode
  if (nextButton.textContent === "Try Again") {
    // Reset the quiz and start over'
    nextButton.style.display = "none";
    startQuiz();
    return;
  }

  nextButton.style.display = "none";
  currentQuestionIndex++;
  
  // Check if quiz is complete
  if (currentQuestionIndex === currentQuestions.length) {
    showResult();
  } else {
    showQuestion();
  }
});

// function to display final results after quiz is over
function showResult() {
  titleElement.style.display = "none"; // Hide the title when showing results
  questionContainer.style.display = "none";
  resultElement.textContent = `Your Score is ${score} out of ${currentQuestions.length}`;
  
  // Show appropriate message based on score
  if (score === questions.length) {
    questionContainer.style.display = "block";
    questionContainer.textContent = "Well Done!";
  } else {
    nextButton.style.display = "inline-block";
    nextButton.textContent = "Try Again";
  }
}

// function to cancel previous question and display the next question
function cancelPrev() {
  answerButtons.innerHTML = "";
}

// Start the quiz when the page loads
startQuiz();