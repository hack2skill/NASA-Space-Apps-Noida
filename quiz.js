const questions = [
    {
        question: "How many types of Lunar eclipses are there?",
        answers: [
            {text: "6", correct: false},
            {text: "3", correct: true},
            {text: "5", correct: false},
            {text: "2", correct: false},
        ]
    },
    {
        question: "Which eclipse is NOT safe to watch with the naked eye?",
        answers: [
            {text: "Lunar eclipse", correct: false},
            {text: "Solar eclipse", correct: true},
        ]
    },
    {
        question: "How often do solar eclipses occur?",
        answers: [
            {text: "1-6 times a year", correct: false},
            {text: "5-10 times a year", correct: false},
            {text: "2-5 times a year", correct: false},
            {text: "once a year", correct: false},
        ]
    },
    {
        question: "In an eclipse where the Moon, Sun, and Earth are involved, they are nearly in a",
        answers: [
            {text: "Polygon shape", correct: false},
            {text: "Oval shape", correct: false},
            {text: "Circular shape", correct: false},
            {text: "Straight line", correct: true},
        ]
    },
    {
        question: "______ takes place when the Earth intersects the umbra portion of the Moon’s shadow.",
        answers: [
            {text: "Total solar eclipse", correct: true},
            {text: "Partial solar eclipse", correct: false},
            {text: "Total lunar eclipse", correct: false},
            {text: "Partial lunar eclipse", correct: false},
        ]
    },
    {
        question: "Which is the most rarest Solar Eclipse?",
        answers: [
            {text: "Partial solar eclipse", correct: true},
            {text: "Annular solar eclipse", correct: false},
            {text: "Total solar eclipse", correct: false},
            {text: "Hybrid solar eclipse", correct: false},
        ]
    },
    {
        question: "How many types of solar eclipses are there?",
        answers: [
            {text: "5", correct: false},
            {text: "4", correct: true},
            {text: "6", correct: false},
            {text: "3", correct: false},
        ]
    },
    {
        question: "A lunar eclipse occurs when the ______ shadow falls on the Moon.",
        answers: [
            {text: "Mercury's", correct: false},
            {text: "Asteriod's", correct: false},
            {text: "Earth's", correct: true},
            {text: "Sun's", correct: false},
        ]
    },
    {
        question: "How many types of eclipses are there?",
        answers: [
            {text: "4", correct: false},
            {text: "6", correct: false},
            {text: "5", correct: false},
            {text: "2", correct: true},
        ]
    },
    {
        question: "Choose the correct alignment during a solar eclipse from the options provided below:",
        answers: [
            {text: "Sun, Moon, Earth", correct: true},
            {text: "Moon, Earth, Sun", correct: false},
            {text: "Sun,Earth, Moon", correct: false},
            {text: "Earth, Moon, Sun", correct: false},
        ]
    }
];
const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let Score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + "." + currentQuestion.
            question;

    currentQuestion.answers.forEach(answer => {
       const button = document.createElement("button");
       button.innerHTML = answer.text;
       button.classList.add("btn");
       answerButton.appendChild(button);
       if (answer.correct){
           button.dataset.correct = answer.correct;
       }
       button.addEventListener("click",selectAnswer);

    });
}
function resetState(){
    nextButton.style.display = "none";
    while (answerButton.firstChild){
        answerButton.removeChild(answerButton.firstChild);
    }
}

function selectAnswer(e){
    const selectionBtn = e.target;
    const  isCorrect = selectionBtn.dataset.correct === "true";
    if (isCorrect){
        selectionBtn.classList.add("correct");
        score++;
    }else {
        selectionBtn.classList.add("incorrect");
    }
    Array.from(answerButton.children).forEach(button =>{
        if (button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if (currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
})

startQuiz();
