let levelNumber;
let isAlive = false;
let hasRightTiming = false;
let currentCalculation;
let rightResult;
let lifeCount;
let interactionInput;
let submitBtn;
let gameField;
let interactionText;
let timerID;
let restartBtn;
let greetingGameField;

//Original Layout when loading Page:
$(document).ready(function () {
    gameField = $("#playing-game-field");
    greetingGameField = $("#greeting-game-field");
    interactionInput = $("#interaction-container input");
    submitBtn = $("#submit-btn");
    interactionText = $("#interaction-container h3");
    restartBtn = $("#restart-btn");
    gameField.hide();
    restartBtn.hide();
    interactionInput.hide();
    restartBtn.click(startNewGame);
    submitBtn.click(checkInput);
    submitBtn.hide();

    //Laden des Level-Stands falls vorhanden:
    if (localStorage.getItem("Math-Heaven-Level") !== null) {
        levelNumber = Number(localStorage.getItem("Math-Heaven-Level"));
        lifeCount = Number(localStorage.getItem("Math-Heaven-Lifes"))
        setTimeout(function () {
            isAlive = true;
            restartBtn.show();
            renderGameField();
            playLevel();
        }, 2000)
    } else {
        setTimeout(function () {
            interactionText.text("");
            restartBtn.show();
        }, 1500)
    }
});

//When Start-Button is clicked:
function startNewGame() {
    restartBtn.show();
    clearTimeout(timerID);
    isAlive = true;
    levelNumber = 1;
    lifeCount = 3;
    localStorage.setItem("Math-Heaven-Lifes", `${lifeCount}`)
    renderGameField();
    //First Level is played:
    playLevel();
}

function renderGameField() {
    interactionText.removeClass("transform-loading");
    submitBtn.show();
    let gridDivHtml = ""
    for (let i = 9; i > 0; i--) {
        gridDivHtml += `<div id='field-${i}'>${i}</div>`
    }
    gameField.html(gridDivHtml);
    gameField.css("display", "grid");
    greetingGameField.hide();
    gameField.show();
    interactionInput.show();
}

function playLevel() {
    localStorage.setItem("Math-Heaven-Level", `${levelNumber}`)
    hasRightTiming = false;
    interactionInput.val("");
    highlightLevel();
    handleCalculation();
}

function highlightLevel() {
    $("#playing-game-field div").removeClass("active");
    $(`#field-${levelNumber}`).addClass("active");
}

function handleCalculation() {
    generateCalculation();
    renderCalculation();
}


function generateCalculation() { //passende Rechnung fürs Level erzeugen:
    let num1;
    let num2;
    let num3;
    let num4;
    switch (levelNumber) {
        //Addition
        case 1:
            num1 = getRandomNumber(10, 0);
            num2 = getRandomNumber(20, 0);
            currentCalculation = `${num1} + ${num2} = ? `
            rightResult = num1 + num2;
            break;

        case 2:
            num1 = getRandomNumber(20, 20);
            num2 = getRandomNumber(20, 0);
            currentCalculation = `${num1} - ${num2} = ? `
            rightResult = num1 - num2;


        case 3:
            num1 = getRandomNumber(9, 1);
            num2 = getRandomNumber(9, 1);
            num3 = getRandomNumber(9, 1);
            num4 = getRandomNumber(9, 1);
            currentCalculation = `${num1} * ${num2} + ${num3} * ${num4}= ? `
            rightResult = num1 * num2 + num3 * num4;
            break;

        case 4:
            rightResult = getRandomNumber(9, 10);
            num2 = getRandomNumber(9, 1);
            num1 = rightResult * num2;
            currentCalculation = `${num1} / ${num2} = ? `
            break;

        case 5:
            num1 = getRandomNumber(9, 1);
            num2 = getRandomNumber(9, 10);
            currentCalculation = `${num1} * ${num2} = ? `
            rightResult = num1 * num2;
            break;

        case 6:
            num1 = getRandomNumber(1000, 100);
            num2 = getRandomNumber(1000, 100);
            const result6 = getPositiveSubtraction(num1, num2);
            currentCalculation = result6.text;
            rightResult = result6.result;
            console.log(rightResult)
            break;

        case 7:
            num1 = getRandomNumber(100, 10);
            num2 = getRandomNumber(100, 10);
            currentCalculation = `${num1} * ${num2} = ? `
            rightResult = num1 * num2;
            break;

        case 8:
            rightResult = getRandomNumber(9, 100);
            num2 = getRandomNumber(9, 10);
            num1 = rightResult * num2;
            currentCalculation = `${num1} / ${num2} = ? `
            break;

        case 9:
            num1 = getRandomNumber(1000, 100);
            num2 = getRandomNumber(1000, 100);
            let interimResult;
            let interimCalc;
            const {text, result} = getPositiveSubtraction(num1, num2);
            interimCalc = text.slice(0,text.length-5);
            interimResult = result;
            rightResult = getRandomNumber(9, 1000);
            num1 = rightResult * interimResult;
            currentCalculation = `${num1} / (${interimCalc}) = ? `
            break;
    }
    console.log(rightResult);
}

function renderCalculation() {
    interactionText.text(currentCalculation);
    hasRightTiming = true;
}

function startNextLevel() {
    if (isAlive) {
        if (levelNumber < 9) {
            levelNumber++;
            playLevel();
        } else {
            showResult(isAlive);
        }
    }
}

function checkInput() {
    if (hasRightTiming === true) {
        const answer = $("#interaction-container input").val();
        if (answer !== "") {
            if (Number(answer) === rightResult) {
                startNextLevel();
            } else { //if player  gives false answer
                lifeCount--;
                interactionInput.val("");
                //if player is dead:
                if (lifeCount <= 0) {
                    isAlive = false;
                    showResult(isAlive);
                } else { //if player stays at level:
                    interactionText.text(`Falsch! Du hast noch ${lifeCount} Leben.`);
                    localStorage.setItem("Math-Heaven-Level", `${levelNumber}`)
                    localStorage.setItem("Math-Heaven-Lifes", `${lifeCount}`)
                    hasRightTiming = false;
                    timerID = setTimeout(function () {
                        levelNumber--;
                        startNextLevel();
                    }, 1500);
                }
            }
        }
    }
}

function showResult(isAlive) {
    const placeForImg = $("#place-for-img");
    localStorage.clear();
    gameField.hide();
    interactionInput.hide();
    submitBtn.hide();
    placeForImg.removeClass("angel-emoji");
    placeForImg.css("height", "90%");
    placeForImg.css("margin-top", "5%");
    $("#greeting-game-field h1").hide();
    if (isAlive === false) {
        placeForImg.addClass("loser-img")
        interactionText.text("Leider hat dich der Fehler-Teufel zu oft erwischt. Du hast verloren!");
    } else {
        placeForImg.addClass("winner-img")
        interactionText.text("Gratuliere - Du bist ein echter Mathe-Gott!")
    }
    console.log("hier")
    greetingGameField.show();
    gameField.hide();
}

function getRandomNumber(timesVal, plusVal) {
    return (Math.floor(Math.random() * timesVal) + plusVal);
}

function getPositiveSubtraction(number1, number2) {
    if (number1 >= number2) {
        return {
            text: `${number1} - ${number2} = ? `,
            result: number1 - number2
        };
    } else {
        return {
            text: `${number2} - ${number1} = ? `,
            result: number2 - number1
        };
    }
}

