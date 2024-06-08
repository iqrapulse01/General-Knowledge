// Example questions (You would typically fetch these from an API or a JSON file)
// const questions = [
//     { question: "What is the capital of France?", answers: ["Paris", "Lyon", "Marseille", "Toulouse"], correct: 0 },
//     { question: "What is 2 + 2?", answers: ["3", "4", "5", "6"], correct: 1 },
//     { question: "Who wrote 'Hamlet'?", answers: ["Marlowe", "Shakespeare", "Dickens", "Austen"], correct: 1 }
// ];

// let currentQuestionIndex = 0;
// let score = 0;

// // Start the quiz and display the first question
// function startQuiz() {
//     updateQuizArea();
// }

// // Update the quiz area with the current question
// function updateQuizArea() {
//     document.querySelector('main').innerHTML = generateQuestionHTML(currentQuestionIndex);
//     attachEventListeners();
// }

// // Generate the HTML for each question
// function generateQuestionHTML(index) {
//     const question = questions[index];
//     return `
//         <h2>${question.question}</h2>
//         <ul class="answer-list">
//             ${question.answers.map((answer, i) => `<li><button id="answer-${i}">${answer}</button></li>`).join('')}
//         </ul>
//         <div class="result-message"></div>
//     `;
// }

// // Attach event listeners to answer buttons
// function attachEventListeners() {
//     const answers = questions[currentQuestionIndex].answers;
//     answers.forEach((_, i) => {
//         document.getElementById(`answer-${i}`).onclick = () => selectAnswer(i, currentQuestionIndex);
//     });
// }

// // Process the selected answer and update UI accordingly
// function selectAnswer(selectedIndex, questionIndex) {
//     const question = questions[questionIndex];
//     const resultMessage = document.querySelector('.result-message');
//     if (selectedIndex === question.correct) {
//         score++;
//         resultMessage.innerHTML = 'Correct!';
//         resultMessage.style.color = 'green'; // Change text color on correct
//     } else {
//         resultMessage.innerHTML = 'Wrong!';
//         resultMessage.style.color = 'red'; // Change text color on wrong
//     }
//     if (currentQuestionIndex < questions.length - 1) {
//         currentQuestionIndex++;
//         setTimeout(() => updateQuizArea(), 1500); // Add a delay before next question
//     } else {
//         setTimeout(() => displayResults(), 1500); // Show results after a delay
//     }
// }

// // Display final results and offer to restart the quiz
// function displayResults() {
//     document.querySelector('main').innerHTML = `
//         <h2>Your score: ${score} out of ${questions.length}</h2>
//         <button onclick="restartQuiz()">Restart Quiz</button>
//     `;
// }

// // Restart the quiz
// function restartQuiz() {
//     currentQuestionIndex = 0;
//     score = 0;
//     startQuiz();
// }


// after api code will be as:
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startQuizButton');
    if (startButton) {
        console.log('Start button is found, setting up click listener.');
        startButton.addEventListener('click', fetchQuestions);
    } else {
        console.error('Start button not found in the document.');
    }
});

let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let totalSeconds = 0;

