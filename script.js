"use strict";

const Player = function (name, sign) {
  let active = sign === "X";
  let score = 0;

  const win = function () {
    this.score += 1;
  };
  const switchActive = function () {
    this.active = !this.active;
  };

  return { name, sign, score, active, win, switchActive };
};
// Global variables
// Move them to module or
const startBtn = document.querySelector(".start");
const form = document.querySelector("form");
const main = document.querySelector(".main");
let player1, player2;
startBtn.addEventListener("click", function (e) {
  e.preventDefault();
  player1 = Player(document.querySelector("#player1").value, "X");
  player2 = Player(document.querySelector("#player2").value, "O");
  displayController.updateScoreboard();
  form.style.display = "none";
  main.style.display = "grid";
});

// It is going to be IIFE
const gameBoard = (function () {
  let gameOver = false;
  let winnerSign;
  const field = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];

  const checkResult = function () {
    //Row Condition
    for (let i = 0; i <= 6; i += 3) {
      if (
        this.field[i] !== undefined &&
        this.field[i] === this.field[i + 1] &&
        this.field[i] === this.field[i + 2]
      ) {
        console.log("row condition");
        this.gameOver = true;
        this.winnerSign = this.field[i];
      }
    }
    //Column Condition
    for (let i = 0; i <= 2; i++) {
      if (
        this.field[i] !== undefined &&
        this.field[i] === this.field[i + 3] &&
        this.field[i] === this.field[i + 6]
      ) {
        this.gameOver = true;
        this.winnerSign = this.field[i];
      }
    }
    //Diagonal Condition
    if (
      this.field[0] !== undefined &&
      this.field[0] === this.field[4] &&
      this.field[0] === this.field[8]
    ) {
      this.gameOver = true;
      this.winnerSign = this.field[4];
    }
    if (
      this.field[2] !== undefined &&
      this.field[2] === this.field[4] &&
      this.field[2] === this.field[6]
    ) {
      this.gameOver = true;
      this.winnerSign = this.field[4];
    }
    //For draw reult
    if (!this.field.includes(undefined)) {
      this.gameOver = true;
    }
  };

  const resetResult = function () {
    this.gameOver = false;
    this.winnerSign = undefined;
  };

  return { field, checkResult, resetResult, gameOver, winnerSign };
})();

const displayController = (function () {
  const field = document.querySelector(".field");
  const signPlayer1Scoreboard = document.querySelector(".sign-player1");
  const signPlayer2Scoreboard = document.querySelector(".sign-player2");
  let index;

  const nextRound = function () {
    const resultEl = document.querySelector(".result");
    console.log("in next round func");
    gameBoard.field = [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ];
    field.innerHTML = "";
    const cells = Array.from(document.querySelectorAll(".field div"));
    gameBoard.resetResult();
    cells.forEach((cell) => (cell.textContent = ""));
    player1.active = true;
    player2.active = false;
    signPlayer1Scoreboard.classList.add("active");
    signPlayer2Scoreboard.classList.remove("active");
    resultEl.textContent = "";
    renderField();
    attachCellHandler();
  };

  // Function that create scoreboard
  const updateScoreboard = function () {
    console.log("We are in scoreboard");
    document.querySelector(".name-player1").textContent = player1.name;
    document.querySelector(".name-player2").textContent = player2.name;
    document.querySelector(".sign-player1").textContent = player1.sign;
    document.querySelector(".sign-player2").textContent = player2.sign;
    document.querySelector(".score-player1").textContent = player1.score;
    document.querySelector(".score-player2").textContent = player2.score;
  };

  // Function that render game field
  const renderField = function () {
    console.log(gameBoard.field);
    gameBoard.field.forEach((item, i) => {
      const cell = document.createElement("div");
      cell.classList.add(`cell-${i}`);
      cell.textContent = item;
      field.appendChild(cell);
    });
    // updateScoreboard();
  };
  //Add event handler to field's cell
  const cellHandler = function (e) {
    if (!this.textContent) {
      const activePlayer = player1.active ? player1 : player2;
      index = Number(e.target.classList[0][5]);
      gameBoard.field[index] = activePlayer.sign;
      this.textContent = activePlayer.sign;
      player1.switchActive();
      player2.switchActive();
      gameBoard.checkResult();
      showResultMessage();
      signPlayer1Scoreboard.classList.toggle("active");
      signPlayer2Scoreboard.classList.toggle("active");
      //   console.log(gameBoard.gameOver);
    }
  };
  const attachCellHandler = function () {
    const cells = Array.from(document.querySelectorAll(".field div"));
    cells.forEach((cell) => {
      cell.addEventListener("click", cellHandler);
    });
  };

  const removeCellHandler = function () {
    const cells = Array.from(document.querySelectorAll(".field div"));
    cells.forEach((cell) => {
      cell.removeEventListener("click", cellHandler);
    });
  };

  const showResultMessage = function () {
    const resultEl = document.querySelector(".result");
    if (gameBoard.gameOver && gameBoard.winnerSign) {
      removeCellHandler();
      const winnerPlayer =
        gameBoard.winnerSign === player1.sign ? player1 : player2;
      winnerPlayer.score += 1;
      resultEl.textContent = `${winnerPlayer.name} is Win this round`;
      updateScoreboard();
      setTimeout(nextRound, 3000);
      console.log(gameBoard.gameOver);
    } else if (gameBoard.gameOver) {
      resultEl.textContent = "End In Draw!!!";
      setTimeout(nextRound, 3000);
    }
  };

  return { renderField, attachCellHandler, updateScoreboard };
})();

// Not sure about it
const gameFlow = (function () {
  displayController.renderField();
  displayController.attachCellHandler();
  //   displayController.showResultMessage();
})();
