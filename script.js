const emojis = [
  "🐶","🐱","🦁","🐯","🐼","🐵","🐸","🦊","🐰",
  "🐻","🐨","🐷","🐔","🐧","🦉","🐙","🦄","🐢"
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = true;

let time = 90;
let lives = 8;
let score = 0;
let combo = 0;
let timer;

const game = document.getElementById("game");
const timeText = document.getElementById("time");
const livesText = document.getElementById("lives");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");

function startGame() {
  game.innerHTML = "";
  firstCard = null;
  secondCard = null;
  lockBoard = true;

  time = 90;
  lives = 8;
  score = 0;
  combo = 0;

  updateUI();

  cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

  cards.forEach((emoji) => {
    const card = document.createElement("div");
    card.className = "card open";
    card.innerText = emoji;

    card.addEventListener("click", () => flipCard(card));
    game.appendChild(card);
  });

  message.innerText = "5 second me cards yaad karo...";

  setTimeout(() => {
    document.querySelectorAll(".card").forEach(card => {
      card.classList.remove("open");
      card.classList.add("hidden");
    });

    lockBoard = false;
    message.innerText = "Ab match karo!";
    startTimer();
  }, 5000);
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) return;
  if (!card.classList.contains("hidden")) return;

  card.classList.remove("hidden");
  card.classList.add("open");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkMatch();
}

function checkMatch() {
  lockBoard = true;

  if (firstCard.innerText === secondCard.innerText) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    combo++;
    score += 100 * combo;

    resetCards();
    updateUI();
    checkWin();
  } else {
    combo = 0;
    lives--;
    score -= 25;

    firstCard.classList.add("wrong");
    secondCard.classList.add("wrong");

    updateUI();

    setTimeout(() => {
      firstCard.classList.remove("open", "wrong");
      secondCard.classList.remove("open", "wrong");

      firstCard.classList.add("hidden");
      secondCard.classList.add("hidden");

      resetCards();

      if (lives <= 0) {
        gameOver("💀 Lives khatam! Game Over");
      }
    }, 700);
  }
}

function resetCards() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    time--;
    updateUI();

    if (time <= 0) {
      gameOver("⏰ Time khatam! Game Over");
    }
  }, 1000);
}

function checkWin() {
  const matchedCards = document.querySelectorAll(".matched");

  if (matchedCards.length === cards.length) {
    clearInterval(timer);
    message.innerText = "🏆 You Win! Final Score: " + score;
    lockBoard = true;
  }
}

function gameOver(text) {
  clearInterval(timer);
  message.innerText = text;
  lockBoard = true;
}

function updateUI() {
  timeText.innerText = time;
  livesText.innerText = lives;
  scoreText.innerText = score;
}

function restartGame() {
  clearInterval(timer);
  startGame();
}

startGame();
