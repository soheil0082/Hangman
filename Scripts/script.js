let container = document.querySelector(".container");
let mainPanel = document.querySelector(".menu");
let modePanel = document.querySelector(".modeMenu");
let gamePanel = document.querySelector(".game");
let endPanel = document.querySelector(".end");

const apiLink = "https://www.wordgamedb.com/api/v1/words/";

let winSFX = new Audio("SFX/success-fanfare-trumpets-6185.mp3");
let looseSFX = new Audio("SFX/negative_beeps-6008.mp3");
let wrongSFX = new Audio("SFX/wrong-38598.mp3");

mainPanel.addEventListener("click", mainBtnHandler);
modePanel.addEventListener("click", modeBtnHandler);
gamePanel.addEventListener("click", gameBtnHandler);
endPanel.addEventListener("click", endBtnHandler);

//function for handeling main menue button events
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

//function for handeling mode selection menue button events
function modeBtnHandler(event) {
  let text = event.target.innerText.toLowerCase();

  if (text != null && text.length < 8) {
    modePanel.style.display = "none";
    newGame(text);
  }
}

//function for handeling game over menue button events
function endBtnHandler(event) {
  let text = event.target.innerText.toLowerCase();

  if (text == "home") {
    endPanel.style.display = "none";
    mainPanel.style.display = "grid";
    container.style.height = "90vh";
  } else if (text == "next") {
    endPanel.style.display = "none";
    container.style.height = "90vh";
    newGame();
  }
}

//Sends a new request to the API for a new word
function newGame(Category) {
  let elements = document.querySelectorAll(".disabled");

  elements.forEach((element) => {
    element.classList.remove("disabled");
  });

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

//Updates the game page UI with the new word
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

//function for handeling game page button events
function gameBtnHandler(event) {
  if (event.target.classList.contains("disabled")) return;

  let character = event.target.innerText.toLowerCase();
  let word = localStorage.getItem("currentWord");
  let guess = localStorage.getItem("currentGuess");
  let answer = gamePanel.querySelector("h3");

  answer.innerText = "";
  if (word.includes(character)) {
    event.target.classList.add("disabled");
    for (let i = 0; i < word.length; i++) {
      if (word.charAt(i) == character) {
        guess = guess.replaceAt(i, character);
      }
    }
  } else if (character.length == 1) {
    event.target.classList.add("disabled");
    onWrongAnswer(answer);
  }
  answer.innerText = guess;
  localStorage.setItem("currentGuess", guess);

  if (localStorage.getItem("currentWord") == guess) {
    console.log("You Won");
    winSFX.play();
    endGame("w");
  }
}

//updates the hangman image and saves number of mistakes
function onWrongAnswer(answer) {
  wrongSFX.play();
  let currentWrong = JSON.parse(localStorage.getItem("wrongAnswer")) + 1;
  localStorage.setItem("wrongAnswer", currentWrong);
  let image = gamePanel.querySelector("img");

  if (currentWrong < 5) {
    answer.classList.add("false");
    answer.addEventListener("animationend", (e) => {
      answer.classList.remove("false");
    });
  }
  image.src = `Img/${currentWrong}.png`;
  if (currentWrong >= 5) {
    console.log("loose");
    looseSFX.play();
    endGame("l");
  }
}

//handles game over state for both loose and win
function endGame(state) {
  gamePanel.style.display = "none";
  endPanel.style.display = "grid";
  container.style.height = "fit-content";

  if (state == "w") {
    endPanel.querySelector("img").src = "Img/spongebob-victory-screech.gif";
    endPanel.querySelector("p").innerText = "";
  } else {
    endPanel.querySelector("img").src = "Img/lost-the.gif";
    endPanel.querySelector(
      "p"
    ).innerText = `The correct word is ${localStorage.getItem("currentWord")}`;
  }
}

//a string function to replace a char in a specific index
String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};
