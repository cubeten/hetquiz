// Function to load questions from the JSON file
function loadQuestions() {
    return fetch('questions.json')
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.error("Error loading questions:", error);
        });
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
    return array;
}

// Function to start the quiz after loading questions
function startQuiz() {
    const numQuestions = parseInt(document.getElementById('num-questions').value);
    
    // Load the questions from the JSON file
    loadQuestions().then(questions => {
        // Shuffle the loaded questions and pick the required number
        const shuffledQuestions = shuffleArray([...questions]);
        const selectedQuestions = shuffledQuestions.slice(0, Math.min(numQuestions, shuffledQuestions.length));

        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = ''; // Clear any previous quiz data
        quizContainer.style.display = 'block'; // Ensure the container is visible

        // Display all selected random questions
        selectedQuestions.forEach((question, questionIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-block');

            const questionText = document.createElement('h3');
            questionText.innerText = `Question ${questionIndex + 1}: ${question.question}`;
            questionDiv.appendChild(questionText);

            // Shuffle the options for each question
            const shuffledOptions = shuffleArray([...question.options]); // Shuffle the options

            // Render each option as a radio button
            shuffledOptions.forEach((option, optionIndex) => {
                const optionLabel = document.createElement('label');
                const optionInput = document.createElement('input');

                optionInput.type = 'radio';
                optionInput.name = `question-${questionIndex}`; // Group options for each question
                optionInput.value = option; // Use the option text as the value

                optionLabel.appendChild(optionInput);
                optionLabel.appendChild(document.createTextNode(option));

                questionDiv.appendChild(optionLabel);
                questionDiv.appendChild(document.createElement('br'));
            });

            quizContainer.appendChild(questionDiv);
        });

        // Add the submit button to collect answers
        const submitButton = document.createElement('button');
        submitButton.innerText = 'Submit Quiz';
        submitButton.classList.add('button');
        submitButton.onclick = function () {
            collectAnswers(selectedQuestions);
        };
        quizContainer.appendChild(submitButton);
    });
}

// Function to collect user's answers and display results
function collectAnswers(selectedQuestions) {
    const userAnswers = selectedQuestions.map((_, questionIndex) => {
        const selectedOption = document.querySelector(`input[name="question-${questionIndex}"]:checked`);
        return selectedOption ? selectedOption.value : null; // Store user answer
    });

    displayResults(selectedQuestions, userAnswers); // Display results after submission
}

// Function to display results at the end of the quiz
function displayResults(questions, userAnswers) {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = ''; // Clear the quiz container

    let correctCount = 0; // Count of correct answers

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('result-question');

        const questionText = document.createElement('h3');
        questionText.innerText = `Question ${index + 1}: ${question.question}`;
        questionDiv.appendChild(questionText);

        // Display each option and highlight accordingly
        question.options.forEach((option, optionIndex) => {
            const optionElement = document.createElement('p');
            optionElement.innerText = option;

            if (optionIndex === question.correctAnswer) {
                optionElement.style.color = 'green'; // Correct answer highlighted in green
            }

            // Compare user's answer with correct answer
            if (option === userAnswers[index]) {
                if (optionIndex === question.correctAnswer) {
                    correctCount++; // Increment correct count
                } else {
                    optionElement.style.color = 'red'; // Wrong answer highlighted in red
                }
            }

            questionDiv.appendChild(optionElement);
        });

        quizContainer.appendChild(questionDiv);
    });

    // Calculate the percentage score
    const scorePercentage = (correctCount / questions.length) * 100;

    // Display the score and pass/fail message
    const resultMessage = document.createElement('h2');
    resultMessage.innerText = `Your score: ${scorePercentage.toFixed(2)}%`;
    resultMessage.style.color = scorePercentage >= 70 ? 'green' : 'red'; // Pass mark set at 70%
    quizContainer.appendChild(resultMessage);

    quizContainer.style.display = 'block'; // Ensure it's visible
}
