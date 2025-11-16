const USERS_URL = "users.json";
const QUESTIONS_URL = "questions.json";

const QuizLoader = {
    async sha256hex(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashHex = [...new Uint8Array(hashBuffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
        return hashHex;
    },

    async login() {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Enter username & password");
            return;
        }

        let users = await fetch(USERS_URL).then(r => r.json());
        const user = users.find(u => u.username === username);

        if (!user) {
            alert("Invalid username");
            return;
        }

        const hashed = await this.sha256hex(password);

        if (hashed !== user.passwordHash) {
            alert("Wrong password");
            return;
        }

        localStorage.setItem("loggedUser", username);
        this.loadQuiz();
    },

    async loadQuiz() {
        let container = document.getElementById("quiz-container");
        container.innerHTML = "<h2>Loading Questions...</h2>";

        const questions = await fetch(QUESTIONS_URL).then(r => r.json());

        let i = 0;
        this.showQuestion(container, questions, i);
    },

    showQuestion(container, questions, i) {
        if (i >= questions.length) {
            container.innerHTML = "<h2>Quiz Completed!</h2>";
            return;
        }

        const q = questions[i];

        container.innerHTML = `
            <h3>Question ${i+1}</h3>
            <p>${q.q}</p>
            <div class="options">
                ${q.options.map((opt, idx) => 
                    `<button onclick="QuizLoader.checkAnswer(${i}, ${idx}, ${q.answerId})">${opt}</button>`
                ).join("")}
            </div>
        `;
    },

    checkAnswer(i, selected, correct) {
        alert(selected === correct ? "Correct!" : "Wrong!");
        this.loadQuiz();
    }
};
