let mainPanel = document.querySelector(".menu");
let modePanel = document.querySelector(".modeMenu");
let gamePanel = document.querySelector(".game");

mainPanel.addEventListener("click", mainBtnHandler);
modePanel.addEventListener("click", modeBtnHandler);
gamePanel.addEventListener("click", gameBtnHandler);

function mainBtnHandler(event) {
  let text = event.target.innerText;

  if (text == "Play!") {
    mainPanel.style.display = "none";
    gamePanel.style.display = "grid";
  } else if (text == "Choose Category") {
    mainPanel.style.display = "none";
    modePanel.style.display = "grid";
  }
}

function modeBtnHandler(event) {
  let text = event.target.innerText.toLowerCase();

  modePanel.style.display = "none";
  gamePanel.style.display = "grid";
  newGame(text);
}

function newGame(Category) {}
