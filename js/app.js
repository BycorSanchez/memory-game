//Prevent variable modification from console
{
	const values = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-camera", "fa-camera"];
	const score = document.querySelector(".score-panel");
	const starElements = score.querySelectorAll(".score-panel .fa");
	const restart = document.querySelector(".restart");
	const board = document.querySelector(".board");
	const finished = document.querySelector(".finish-dialog");

	let matches, moves, selected, time, stars;

	/*
	 * Init game
	 */

	init();

	/*
	 * Event listeners
	 */

	//Restart game
	restart.addEventListener("click", init);

	//Select card
	board.addEventListener("click", event => {
	    const card = event.target;

	    //Is it a card & is not locked?
	    if (isNotFlippedCard(card)){

	        flipUp(card);

	        //First pick
	        if (selected === undefined){
	            selected = card;
	        }
	        //Second pick
	        else{
	            //Equal
	            if (value(card) === value(selected)){
	                matches--;
	                match(card);
	                match(selected);
	                checkEnd();
	            }
	            //Not equal
	            else{
	            	wrong(card);
	            	wrong(selected);
	            	setTimeout(flipDown, 1000, card);
	            	setTimeout(flipDown, 1000, selected);
	            }
	            selected = undefined;
	            moves++;
	            updateScore();
	        }
	    }
	});

	function init(){
		//Restart values
		matches = 8;
		moves = 0;
		time = 0;
		stars = 3;
		selected = undefined;

		finished.classList.add("hidden");
		updateScore();
		shuffle();
		dealCards();
	}

	function updateScore(){
		score.querySelector(".moves").textContent = moves;

		switch(moves){
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
	    var index = values.length, temporaryValue, randomIndex;
	    while (index !== 0) {
	        randomIndex = Math.floor(Math.random() * index);
	        index--;
	        temporaryValue = values[index];
	        values[index] = values[randomIndex];
	        values[randomIndex] = temporaryValue;
	    }
	}

	function dealCards(){
		const cards = board.querySelectorAll(".card");
		cards.forEach((card, i) => {
			flipDown(card);
			//Prevent show value before flip down (transition 0.5s)
			setTimeout(setValue, 500, card, values[i]); 
		});
	}

	function checkEnd(){
		if (matches === 0){
			finished.classList.remove("hidden");
			console.log("Game finished!");
		}
	}

	function match(card){
		card.classList.add("match");
	}

	function wrong(card){
		card.classList.add("wrong");
	}

	function flipUp(card){
		card.classList.add("show");
	}

	function flipDown(card){
		card.classList.remove("show", "match", "wrong");
	}

	function value(card){
		return card.firstElementChild.className;
	}

	function setValue(card, value){
		const content = card.firstElementChild;
		content.className = "";
		content.classList.add("fa", value);
	}

	function isNotFlippedCard(element){
		const classList = element.classList;
		return classList.contains("card") && !classList.contains("show");
	}
}
