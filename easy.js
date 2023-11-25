const namedisplay = document.getElementById("nickname");
namedisplay.innerHTML = localStorage.getItem("nickname");

const cards = document.querySelectorAll('.memory-card');
const matchedPairsDisplay = document.querySelector('.move-count');
const timerDisplay = document.querySelector('.timer');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let timerStarted = false;
let startTime;
let gameDuration = 30 * 1000;
let intervalId;
let isFirstClick = true;

const successSound = document.getElementById("success");
const failSound = document.getElementById("fail");
const doneAllSound = document.getElementById("doneall");

function playSuccessSound() {
    successSound.currentTime = 0;
    successSound.play();
}

function playFailSound() {
    failSound.currentTime = 1;
    failSound.play();
}

function playDoneAllSound() {
    doneAllSound.currentTime = 0;
    doneAllSound.play();
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!timerStarted) {
        startGameTimer();
        timerStarted = true;
    }

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

    isMatch ? disableCards() : unflipCards();

    if (isMatch) {
        playSuccessSound();
        matchedPairs++;
        updateMatchedPairsDisplay();

        if (matchedPairs === cards.length / 2) {
            stopGameTimer();
            playDoneAllSound();
            setTimeout(() => {
                window.location.href = 'cong.html';
                localStorage.setItem("easyscore", matchedPairs);
            }, 2000);
        }
    }
}

function updateMatchedPairsDisplay() {
    matchedPairsDisplay.textContent = `Matched Pairs: ${matchedPairs}`;
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        playFailSound();

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function startGameTimer() {
    startTime = Date.now();

    intervalId = setInterval(() => {
        const currentTime = Date.now() - startTime;

        if (currentTime >= gameDuration) {
            stopGameTimer();
            playDoneAllSound();
            setTimeout(() => {
                window.location.href = 'end.html';
                localStorage.setItem("easyscore", matchedPairs);
            }, 2000);
            return;
        }

        const timeLeft = gameDuration - currentTime;
        const seconds = Math.floor(timeLeft / 1000);
        const minutes = Math.floor(seconds / 60);

        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${(seconds % 60)
            .toString()
            .padStart(2, '0')}`;
    }, 1000);
}

function stopGameTimer() {
    clearInterval(intervalId);
}

(function shuffle() {
    cards.forEach((card) => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

function handleCardClick() {
    flipCard.call(this);

    if (isFirstClick) {
        startGameTimer();
        isFirstClick = false;
    }
}

cards.forEach((card) => card.addEventListener('click', handleCardClick));
