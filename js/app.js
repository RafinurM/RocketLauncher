import getRandomNumber from "./additional.js";

const rocket = document.querySelector(".rocket");
const rocketFire = document.querySelector(".rocketFire");
const messages = document.getElementById("messages");
const gameStatus = document.getElementById("gameStatus");
let rocketCoords;
const earth = document.getElementById("earth");
const sky = document.getElementById("sky");
let starsCreateTimer;
let rocketStartAnimationID;
const rocketParts = document.getElementsByClassName("rocketPart");
let score = 0;
const timer = document.getElementById("timerCount");
const scoreElem = document.getElementById("score");
let stars = [];
let starTimer = 15000; // 15s
let starCreateTime = 500; // every 0.5s
let timerId;
let time = 60; // game time
const easyGameMode = document.querySelector(".easy");
const mediumGameMode = document.querySelector(".medium");
const hardGameMode = document.querySelector(".hard");

function easy() {
  time = 60;
  starTimer = 15000;
  starCreateTime = 500;
  timer.innerHTML = `${time}`;
  mediumGameMode.classList.remove("choosed");
  hardGameMode.classList.remove("choosed");
  easyGameMode.classList.add("choosed");
}

function medium() {
  time = 30;
  starTimer = 10000;
  starCreateTime = 1000;
  timer.innerHTML = `${time}`;
  mediumGameMode.classList.add("choosed");
  hardGameMode.classList.remove("choosed");
  easyGameMode.classList.remove("choosed");
}

function hard() {
  time = 15;
  starTimer = 5000;
  starCreateTime = 1500;
  timer.innerHTML = `${time}`;
  mediumGameMode.classList.remove("choosed");
  hardGameMode.classList.add("choosed");
  easyGameMode.classList.remove("choosed");
}

function setGameMode(e, m, h) {
  e.addEventListener("click", easy);
  m.addEventListener("click", medium);
  h.addEventListener("click", hard);
}

window.onload = newGame;
showTips();

function newGame() {
  setGameMode(easyGameMode, mediumGameMode, hardGameMode);
  messages.style.visibility = "visible"; // show start message
  gameStatus.innerHTML = "Game start"; // text
  messages.addEventListener("click", launchRocket); //
  if (rocket.classList.contains("rocketFall")) {
    //checking previos status
    rocket.classList.remove("rocketFall");
  }
  rocketFire.style.visibility = "visible"; // rocket fire is enable
  let rocketPartsArr = Array.from(rocketParts); //make array of rocket parts and set default
  rocketPartsArr.forEach((rocketPart) => {
    rocketPart.removeAttribute("style");
    rocketPart.classList.remove("explosed");
  });
  initial(); // make default positions
}

function initial() {
  rocketFire.style.visibility = "hidden";
  rocket.removeAttribute("style"); // remove all styles
  setupRocket();
  score = 0;
  earth.style.borderTop = "5px solid green"; // сажаем зелень
}

function launchTimer(time) {
  // game timer base 60s
  timer.innerHTML = `${time}`;
  timerId = setInterval(() => {
    time--;
    timer.innerHTML = `${time}`;
    if (time === 0) {
      clearInterval(timerId);
      gameOver();
    }
  }, 1000);
}

function launchRocket() {
  easyGameMode.removeEventListener("click", easy);
  mediumGameMode.removeEventListener("click", medium);
  hardGameMode.removeEventListener("click", hard);
  messages.style.visibility = "hidden";
  gameStatus.innerHTML = "in game";
  rocketFire.style.visibility = "visible";
  rocket.classList.add("suaring");
  window.requestAnimationFrame(rocketAnimate);
  setTimeout(() => document.addEventListener("keydown", rocketMove), 1000); // добавляем отслеживание нажатие кнопок)
  launchTimer(time);
  starsCreateTimer = setInterval(createStar, starCreateTime);
}

function rocketAnimate() {
  rocket.style.top = `${up()}px`;
  rocketStartAnimationID = requestAnimationFrame(rocketAnimate);
  if (getRocketCoords().y < 280) {
    cancelAnimationFrame(rocketStartAnimationID);
  }
}

function up() {
  return getRocketCoords().y - 5;
}

function gameOver() {
  clearInterval(timerId);
  messages.removeEventListener("click", launchRocket);
  messages.style.visibility = "visible";
  gameStatus.innerHTML = "Play again";
  clearInterval(starsCreateTimer);
  rocket.classList.remove("suaring");
  messages.addEventListener("click", newGame);
  stars = [];
  explosionRocket(rocketParts);
  document.removeEventListener("keydown", rocketMove);
  let starsArr = Array.from(document.getElementsByClassName("star")); // delete stars
  starsArr.forEach((item) => {
    item.classList.add("markedStar");
    setTimeout(() => item.remove(), 1000);
  });
}

