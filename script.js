'use strict';

// Selecting Elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');


// Starting Conditions

let scores, currentScore, activePlayer, playing, winningScore;

function showWinningScorePrompt() {
    document.getElementById('winOverlay').style.display = 'none';
    document.getElementById('scorePromptOverlay').style.display = 'flex';
}

function submitWinningScore() {
    const input = document.getElementById('scoreInput').value;
    const parsed = Number(input);
    winningScore = parsed > 0 ? parsed : 100;
    document.getElementById('scorePromptOverlay').style.display = 'none';
    startGame();
}

function cancelWinningScore() {
    winningScore = 100;
    document.getElementById('scorePromptOverlay').style.display = 'none';
    startGame();
}


function startGame() {
    document.getElementById('winOverlay').style.display = 'none';
    score0El.textContent = 0;
    score1El.textContent = 0;
    diceEl.classList.add('hidden');
    current0El.textContent = 0;
    current1El.textContent = 0;

    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;

    player0El.classList.remove('player--winner');
    player1El.classList.remove('player--winner');
    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');

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
        // Generate random dice roll
        const dice = Math.trunc(Math.random() * 6) + 1;

        // Display dice roll
        diceEl.classList.remove('hidden');
        diceEl.src = `dice-${dice}.png`;

        // Check to see if dice roll is 1
        if (dice !== 1) {
            // add dice to current score
            currentScore += dice;
            document.getElementById(`current--${activePlayer}`).textContent = currentScore;
        } else {
            // switch to next player
            switchPlayer();
        }
    }
});

//player selects button hold
btnHold.addEventListener('click', function () {
    if (playing) {
        // Add active player currentscore to active player score total
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

        // Check to see if active player score is 100
        if (scores[activePlayer] >= winningScore) {
            document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
            document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
            playing = false;
            diceEl.classList.remove('hidden');

            // 🎉 Show win overlay message
            const winOverlay = document.getElementById('winOverlay');
            const winMessage = document.getElementById('winMessage');
            winMessage.textContent = `🎉 Player ${activePlayer + 1} Wins! 🎉`;
            winMessage.classList.remove('hidden');
            winOverlay.style.display = 'flex';
        }
        else {
            // Move to next player
            switchPlayer();
        }

    }
})

btnNew.addEventListener('click', showWinningScorePrompt);
document.getElementById('btnWinNewGame').addEventListener('click', showWinningScorePrompt);

