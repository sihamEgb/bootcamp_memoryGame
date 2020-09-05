const colors = ["red","green","blue","yellow","grey","pink","white"];

// card state
const cardStatus = {
	0 : "opened",
	1: "closed",
	2: "done",
}
const Card = {
	status: cardStatus[1],
	color: "",

	id: "1",
	img: "",
};

// What I DO
const memoryGame = new MemoryGame();


// How I Do It
function MemoryGame() {
	 // this.memoryGame = memoryGame;
	//  console.log("hello from constructor land");
	this.cards = null;
	this.gameInProgress = false;
	this.wrongGussies = 0;
	this.columns = 3;
	this.rows = 4;
	this.startButton = null;
	this.startTime = null;
	this.selectedColors = null;

	this.startButton = document.querySelector('.startButton');
	this.startButton.addEventListener('click',() => this.startNewGame());

	const wrongGussies = document.querySelector('.counter');
	wrongGussies.innerHTML = this.wrongGussies;	
	return this;
	
}

MemoryGame.prototype.initTimer = function(){
	
	let date = new Date();
	this.startSeconds = date.getSeconds();
	this.startMinutes = date.getMinutes();
	this.startHours = date.getHours();
		
	const secondsDOM = document.querySelector('.seconds');
	const minutesDOM = document.querySelector('.minutes');
	const hoursDOM = document.querySelector('.hours');
	
	// this.timer = document.querySelector('clock');
	function updateTimeUnit()
	{
		let date = new Date();

		secondsDOM.innerHTML = 	("0" + (date.getSeconds() - this.startSeconds)).slice(-2); 
		minutesDOM.innerHTML = 	("0" + (date.getMinutes() - this.startMinutes)).slice(-2); 
		hoursDOM.innerHTML = 	  ("0" + (date.getHours() - this.startHours)).slice(-2); 
	

	}	
	const bindTimer =  updateTimeUnit.bind(this);
	this.timer = setInterval(function() { bindTimer();},1000);

	// this.timer = setInterval(updateTimeUnit,1000);

}
// get random cards from colors
MemoryGame.prototype.chooseRandomItems = function (){
	const size = this.columns * this.rows;
	this.selectedColors = [];
	let counter = 0;
	while( counter< size/2 )
	{
		const index = Math.floor(Math.random()*(colors.length));
		const chosenColor = colors[index];
		if(this.selectedColors.indexOf(chosenColor) === -1)
		{
			this.selectedColors.push(chosenColor);
			counter++;
		}
	}

}
// add ids to cards
// all properties will not be shown in html (only id)
MemoryGame.prototype.addCardsWithId = function(tempCards){
	this.cards = [];
	tempCards = shuffleArray(tempCards);
	for(let i=0;i<tempCards.length;i++)
	{
		this.cards[i] = {id:i,card:tempCards[i]};
	}
	console.log(this.cards);

}
// shuffle array
function shuffleArray(array){
	for (let i = array.length - 1; i > 0; i--) 
	{
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
MemoryGame.prototype.initCards = function(){
	let tempCards = []
	this.chooseRandomItems();
	for(let i=0 ; i<this.selectedColors.length;i++){
		let newCard_1 = {
			code:`${i}-1`,
			status:0,
			color: `${this.selectedColors[i]}`,
		}
		let newCard_2 = {
			code:`${i}-2`,
			status:0,
			color: `${this.selectedColors[i]}`,
		}
		tempCards.push(newCard_1);
		tempCards.push(newCard_2);
		// console.log("cards array",this.cards);
	}
	this.addCardsWithId(tempCards);
}

function createCardDOM(card){
	const newCard = document.createElement('div');
	newCard.classList.add('card');

	const innerOpened = document.createElement('div');
	innerOpened.classList.add('opened');

	innerOpened.style.display = none;

	newCard.append(innerOpened);


	newCard.dataset.id = card.id;
	return newCard;
}
MemoryGame.prototype.loadCards = function(){
	// console.log(this.cards);
	const cardContainer = document.querySelector('.boardContainer');
	cardContainer.innerHTML = "";
	this.cards.forEach(card => {
		// console.log("add event listener", card);
		const newCard = createCardDOM(card);
		newCard.addEventListener('click',(e) => this.cardListener(e));
		cardContainer.append(newCard);
	});

}
MemoryGame.prototype.getCardById = function(id){
	console.log("inside get card by id",this.cards);
	id = parseInt(id);
	for(let i=0;i<this.cards.length;i++)
	{
		if(id  === this.cards[i].id)
		{
			return this.cards[i].card;
		}
	}
	return null;
}
MemoryGame.prototype.closeOpenedCard = function(){
	this.wrongGussies++;
		this.cardOpen = 0
		console.log("after time out",this.openedCards);
		this.openedCards[0].classList.remove('opened');
		this.openedCards[1].classList.remove('opened');
		this.openedCards = [];
}
MemoryGame.prototype.cardListener = function(event){
	console.log("in card listener");
	console.log("opened cards",this.openedCards);
	const cardClicked = event.currentTarget;
	cardClicked.classList.add('opened');
	this.openedCards.push(cardClicked);
	if(this.cardOpen === 2)
	{
		// if identical
		const firstCardObj = this.getCardById(this.openedCards[0].dataset.id)
		const secondCardObj = this.getCardById(this.openedCards[1].dataset.id)
		console.log("first card opened",this.openedCards[0]);
		console.log("second card opened",this.openedCards[1]);
		console.log("first card obj",firstCardObj);
		console.log("second card obj",secondCardObj);
		if(firstCardObj.color === secondCardObj.color)
		{
			// this.openedCard_1.cardStatus = "done";
			// this.openedCard_2.cardStatus = "done";
			this.openedCards[0].classList.add('done');
			this.openedCards[1].classList.add('done');
			this.cardsDone= this.cardsDone+2;
			this.openedCards = [];
			if(this.cardsDone === this.rows * this.columns)
			{
				console.log("game finished - you win");
				// TODO
			}
		}
		// if not identical
		else{
			//if not equal
			
			const closeOpenedCardBind =  this.closeOpenedCard.bind(this);
			setTimeout(function() { closeOpenedCardBind();},500);
		}
	}
}
// game click if more than two opened 
// stop opening more cards no clicks
MemoryGame.prototype.handleGameClick = function(event){
	// game is finished
	// console.log("game clicked");
	// console.log(event);

	if(!this.gameInProgress)
	{
		console.log("game not in progress",this.gameInProgress);
		event.stopPropagation();
		return;
	}
	const card = document.querySelector('.card');
	const cardClicked = event.target;
	if(event.target.classList.contains('card'))
	{
		console.log("Card clicked",cardClicked);
		// do nothing
		if((this.cardOpen===2) || 
			(cardClicked.classList.contains('opened')) ||
			(cardClicked.classList.contains('done')))
		{
			console.log("propagation stopped");
			event.stopPropagation();
		}
		else{
			if(this.cardOpen === 2)
			{
				event.stopPropagation();
				return;
			}
			// first card to open
			if(this.cardOpen === 0)
			{
				this.cardOpen++;
			}
			// second card to open
			else if(this.cardOpen === 1)
			{
				this.cardOpen++;
				// open new card - in card listener
			}
		}
	}


}
MemoryGame.prototype.startNewGame = function(e){
	this.initCards();
	this.loadCards();
	const cardContainer = document.querySelector('.boardContainer');
	cardContainer.addEventListener('click',(e) =>this.handleGameClick(e),true);
	this.initTimer();
	this.gameInProgress = true;
	this.cardOpen = 0;
	this.openedCards = [];
}
