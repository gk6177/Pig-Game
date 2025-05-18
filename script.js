'use strict';

// Selecting Elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

// Starting Conditions
let scores, currentScore, activePlayer, playing, winningScore;

function showWinningScorePrompt() {
    document.getElementById('winOverlay').classList.remove('active');
    const input = document.getElementById('scoreInput');
    input.value = '';
    document.getElementById('scorePromptOverlay').classList.add('active');
    input.focus();
}

function submitWinningScore() {
    const input = document.getElementById('scoreInput').value;
    const parsed = Number(input);
    winningScore = parsed > 0 ? parsed : 100;
    document.getElementById('scorePromptOverlay').classList.remove('active');
    startGame();
}

function cancelWinningScore() {
    winningScore = 100;
    document.getElementById('scorePromptOverlay').classList.remove('active');
    startGame();
}

function startGame() {
    document.getElementById('winOverlay').classList.remove('active');
    score0El.textContent = 0;
    score1El.textContent = 0;
    diceEl.classList.remove('show');
    current0El.textContent = 0;
    current1El.textContent = 0;
    btnRoll.disabled = false;
    btnHold.disabled = false;

    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    player0El.classList.remove('player--winner');
    player1El.classList.remove('player--winner');
    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');

}

function showWinOverlay() {
    const winOverlay = document.getElementById('winOverlay');
    const winMessage = document.getElementById('winMessage');
    winMessage.textContent = `🎉 Player ${activePlayer + 1} Wins! 🎉`;
    winMessage.classList.remove('hidden');
    winOverlay.classList.add('active');

    vibrate([200, 100, 200]);

    // Play triumph sound
    const yeoahSound = document.getElementById('triumph-sound');
    yeoahSound.currentTime = 0;
    yeoahSound.play();

    // 🎉 Trigger confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function vibrate(pattern) {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    showWinningScorePrompt();
});


const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    currentScore = 0;
    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
}


// Rolling Dice Functionality
btnRoll.addEventListener('click', function () {
    if (playing) {
        const diceSound = document.getElementById('dice-sound');
        const roll1Sound = document.getElementById('roll1-sound');
        // Play dice sound
        diceSound.currentTime = 0;
        diceSound.play();

        // Animate the dice roll
        let rollCount = 10;
        let animationInterval = setInterval(() => {
            const dice = Math.trunc(Math.random() * 6) + 1;
            diceEl.classList.add('show');
            diceEl.classList.add('animate');
            setTimeout(() => {
                diceEl.classList.remove('animate');
            }, 400);

            diceEl.src = `dice-${dice}.png`;
            rollCount--;

            if (rollCount === 0) {
                clearInterval(animationInterval);

                // Final roll to determine game logic
                const finalDice = Math.trunc(Math.random() * 6) + 1;
                diceEl.src = `dice-${finalDice}.png`;

                if (finalDice !== 1) {
                    currentScore += finalDice;
                    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
                } else {
                    // Play dice sound
                    roll1Sound.currentTime = 0;
                    roll1Sound.play();

                    vibrate(100);

                    // ❗ Flash red on 1
                    const playerEl = document.querySelector(`.player--${activePlayer}`);
                    playerEl.classList.add('player--error');
                    setTimeout(() => {
                        playerEl.classList.remove('player--error');
                        switchPlayer();
                    }, 500);
                }
            }
        }, 50); // Speed of animation
    }
});


//player selects button hold
btnHold.addEventListener('click', function () {
    if (playing) {
        const lockSound = document.getElementById('lock-sound');
        // Play lock sound
        lockSound.currentTime = 0;
        lockSound.play();
        // Add active player currentscore to active player score total
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

        // Check to see if active player score is 100
        if (scores[activePlayer] >= winningScore) {
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            playing = false;
            diceEl.classList.remove('hidden');
            btnRoll.disabled = true;
            btnHold.disabled = true;

            // 🎉 Show win overlay message
            showWinOverlay();
        }
        else {
            // Move to next player
            switchPlayer();
        }

    }
})

document.getElementById('btnWinNewGame').addEventListener('click', showWinningScorePrompt);



