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

// First let get our elements from the Homepage

const questionContainer = document.getElementById("question-container");
const questionEl = document.getElementById("question");
const answerButtons = document.getElementById("answer-container");
const nextButton = document.getElementById("nextButton");
const resultElement = document.getElementById("result");

let score = 0;
let currentQuestionIndex = 0;

// funtion to start the Quiz
function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  resultElement.textContent = "";
  showQuestion();
}

// function to display the Questions
function showQuestion() {
  cancelPrev();

  const currentQuestion = questions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {

    const button = document.createElement("button");

    button.textContent = answer.option;

    button.classList.add("optionBtns");

    answerButtons.appendChild(button);

    button.addEventListener("click", function () {
      const disabled = document.getElementsByClassName("optionBtns");
      evaluateOption(answer.correct);
    });
  });
}

// funtion to evaluate which the among the options
function evaluateOption(param) {
  if (param === true) {
    score++;
  }

  // defining which answer is correct 

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = currentQuestion.answers.find(
    (item) => item.correct === true
  );

  const correctAnswerText = isCorrect.option;

  // funtion to disable all buttons after a click on any options
  for (let btn of answerButtons.children) {
    btn.disabled = true;

    // funtion to provide background colors to options once an answer is chosen
    if (btn.textContent === correctAnswerText && param) {
      btn.style.backgroundColor = "green";
    } else {
      btn.style.backgroundColor = "red";
    }
  }
  nextButton.style.display = "inline-block";
}

// Funtion to display the next Button once an answer is clicked
nextButton.addEventListener("click", function () {

  nextButton.style.display = "none";
  currentQuestionIndex++;
  
  
  // Displaying the Well done and Try Again Button 
  if (currentQuestionIndex === questions.length) {
    
    if (score === questions.length) {
      questionContainer.textContent = "Well Done";
    } else {
      questionContainer.style.display = "none";
      nextButton.style.display = "inline-block";
      nextButton.textContent = "Try Again";
    startQuiz();

    } 

    showResult();

// funtion to display final results after quiz is over
    function showResult() {
      questionContainer.style.display = "none";
      resultElement.textContent = `Your Score is ${score} out of ${questions.length}`;
    }
  }
  showQuestion();
});


// function to cancel previous question and display the next question
function cancelPrev() {
  answerButtons.innerHTML = "";
  
}

startQuiz();