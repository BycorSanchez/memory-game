//Prevent variable modification from console
{
    const values = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-camera", "fa-camera"];
    const score = document.querySelector(".score-panel");
    const starElements = score.querySelectorAll(".score-panel .fa");
    const clock = score.querySelector(".score-panel .clock");
    const restarts = document.querySelectorAll(".restart");
    const board = document.querySelector(".board");
    const finished = document.querySelector(".finish-dialog");

    let matches, moves, selected, stars, seconds, timer;

    // Init game
    init();

    //Register restart events
    restarts.forEach(restart => restart.addEventListener("click", () => {
        init();
        endTimer();
        finished.classList.add("hidden");
    }));

    //Register card click event
    board.addEventListener("click", event => {
        const card = event.target;

        if (isNotFlippedCard(card)) {

            flipUp(card);

            //First pick
            if (selected === undefined) {
                checkStart();
                selected = card;
            }
            //Second pick
            else {
                moves++;

                //Equal
                if (value(card) === value(selected)) {
                    matches--;
                    match(card);
                    match(selected);
                    checkEnd();
                }
                //Not equal
                else {
                    wrong(card);
                    wrong(selected);
                    setTimeout(flipDown, 1000, card);
                    setTimeout(flipDown, 1000, selected);
                }
                selected = undefined;
                updateScore();
            }
        }
    });

    function init() {
        //Restart values
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

    function updateScore() {
        score.querySelector(".moves").textContent = moves + " Moves";

        //Show stars according to moves
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

    function dealCards() {
        const cards = board.querySelectorAll(".card");
        cards.forEach((card, i) => {
            flipDown(card);
            //Set card value after 0.5 to prevent show it during flip down transition
            setTimeout(setValue, 500, card, values[i]);
        });
    }

    function checkStart() {
        if (moves === 0) {
            timer = setTimeout(counter, 1000);
        }
    }

    function checkEnd() {
        if (matches === 0) {
            finished.querySelector(".clock").textContent = elapsedTime();
            finished.querySelector(".moves").textContent = moves;
            finished.querySelector(".comment").textContent = funnyComment();
            finished.classList.remove("hidden");
            endTimer();
        }
    }

    function match(card) {
        card.classList.add("match");
    }

    function wrong(card) {
        card.classList.add("wrong");
    }

    function flipUp(card) {
        card.classList.add("show");
    }

    function flipDown(card) {
        card.classList.remove("show", "match", "wrong");
    }

    function value(card) {
        return card.firstElementChild.className;
    }

    function setValue(card, value) {
        const content = card.firstElementChild;
        content.className = "";
        content.classList.add("fa", value);
    }

    function isNotFlippedCard(element) {
        const classList = element.classList;
        return classList.contains("card") && !classList.contains("show");
    }

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

    function endTimer() {
        clearTimeout(timer);
    }

    function counter() {
        seconds++;
        updateTime();
        timer = setTimeout(counter, 1000);
    }

    function updateTime() {
        clock.textContent = elapsedTime();
    }

    //Format value to 'mm:ss' format
    function elapsedTime() {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return ((min < 10) ? "0" + min : min) + ":" + ((sec < 10) ? "0" + sec : sec);
    }
}