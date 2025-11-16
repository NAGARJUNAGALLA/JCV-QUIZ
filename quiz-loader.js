let current = 0;
let questions = [];

async function loadQuiz() {
    const res = await fetch("questions.json");
    questions = await res.json();
    showQuestion();
}

function showQuestion() {
    const q = questions[current];
    document.getElementById("quiz-container").innerHTML = `
        <h3>Q${current + 1}. ${q.q}</h3>
        ${q.options.map((opt, i) => `
            <div class="option" onclick="checkAnswer(${i})">${opt}</div>
        `).join("")}
        <br>
        <button onclick="next()">Next</button>
    `;
}

function checkAnswer(i) {
    const q = questions[current];
    const options = document.querySelectorAll(".option");

    options.forEach((opt, idx) => {
        if (idx === q.answerId) opt.classList.add("correct");
        else if (idx === i) opt.classList.add("wrong");
    });
}

function next() {
    current++;
    if (current >= questions.length) {
        document.getElementById("quiz-container").innerHTML =
            `<h2>Quiz Completed 🎉</h2>`;
        return;
    }
    showQuestion();
}

loadQuiz();
