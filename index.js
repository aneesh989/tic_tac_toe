let boxes = document.querySelectorAll(".box");
let reset = document.querySelector(".reset");
let newGame = document.querySelector(".newGame");
let msgContainer = document.querySelector(".msgContainer");
let msg = document.querySelector(".winner");
let count = 0;

let turno = true; // Player's turn by default

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const resetGame = () => {
  turno = true;
  enableBoxes();
  count = 0;
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turno) {
      playerMove(box);
    }
    // Check for a winner after the player's move
    let isWinner = checkWinner();
    if (count === 9 && !isWinner) {
      gameDraw();
    }

    // Computer's turn
    if (!turno && count < 9 && !isWinner) {
      setTimeout(() => computerMove(), 100); // Introduce a delay for better user experience
    }
  });
});

const playerMove = (box) => {
  if (box.innerText === "") {
    box.innerText = "X";
    turno = !turno;
    box.disabled = true;
    count++;
  }
};

const computerMove = () => {
  let emptyBoxes = Array.from(boxes).filter((box) => box.innerText === "");

  // Check for a winning move
  for (let pattern of winPatterns) {
    let [p1, p2, p3] = pattern.map((index) => boxes[index].innerText);

    if ((p1 === "O" && p2 === "O" && p3 === "") || (p1 === "" && p2 === "O" && p3 === "O") || (p1 === "O" && p2 === "" && p3 === "O")) {
      let winningIndex = pattern.find((index) => boxes[index].innerText === "");
      if (winningIndex !== undefined) {
        boxes[winningIndex].innerText = "O";
        turno = !turno;
        boxes[winningIndex].disabled = true;
        count++;
        checkWinner();
        return;
      }
    }
  }

  // Block the player from winning
  for (let pattern of winPatterns) {
    let [p1, p2, p3] = pattern.map((index) => boxes[index].innerText);

    if ((p1 === "X" && p2 === "X" && p3 === "") || (p1 === "" && p2 === "X" && p3 === "X") || (p1 === "X" && p2 === "" && p3 === "X")) {
      let blockingIndex = pattern.find((index) => boxes[index].innerText === "");
      if (blockingIndex !== undefined) {
        boxes[blockingIndex].innerText = "O";
        turno = !turno;
        boxes[blockingIndex].disabled = true;
        count++;
        checkWinner();
        return;
      }
    }
  }

  // If no winning or blocking move, choose a random empty box
  let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
  let selectedBox = emptyBoxes[randomIndex];

  if (selectedBox) {
    selectedBox.innerText = "O";
    turno = !turno;
    selectedBox.disabled = true;
    count++;
    checkWinner();
  }
};

const gameDraw = () => {
  showMessage("Game is draw");
  disableBoxes();
};

const disableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = true;
  });
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("text-red-500"); // Remove any styling applied by the computer's move
    msgContainer.classList.add("hidden");
  });
};

const showMessage = (message) => {
  msg.innerText = message;
  msgContainer.classList.remove("hidden");
};

const showWinner = (winner) => {
  showMessage(`Congratulations, Winner is ${winner}`);
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let [p1, p2, p3] = pattern.map((index) => boxes[index].innerText);

    if (p1 !== "" && p1 === p2 && p2 === p3) {
      // Highlight the winning combination
      pattern.forEach((index) => boxes[index].classList.add("text-red-500"));
      showWinner(p1);
      return true;
    }
  }
  return false;
};

newGame.addEventListener("click", resetGame);
reset.addEventListener("click", resetGame);
