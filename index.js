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
const timerElement = document.getElementById("timer");
const totalTimeSpentElement = document.getElementById("total-time-spent");

// Sound effects for correct/wrong answers and quiz completion
const soundEffects = {
  correct: new Audio('./sounds/mixkit-software-interface-start-2574.wav'),
  wrong: new Audio('./sounds/mixkit-dry-pop-up-notification-alert-2356.wav'),
  timeUp: new Audio('./sounds/mixkit-software-interface-back-2575.wav'),
  gameOver: new Audio('./sounds/mixkit-software-interface-remove-2576.wav')
};

let score = 0;
let currentQuestionIndex = 0;
let currentQuestions = [];

// Set time limit per question in seconds
const timeLimitPerQuestion = 30;

// Variables to track Time Spent 
let totalTimeSpent = 0;
let currentQuestionTimeLeft = timeLimitPerQuestion;
let intervalId;
let questionStartTime;

// Function to update the timer display
function updateDisplayTime(timeLeft) {
  timerElement.textContent = `Time left: ${timeLeft} seconds`;
  
  // Add warning colors when time is running low
  if (timeLeft <= 10) {
    timerElement.style.color = "red";
    timerElement.style.fontWeight = "bold";
    timerElement.style.display = "inline-block";
  } else {
    timerElement.style.color = "black";
    timerElement.style.fontWeight = "normal";
  }
}

// Function to start the timer for a question
function startQuestionTimer() {
  // Clear any existing interval
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  // Record the start time for this question
  questionStartTime = Date.now();
  
  // Reset timer
  currentQuestionTimeLeft = timeLimitPerQuestion;
  updateDisplayTime(currentQuestionTimeLeft);
  
  // Start countdown
  intervalId = setInterval(() => {
    currentQuestionTimeLeft -= 1;
    updateDisplayTime(currentQuestionTimeLeft);
    
    if (currentQuestionTimeLeft <= 0) {
      clearInterval(intervalId);
      // Time's up - move to next question automatically
      handleTimeUp();
    }
  }, 1000);
}

// Function to handle when time runs out for a question
function handleTimeUp() {
  // Add the time spent on this question to total
  trackTimeSpent();
  
  // Play time's up sound
  soundEffects.timeUp.play();

  // Disable all buttons
  for (let btn of answerButtons.children) {
    btn.disabled = true;
    
    // Highlight the correct answer
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answers.find(answer => answer.correct).option;
    
    if (btn.textContent === correctAnswer) {
      btn.style.backgroundColor = "red";
    } else {
      btn.style.backgroundColor = "red"; // gray out incorrect options
    }
  }
  
  // Show "Time's up!" message
  timerElement.textContent = "Time's up!";
  timerElement.style.color = "red";
  timerElement.style.fontWeight = "bold";
  
  // Show next button
  nextButton.style.display = "inline-block";
}

// Function to track time spent on each question
function trackTimeSpent() {
  // Calculate time spent on this question (in seconds)
  const timeSpentOnQuestion = Math.min(
    timeLimitPerQuestion - currentQuestionTimeLeft,
    timeLimitPerQuestion
  );
  
  totalTimeSpent += timeSpentOnQuestion;
}

// Function to end the quiz and display total time spent
function endQuiz() {
  // Stop the timer
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  // Update total time display
  totalTimeSpentElement.textContent = `Total time spent: ${totalTimeSpent} seconds`;
  totalTimeSpentElement.style.display = "block";
}

// Fisher-Yates shuffle algorithm for randomizing arrays
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to start the Quiz
function startQuiz() {
  score = 0;
  currentQuestionIndex = 0;
  totalTimeSpent = 0;
  
  resultElement.textContent = "";
  totalTimeSpentElement.style.display = "none";
  questionContainer.style.display = "block";
  timerElement.style.display = "inline-block";
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

// Function to display the Questions
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
      // Stop the timer when an answer is selected
      clearInterval(intervalId);
      
      // Track time spent on this question
      trackTimeSpent();
      
      // Evaluate the answer
      evaluateOption(answer.correct);
    });
  });
  
  // Start the timer for this question
  startQuestionTimer();
}

// Function to evaluate which among the options
function evaluateOption(param) {
  if (param === true) {
    score++;
  
  soundEffects.correct.play();
  } else {
    soundEffects.wrong.play();
  }

  // Define which answer is correct 
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isCorrect = currentQuestion.answers.find(
    (item) => item.correct === true
  );

  const correctAnswerText = isCorrect.option;

  // Function to disable all buttons after a click on any options
  for (let btn of answerButtons.children) {
    btn.disabled = true;

    // Function to provide background colors to options once an answer is chosen
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
    // Reset the quiz and start over
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

// Function to display final results after quiz is over
function showResult() {
  // End the quiz and display total time
  endQuiz();
  // Play game over sound
  soundEffects.gameOver.play();

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

// Function to cancel previous question and display the next question
function cancelPrev() {
  answerButtons.innerHTML = "";
}

// Start the quiz when the page loads
startQuiz();