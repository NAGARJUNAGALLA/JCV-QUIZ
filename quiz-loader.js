const USERS_URL = "https://nagarjunagalla.github.io/JCV-QUIZ/users.json";
const QUESTIONS_URL = "https://nagarjunagalla.github.io/JCV-QUIZ/questions.json";

const QuizLoader = {
    async sha256hex(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        return [...new Uint8Array(hashBuffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    },

    async login() {
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Enter username & password");
            return;
        }

        console.log("Fetching users…");
        let users;
        try {
            users = await fetch(USERS_URL).then(r => r.json());
        } catch (e) {
            alert("Cannot load users.json");
            console.log(e);
            return;
        }

        const user = users.find(u => u.username === username);
        if (!user) {
            alert("Invalid username");
            return;
        }

        const hashed = await this.sha256hex(password);

        console.log("You entered hash:", hashed);
        console.log("Stored hash:", user.passwordHash);

        if (hashed !== user.passwordHash) {
            alert("Wrong password");
            return;
        }

        localStorage.setItem("loggedUser", username);
        this.startQuiz();
    },

    async startQuiz() {
        let container = document.getElementById("quiz-container");
        container.innerHTML = "<h3>Loading Questions…</h3>";

        let questions;
        try {
            questions = await fetch(QUESTIONS_URL).then(r => r.json());
        } catch (e) {
            alert("Cannot load questions.json");
            return;
        }

        this.current = 0;
        this.questions = questions;

        this.showQuestion();
    },

    showQuestion() {
        const q = this.questions[this.current];
        const container = document.getElementById("quiz-container");

        container.innerHTML = `
            <h3>Question ${this.current + 1}</h3>
            <p>${q.q}</p>
            ${q.options.map((opt, i) =>
                `<button onclick="QuizLoader.checkAnswer(${i}, ${q.answerId})">${opt}</button>`
            ).join("")}
        `;
    },

    checkAnswer(selected, correct) {
        alert(selected === correct ? "Correct!" : "Wrong!");

        this.current++;

        if (this.current >= this.questions.length) {
            document.getElementById("quiz-container").innerHTML =
                "<h2>Quiz Completed!</h2>";
            return;
        }

        this.showQuestion();
    }
};