function fetchQuestions() {
    const url = 'https://opentdb.com/api.php?amount=20&type=multiple';
    console.log('Fetching questions from:', url);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            if (data.response_code === 0) {
                console.log('Questions fetched successfully, formatting questions.');
                formatQuestions(data.results);
            } else {
                console.error('Failed to fetch questions, response code:', data.response_code);
            }
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

function formatQuestions(questions) {
    currentQuestions = questions.map(q => ({
        question: q.question,
        answers: [...q.incorrect_answers, q.correct_answer].sort(() => 0.5 - Math.random()),
        correct: q.correct_answer
    }));
    console.log('Questions formatted, starting quiz.');
    startQuiz();
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.querySelector('.timer').style.display = 'block';
    startTimer();
    updateQuizArea();
}

function updateQuizArea() {
    if (currentQuestionIndex < currentQuestions.length) {
        console.log(`Displaying question ${currentQuestionIndex + 1}`);
        document.querySelector('main').innerHTML = generateQuestionHTML(currentQuestions[currentQuestionIndex]);
        attachEventListeners();
    } else {
        console.log('No more questions, displaying results.');
        displayResults();
    }
}

function generateQuestionHTML(question) {
    let answerIndex = question.answers.findIndex(answer => answer === question.correct);
    return `
        <h2>${question.question}</h2>
        <ul class="answer-list">
            ${question.answers.map((answer, i) => `<li><button id="answer-${i}" class="${i === answerIndex ? 'correct' : ''}">${answer}</button></li>`).join('')}
        </ul>
        <div class="result-message"></div>
    `;
}

function attachEventListeners() {
    currentQuestions[currentQuestionIndex].answers.forEach((answer, i) => {
        document.getElementById(`answer-${i}`).onclick = () => {
            console.log(`Answer ${i} clicked.`);
            selectAnswer(answer === currentQuestions[currentQuestionIndex].correct);
        };
    });
}

function selectAnswer(isCorrect) {
    const resultMessage = document.querySelector('.result-message');
    if (isCorrect) {
        score++;
        resultMessage.textContent = 'Correct!';
        resultMessage.style.color = 'green';
    } else {
        resultMessage.textContent = 'Wrong!';
        resultMessage.style.color = 'red';
    }
    currentQuestionIndex++;
    setTimeout(() => updateQuizArea(), 1000);
}

function displayResults() {
    stopTimer();
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    document.querySelector('main').innerHTML = `
        <h2>Your score: ${score} out of 20</h2>
        <p>Time taken: ${minutes} minutes and ${seconds} seconds</p>
        <button onclick="restartQuiz()">Restart Quiz</button>
    `;
}

function startTimer() {
    if (timerInterval) {
        console.log('Clearing existing timer interval.');
        clearInterval(timerInterval);
    }
    totalSeconds = 0;
    timerInterval = setInterval(() => {
        totalSeconds++;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        document.querySelector('.timer').innerHTML = `Time: ${pad(minutes)}:${pad(seconds)}`;
    }, 1000);
    console.log('Timer started.');
}

function pad(val) {
    return val < 10 ? `0${val}` : val;
}

function stopTimer() {
    console.log('Stopping timer.');
    clearInterval(timerInterval);
}

function restartQuiz() {
    console.log('Restarting quiz.');
    stopTimer();
    fetchQuestions();
}
























// ----------------------------------timer------------------------------
// let timerInterval;
// let totalSeconds = 0;

// function startTimer() {
//     totalSeconds = 0;  // Reset the timer to 0 each time the quiz starts
//     document.querySelector('.timer').innerHTML = "Time: 00:00"; // Initialize timer display
//     timerInterval = setInterval(() => {
//         totalSeconds++;
//         let minutes = Math.floor(totalSeconds / 60);
//         let seconds = totalSeconds % 60;
//         document.querySelector('.timer').innerHTML = `Time: ${pad(minutes)}:${pad(seconds)}`;
//     }, 1000);
// }

// function pad(val) {
//     return val < 10 ? `0${val}` : val;
// }

// function stopTimer() {
//     clearInterval(timerInterval);
//     let minutes = Math.floor(totalSeconds / 60);
//     let seconds = totalSeconds % 60;
//     return `${minutes} minutes and ${seconds} seconds`; // Return formatted time
// }

// function updateQuizArea() {
//     document.querySelector('main').innerHTML = generateQuestionHTML(currentQuestionIndex);
//     attachEventListeners(); // Make sure this is called after HTML is updated
// }

// // Call startTimer in startQuiz
// function startQuiz() {
//     document.querySelector('.timer').style.display = 'block'; // Ensure timer is visible
//     startTimer();
//     updateQuizArea();
// }

// // Modify displayResults to show time properly
// function displayResults() {
//     let timeTaken = stopTimer();
//     document.querySelector('main').innerHTML = `
//         <h2>Your score: ${score} out of ${questions.length}</h2>
//         <p>Time taken: ${timeTaken}</p>
//         <button onclick="restartQuiz()">Restart Quiz</button>
//     `;
// }

// // Make sure timer is stopped and reset on restart
// function restartQuiz() {
//     currentQuestionIndex = 0;
//     score = 0;
//     document.querySelector('.timer').style.display = 'none'; // Hide timer until restart
//     startQuiz();
// }
