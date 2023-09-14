let mainPanel = document.querySelector(".menu");
let modePanel = document.querySelector(".modeMenu");
let gamePanel = document.querySelector(".game");
const apiLink = "https://www.wordgamedb.com/api/v1/words/";

mainPanel.addEventListener("click", mainBtnHandler);
modePanel.addEventListener("click", modeBtnHandler);
//gamePanel.addEventListener("click", gameBtnHandler);

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
  newGame(text);
}

function newGame(Category) {
  if (Category != "all") {
    fetch(apiLink + "?category=" + Category)
      .then((Response) => Response.text())
      .then((words) => {
        let myWords = JSON.parse(words);
        updateGameUI(myWords[Math.floor(Math.random() * myWords.length)]);
      });
  } else {
    fetch(apiLink + "random")
      .then((Response) => Response.text())
      .then((word) => {
        let myWord = JSON.parse(word);
        updateGameUI(myWord);
      });
  }
}

function updateGameUI(word) {
  console.log(word);
  gamePanel.querySelector("h2").innerText = word.category;
  gamePanel.querySelector("p").innerText = "Hint : " + word.hint;
  gamePanel.querySelector("img").src = "Img/0.png";

  gamePanel.querySelector("h3").innerText = "";
  for (let i = 0; i < word.numLetters; i++) {
    gamePanel.querySelector("h3").innerText += "_";
  }

  gamePanel.style.display = "grid";
}
