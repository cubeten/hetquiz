let questions = []; // This will hold the questions loaded from the JSON

// Load questions from the JSON file on page load
window.onload = function() {
    loadQuestions();
    updateOptionFields(); // Ensure the options are set correctly on load
};

// Function to load questions from the JSON file
function loadQuestions() {
    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            questions = data; // Save the loaded questions
            displayQuestions(); // Display the loaded questions
        })
        .catch(error => {
            console.error("Error loading questions:", error);
            alert('Failed to load questions. Please check the console for details.'); // Alert user of error
        });
}

// Function to display all questions
function displayQuestions() {
    const questionsContainer = document.getElementById('questions-container');
    questionsContainer.innerHTML = ''; // Clear previous questions

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-item');

        const questionText = document.createElement('textarea');
        questionText.value = question.question; // Set the current question text
        questionText.classList.add('question-text'); // Apply the new class
        questionText.disabled = true; // Start in non-editable mode
        questionText.oninput = function() { autoResize(this); }; // Enable auto-resizing
        autoResize(questionText); // Ensure it fits on load

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        // Create option textareas and radio buttons for correct answer selection
        question.options.forEach((option, optionIndex) => {
            const optionDiv = document.createElement('div'); // Create a container for the option

            const optionInput = document.createElement('textarea');
            optionInput.value = option; // Set the current option text
            optionInput.classList.add('option-text'); // Optional class for styling
            optionInput.disabled = true; // Start in non-editable mode
            optionInput.oninput = function() { autoResize(this); }; // Enable auto-resizing
            autoResize(optionInput); // Ensure it fits on load
            optionDiv.appendChild(optionInput);

            // Create a radio button for the correct answer selection
            const correctAnswerRadio = document.createElement('input');
            correctAnswerRadio.type = 'radio';
            correctAnswerRadio.name = `correct-answer-${index}`; // Group by question index
            correctAnswerRadio.value = optionIndex; // Store the index of the option
            correctAnswerRadio.checked = optionIndex === question.correctAnswer; // Check if this is the correct answer
            optionDiv.appendChild(correctAnswerRadio); // Append the radio button to the option div

            optionsContainer.appendChild(optionDiv); // Append the option div to the options container
        });

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit';
        editButton.onclick = function() {
            questionText.disabled = false; // Enable editing of the question
            Array.from(optionsContainer.querySelectorAll('textarea')).forEach(input => {
                input.disabled = false; // Enable editing of the options
            });
            editButton.style.display = 'none'; // Hide the Edit button
            saveButton.style.display = 'inline'; // Show the Save button
        };

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save Changes';
        saveButton.onclick = function() {
            const selectedAnswer = optionsContainer.querySelector('input[name="correct-answer-' + index + '"]:checked');
            const correctAnswerIndex = selectedAnswer ? parseInt(selectedAnswer.value) : null;

            saveChanges(index, questionText.value, Array.from(optionsContainer.querySelectorAll('textarea')).map(textarea => textarea.value), correctAnswerIndex);
            editButton.style.display = 'inline'; // Show the Edit button again
            saveButton.style.display = 'none'; // Hide the Save button
            questionText.disabled = true; // Disable editing of the question
            Array.from(optionsContainer.querySelectorAll('textarea')).forEach(input => {
                input.disabled = true; // Disable editing of the options
            });
        };
        saveButton.style.display = 'none'; // Initially hide the Save button

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('edit-buttons');
        buttonsContainer.appendChild(editButton);
        buttonsContainer.appendChild(saveButton);

        questionDiv.appendChild(questionText);
        questionDiv.appendChild(optionsContainer);
        questionDiv.appendChild(buttonsContainer);
        questionsContainer.appendChild(questionDiv);
    });
}

// Function to update the number of options based on user input
function updateOptionFields() {
    const numOptionsInput = document.getElementById('num-options');
    const numOptions = parseInt(numOptionsInput.value);
    const optionsContainer = document.getElementById('options-container');

    // Get the current number of option textareas
    const currentOptions = optionsContainer.querySelectorAll('textarea');
    const currentLength = currentOptions.length;

    // If current options are less than required, add new textareas
    if (currentLength < numOptions) {
        for (let i = currentLength; i < numOptions; i++) {
            const optionLabel = document.createElement('label');
            optionLabel.innerText = `Option ${i + 1}:`;
            optionsContainer.appendChild(optionLabel);

            const optionTextarea = document.createElement('textarea');
            optionTextarea.rows = 1;
            optionTextarea.oninput = function() { autoResize(this); };
            optionsContainer.appendChild(optionTextarea);
        }
    }
    // If current options are more than required, remove excess textareas
    else if (currentLength > numOptions) {
        for (let i = currentLength; i > numOptions; i--) {
            optionsContainer.removeChild(currentOptions[i - 1].previousElementSibling); // Remove label
            optionsContainer.removeChild(currentOptions[i - 1]); // Remove textarea
        }
    }
}

// Function to save the changes made to a question
function saveChanges(index, questionText, options, correctAnswerIndex) {
    questions[index].question = questionText;
    questions[index].options = options;
    questions[index].correctAnswer = correctAnswerIndex; // Update the correct answer index

    alert('Question updated successfully!'); // Optional confirmation message
    // Here you might want to save the updated questions back to the JSON file if needed
}

// Auto-resizing function for textareas
function autoResize(textarea) {
    textarea.style.height = 'auto'; // Reset the height to auto
    textarea.style.height = textarea.scrollHeight + 'px'; // Set the height based on scroll height
}

// Function to add a new question (as previously implemented)
function addNewQuestion() {
    // Your existing code for adding a new question
}
