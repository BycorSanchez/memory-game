//List of possible card values
const values = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-camera", "fa-camera"];

//The most accessed DOM elements
const score = document.querySelector(".score-panel");
const starElements = score.querySelectorAll(".score-panel .fa");
const clock = score.querySelector(".score-panel .clock");
const restarts = document.querySelectorAll(".restart");
const board = document.querySelector(".board");
const finished = document.querySelector(".finish-dialog");

let matches, moves, selected, stars, seconds, timer;

//Game starts
init();


/*
 * Event listeners
 */

/*
 * On restart:
 *   - Stop timer (no mor counting)
 *   - Hide congrats panel
 *   - Restart the game
 */
restarts.forEach(restart => restart.addEventListener("click", () => {
    endTimer();
    finished.classList.add("hidden");
    init();
}));

//Board click event
board.addEventListener("click", event => {
    const card = event.target;

    //Check if the target is a card and has not been selected yet
    if (isNotFlippedCard(card)) {

        flipUp(card);

        //First card pick
        if (selected === undefined) {
            checkStart();
            selected = card; //Remember first picked card
        }
        //Second card pick
        else {
            moves++;

            //If equal, update matches, lock cards and check if it's the last match
            if (value(card) === value(selected)) {
                matches--;
                match(card);
                match(selected);
                checkEnd();
            }
            //If not equal, mark then as wrong and flip both cards down
            else {
                wrong(card);
                wrong(selected);
                setTimeout(flipDown, 1000, card);
                setTimeout(flipDown, 1000, selected);
            }
            //Clear selected card
            selected = undefined;
            updateScore();
        }
    }
});

/*
 * Init game:
 *   - Restart values
 *   - Refresh score panel
 *   - Shuffle & deal cards
 */
function init() {
    matches = 8;
    moves = 0;
    seconds = 0;
    stars = 3;
    selected = undefined;

    updateTime();
    updateScore();
    shuffle();
    dealCards();
}

//Update panel score values such as moves and star rating
function updateScore() {
    score.querySelector(".moves").textContent = moves + " Moves";

    //Update star rating according to moves
    switch (moves) {
        case 0:
            starElements.forEach((element) => element.classList.add("fa-star"));
            break;
        case 16:
            stars = 2;
            starElements[stars].classList.remove("fa-star");
            break;
        case 24:
            stars = 1;
            starElements[stars].classList.remove("fa-star");
            break;
        case 32:
            stars = 0;
            starElements[stars].classList.remove("fa-star");
            break;
    }
}

//Shuffle randomly card values (stored in values array)
function shuffle() {
    var index = values.length,
        temporaryValue, randomIndex;
    while (index !== 0) {
        randomIndex = Math.floor(Math.random() * index);
        index--;
        temporaryValue = values[index];
        values[index] = values[randomIndex];
        values[randomIndex] = temporaryValue;
    }
}

//Flip down all cards and assign them new values
function dealCards() {
    const cards = board.querySelectorAll(".card");
    cards.forEach((card, i) => {
        flipDown(card);
        //Set card value after 0.5 to prevent show it during flip down transition
        setTimeout(setValue, 500, card, values[i]);
    });
}

//Check if the first move has occurred to start timer
function checkStart() {
    if (moves === 0) {
        timer = setTimeout(counter, 1000);
    }
}

/*
 * Check whether remaining matches are 0 to display final summary
 * If so, it stops timer & show final score
 */
function checkEnd() {
    if (matches === 0) {
        endTimer();
        finished.querySelector(".stars").textContent = "★".repeat(stars);
        finished.querySelector(".clock").textContent = elapsedTime();
        finished.querySelector(".moves").textContent = moves;
        finished.querySelector(".comment").textContent = funnyComment();
        finished.classList.remove("hidden");
    }
}

//Set a card as matched
function match(card) {
    card.classList.add("match");
}

//Set a card as wrong to show the user that it doesn't not match
function wrong(card) {
    card.classList.add("wrong");
}

//Flip over a card to show its value
function flipUp(card) {
    card.classList.add("show");
}

//Flip down a card to hide its value
function flipDown(card) {
    card.classList.remove("show", "match", "wrong");
}

//Get the value of a card
function value(card) {
    return card.firstElementChild.className;
}

//Set a specific value to a card
function setValue(card, value) {
    const content = card.firstElementChild;
    content.className = "";
    content.classList.add("fa", value);
}

//Check if passed element is a card and also if it can be turned over (not matched yet)
function isNotFlippedCard(element) {
    const classList = element.classList;
    return classList.contains("card") && !classList.contains("show");
}

//Get a funny comment depending on your moves at the end of the game
function funnyComment() {
    if (moves < 8) return "Mmm.. I think you're cheating";
    if (moves === 8) return "You nailed it!!";
    if (moves < 16) return "Wow, I'm really impressed";
    if (moves < 24) return "Pretty good";
    if (moves < 32) return "Nice, try to improve it";
    if (moves < 42) return "Perhaps you should practice some more";
    return "...";
}


/* Timer methods */

//Stop timer count
function endTimer() {
    clearTimeout(timer);
}

//Count every second and update clock timer at score panel
function counter() {
    seconds++;
    updateTime();

    //Call itself again un 1 second to update it again
    timer = setTimeout(counter, 1000);
}

//Show current time at score panel
function updateTime() {
    clock.textContent = elapsedTime();
}

//Format time value to 'mm:ss' format
function elapsedTime() {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return ((min < 10) ? "0" + min : min) + ":" + ((sec < 10) ? "0" + sec : sec);
}