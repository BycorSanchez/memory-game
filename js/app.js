//Prevent variable modification from console
{
	const values = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bicycle", "fa-bicycle", "fa-crosshairs", "fa-crosshairs"];
	const deck = document.querySelector(".deck");
	const cards = document.querySelectorAll(".deck .card");
	const score = document.querySelector(".moves");
	const restart = document.querySelector(".restart");

	let matches, moves, selected;

	function shuffleDeck() {
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

		updateScore();
		shuffleDeck();
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

	function flipDown(card){
		card.classList.remove("open", "show", "lock", "match");
	}

	function flipUp(card){
		card.classList.add("open", "show", "lock");
	}

	function isUnlockedCard(element){
		const classList = element.classList;
		return classList.contains("card") && !classList.contains("lock");
	}

	//Init game of restart
	restart.addEventListener("click", init);


	//Select card
	deck.addEventListener("click", event => {
	    const card = event.target;

	    //Is it a card & is it unlocked?
	    if (isUnlockedCard(card)){

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
	            	setTimeout(flipDown, 900, card);
	            	setTimeout(flipDown, 900, selected);
	            }
	            selected = undefined;
	            moves++;
	            updateScore();
	        }
	        checkEnd();
	    }
	});

	function checkEnd(){
		if (matches === 0){
			console.log("Game finished!");
		}
	}
	//Shuffle deck on start
	init();
}
