let mainPanel = document.querySelector(".menu");
let modePanel = document.querySelector(".modeMenu");
let gamePanel = document.querySelector(".game");
const apiLink = "https://www.wordgamedb.com/api/v1/words/";

mainPanel.addEventListener("click", mainBtnHandler);
modePanel.addEventListener("click", modeBtnHandler);
gamePanel.addEventListener("click", gameBtnHandler);

function mainBtnHandler(event) {
  let text = event.target.innerText;

  if (text == "Play!") {
    mainPanel.style.display = "none";
    newGame();
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
  localStorage.setItem("wrongAnswer", 0);

  if (Category != "all" && Category != null) {
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
        updateGameUI(JSON.parse(word));
      });
  }
}

function updateGameUI(word) {
  localStorage.setItem("currentWord", word.word);
  gamePanel.querySelector("h2").innerText = word.category;
  gamePanel.querySelector("p").innerText = "Hint : " + word.hint;
  gamePanel.querySelector("img").src = "Img/0.png";

  gamePanel.querySelector("h3").innerText = "";
  for (let i = 0; i < word.numLetters; i++) {
    gamePanel.querySelector("h3").innerText += "_";
  }

  localStorage.setItem("currentGuess", gamePanel.querySelector("h3").innerText);

  gamePanel.style.display = "grid";
}

function gameBtnHandler(event) {
  let character = event.target.innerText.toLowerCase();
  let word = localStorage.getItem("currentWord");
  let guess = localStorage.getItem("currentGuess");
  let answer = gamePanel.querySelector("h3");

  answer.innerText = "";
  if (word.includes(character)) {
    for (let i = 0; i < word.length; i++) {
      if (word.charAt(i) == character) {
        guess = guess.replaceAt(i, character);
      }
    }
  } else if (character.length == 1) {
    onWrongAnswer(answer);
  }
  answer.innerText = guess;
  localStorage.setItem("currentGuess", guess);

  if (localStorage.getItem("currentWord") == guess) {
    console.log("You Won");
  }
}

function onWrongAnswer(answer) {
  let currentWrong = JSON.parse(localStorage.getItem("wrongAnswer")) + 1;
  localStorage.setItem("wrongAnswer", currentWrong);
  let image = gamePanel.querySelector("img");

  answer.classList.add("false");
  answer.addEventListener("animationend", (e) => {
    answer.classList.remove("false");
  });
  image.src = `Img/${currentWrong}.png`;
  if (currentWrong >= 5) {
    console.log("loose");
  }
}

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};