function checkGameBorders(rocket) {
  if (
    rocket.getBoundingClientRect().x < 0 ||
    rocket.getBoundingClientRect().y < 0 ||
    rocket.getBoundingClientRect().x >
      document.documentElement.offsetWidth - 50 ||
    rocket.getBoundingClientRect().y >
      document.documentElement.clientHeight -
        (document.documentElement.clientHeight / 100) * 20
  ) {
    gameOver();
  }
}

function setupRocket() {
  rocket.style.top = `${getRocketCoords().y - earth.clientHeight - 25}px`; // setup rocket on earth
}

function getRocketCoords() {
  return (rocketCoords = rocket.getBoundingClientRect());
}

function posGorizontalMoving() {
  rocket.style.left = `${getRocketCoords().x + 5}px`;
}

function negGorizontalMoving() {
  rocket.style.left = `${getRocketCoords().x - 5}px`;
}

function rocketMove(e) {
  switch (e.code) {
    case "KeyA":
      requestAnimationFrame(negGorizontalMoving);
      checkGameBorders(rocket);
      break;
    case "KeyD":
      requestAnimationFrame(posGorizontalMoving);
      checkGameBorders(rocket);
      break;
    case "KeyS":
      rocket.style.top = `${(getRocketCoords().y += 6)}px`;
      checkGameBorders(rocket);
      break;
    case "KeyW":
      increaseFireAnim(rocketFire);
      rocket.style.top = `${(getRocketCoords().y -= 6)}px`;
      checkGameBorders(rocket);
      break;
  }
}

function increaseFireAnim(fire) {
  fire.style.scale = 2;
  setTimeout(() => {
    fire.style.scale = 1;
  }, 500);
}

function explosionRocket(rocketParts) {
  rocketFire.style.visibility = "hidden";
  let x = getRocketCoords().x;
  rocket.style.top = `${setupRocket}px`;
  rocket.removeAttribute("style");
  rocket.style.left = `${x}px`;
  rocket.classList.add("rocketFall");
  cancelAnimationFrame(rocketStartAnimationID);
  let count = 0;
  Array.from(rocketParts).forEach((element) => {
    element.classList.add("explosed");
    let degrees = Math.random() * 5000;
    if (count % 2 === 0) {
      element.style.transform = `rotateZ(${degrees}deg)`;
      element.style.left = `${Math.random() * 200}px`;
      count++;
    } else {
      element.style.transform = `rotateZ(${-degrees}deg)`;
      element.style.left = `${-Math.random() * 200}px`;
      count++;
    }
  });
}

function createStar() {
  let star = document.createElement("div");
  star.classList.add("star");
  stars.push(star);
  sky.append(star);
  setTimeout(() => starLiveTime(star), starTimer);
  let { width, height } = sky.getBoundingClientRect();
  let x = getRandomNumber(0, width - 90);
  let y = getRandomNumber(0, height - 150);
  star.style.top = `${y}px`;
  star.style.left = `${x}px`;
}

function starLiveTime(star) {
  star.remove();
}

// получение звезды и начисление очков
setInterval(getStar, 50); // - найти способ отслеживания координат

function getStar() {
  let x = getRocketCoords().x;
  let y = getRocketCoords().y;
  for (let i = x, j = y; (i <= x + 50) & (j <= y + 50); i++, j++) {
    stars.forEach((element) => {
      if (
        (j > element.offsetTop) &
        (j < element.offsetTop + 30) &
        ((i > element.offsetLeft) & (i < element.offsetLeft + 30))
      ) {
        score++;
        scoreElem.innerHTML = score;
        let indexOfStar = stars.indexOf(element);
        stars.splice(indexOfStar, 1);
        element.remove();
      }
    });
  }
}

function showTips() {
  const tip = document.createElement("div");
  const tipText = document.createElement("span");
  let c = 0; //counter
  setInterval(() => {
    tipText.classList.add("tipText");
    if (c % 2 === 0) {
      tip.appendChild(
        showTipMessage("Нажимайте W A S D для перемещения по экрану.", tipText)
      );
      c++;
    } else {
      tip.appendChild(
        showTipMessage(
          "Не вылетайте за границы. Избегайте столкновения.",
          tipText
        )
      );
      c++;
    }
    tip.classList.add("tip");
    earth.childNodes[1].append(tip);
  }, 3000);
}

function showTipMessage(text, tip) {
  tip.innerHTML = text;
  return tip;
}
