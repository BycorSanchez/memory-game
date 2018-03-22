//Prevent variable modification from console
{
	const values = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-camera", "fa-camera"];
	const board = document.querySelector(".board");
	const cards = document.querySelectorAll(".board .card");
	const score = document.querySelector(".moves");
	const restart = document.querySelector(".restart");
	const finished = document.querySelector("#finish-dialog")

	let matches, moves, selected;

	function shuffleCards() {
		//Shuffle values
	    var index = values.length, temporaryValue, randomIndex;
	    while (index !== 0) {
	        randomIndex = Math.floor(Math.random() * index);
	        index--;
	        temporaryValue = values[index];
	        values[index] = values[randomIndex];
	        values[randomIndex] = temporaryValue;
	    }

		//Flip down & set card values
		cards.forEach((card, i) => {
			flipDown(card);
			setValue(card, values[i]);
		});
	}

	function updateScore(){
		score.textContent = moves;
	}

	function init(){
		//Restart values
		matches = 8;
		moves = 0;
		selected = undefined;

		finished.classList.add("hidden");
		updateScore();
		shuffleCards();
	}

	function setValue(card, value){
		const content = card.firstElementChild;
		content.className = "";
		content.classList.add("fa", value);
	}

	function value(card){
		return card.firstElementChild.className;
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

	function isNotFlippedCard(element){
		const classList = element.classList;
		return classList.contains("card") && !classList.contains("show");
	}

	function checkEnd(){
		if (matches === 0){
			finished.classList.remove("hidden");
			console.log("Game finished!");
		}
	}

/*
 * Event listeners
 */

	//Init game on restart
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
	        checkEnd();
	    }
	});


	/*
	 * Init game
	 */

	init();
}
