let rows = 4;
let columns = 3;

const colors = ["red","green","blue","yellow","grey","pink","white"];

const food_images = [
	"apple.png",
	"banana.jpg",
	"corn.png",
	"cucumber.jpg",
	"avocado.jpg",
	"orange.jpg",
	"tomato.jpg",
	"dragonfruit.jpg",
	"grapes.jpg",
	"kiwi.jpg",
	"lime.jpg",
	"mango.jpg",
	"pears.jpg",
	"strawberry.jpg",
	"watermelon.jpg",
]
const path = "./images/food/"
// food_images we have all images
// selected images , we choose size images
// we shuffle them each one twice for two cards and put them in a map

const cardStatus = {
	0 : "opened",
	1: "closed",
	2: "done",
}
const Card = {
	status: cardStatus[1],
	src: "",

	id: "1",
	img: "",
};

// What I DO
const memoryGame = new MemoryGame();
const levels = document.querySelectorAll('.level');
levels.forEach(level => level.addEventListener('click', selectLevel));


const startButton = document.querySelector('.startButton');
startButton.addEventListener('click',() => memoryGame.startNewGame());


// How I Do It
function MemoryGame() {
	this.cards = null;
	this.wrongGussies = 0;
	this.columns = columns;
	this.rows = rows;
	this.startTime = null;
	this.selectedItems = null;
	this.cardsDone = 0;
	this.cardOpen = 0;
	this.openedCards = [];
	// if size != coumns * rows
	this.size = this.columns * this.rows;
	this.play = false;

	this.homepageButton = document.querySelector('.homepageButton');
	this.homepageButton.addEventListener('click',() => this.restartGame());

	return this;
	
}

MemoryGame.prototype.stopTimer = function(){
	clearInterval(this.timer);
}
MemoryGame.prototype.initTimer = function(){
	
	// let date = new Date();
	this.seconds = 0;
	// date.getSeconds();
	this.minutes = 0;
	//  date.getMinutes();
	this.hours = 0;
	// date.getHours();
		
	const secondsDOM = document.querySelector('.seconds');
	const minutesDOM = document.querySelector('.minutes');
	const hoursDOM = document.querySelector('.hours');
	
	// this.timer = document.querySelector('clock');
	function updateTimeUnit()
	{
		// let date = new Date();
		this.seconds++;
		if(this.second === 60)
		{
			this.second = 0;
			this.minutes++;
			if(this.minutes === 60)
			{
				this.hours++;
				this.minutes = 0;
			}
		}
		
		
		secondsDOM.innerHTML = 	("0" + (this.seconds)).slice(-2); 
		minutesDOM.innerHTML = 	("0" + (this.minutes)).slice(-2); 
		hoursDOM.innerHTML = 	  ("0" + (this.hours)).slice(-2); 
	

	}	
	const bindTimer =  updateTimeUnit.bind(this);
	this.timer = setInterval(function() { bindTimer();},1000);

	// this.timer = setInterval(updateTimeUnit,1000);

}
// get random cards from colors
MemoryGame.prototype.chooseRandomItems = function (){

	this.selectedItems = [];
	let counter = 0;
	// TODO
	// chose from food images
	while( counter< this.size/2 )
	{
		// random from 0 - 
		const index = Math.floor(Math.random()*(food_images.length));
		const chosenItem = food_images[index];

		if(this.selectedItems.indexOf(chosenItem) === -1)
		{
			this.selectedItems.push(chosenItem);
			counter++;
		}
	}

}
// add ids to cards
// all properties will not be shown in html (only id)
MemoryGame.prototype.addCardsWithId = function(tempCards){
	this.cards = [];
	// for security reseaonc
	this.itemsID = [];
	tempCards = shuffleArray(tempCards);
	for(let i=0;i<tempCards.length;i++)
	{
		this.cards[i] = {id:i,card:tempCards[i]};
		this.itemsID[i] = 	this.cards[i].card.src;
	}

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
	for(let i=0 ; i<this.selectedItems.length;i++){
		let newCard_1 = {
			status:0,
			src: this.selectedItems[i],
		}
		let newCard_2 = {
			// code:`${i}-2`,
			status:0,
			src: this.selectedItems[i],
		}
		tempCards.push(newCard_1);
		tempCards.push(newCard_2);
	}
	this.addCardsWithId(tempCards);
}

function createCardDOM(card){
	const newCard = document.createElement('div');
	newCard.classList.add('card');

	const cardInner = document.createElement('div');
	cardInner.classList.add('card-inner');

	const front = document.createElement('div');
	front.classList.add('front');

	const back = document.createElement('div');
	back.classList.add('back');
	
	const backImage = document.createElement('img');
	backImage.classList.add('back-img');
	// TODO something about this !!!
	backImage.src = `${path}${card.card.src}`;

	back.append(backImage);
	cardInner.append(front);
	cardInner.append(back);
	newCard.append(cardInner);

	newCard.dataset.id = card.id;
	return newCard;
}
MemoryGame.prototype.loadCards = function(){

	const cardContainer = document.querySelector('.boardContainer');
	cardContainer.innerHTML = "";
	this.cards.forEach(card => {

		const newCard = createCardDOM(card);
		newCard.addEventListener('click',(e) => this.cardListener(e));
		cardContainer.append(newCard);
	});

}
MemoryGame.prototype.getCardById = function(id){

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

MemoryGame.prototype.right = function(){

}
MemoryGame.prototype.wrong = function(){
	this.wrongGussies++;
	const wrongGussies = document.querySelector('.counter');
	wrongGussies.innerHTML = "Wrong Gussies" + this.wrongGussies;	
}
MemoryGame.prototype.closeOpenedCard = function(){
	this.wrong();

	this.openedCards[0].classList.remove('opened');
	hideCard(this.openedCards[0]);
	this.openedCards[1].classList.remove('opened');
	hideCard(this.openedCards[1]);
	this.openedCards = [];
}
function hideCard(cardDOM){
	if(cardDOM.style.transform == "rotateY(180deg)") {
		cardDOM.style.transform = "rotateY(0deg)";
	}
	else {
		cardDOM.style.transform = "rotateY(180deg)";
	}
}
function showCard(cardDOM,cardObj){

		if(cardDOM.style.transform == "rotateY(180deg)") {
			cardDOM.style.transform = "rotateY(0deg)";
		}
		else {
			cardDOM.style.transform = "rotateY(180deg)";
		}
}

	MemoryGame.prototype.cardListener = function(event){
	const cardClicked = event.currentTarget;

	if(cardClicked.classList.contains('done'))
	{
		return;
	}

	
		// }
	
		const cardOpened = this.getCardById(cardClicked.dataset.id)
		showCard(cardClicked,cardOpened);
	this.openedCards.push(cardClicked);

	// this.firstCardOpened = cardClicked;
	if(this.openedCards.length === 2)
	{
		// if identical
		const firstCardObj = this.getCardById(this.openedCards[0].dataset.id)
		const secondCardObj = this.getCardById(this.openedCards[1].dataset.id)
		if(firstCardObj.src === secondCardObj.src)
		{
			// TODO bug
			// this.openedCard_1.cardStatus = "done";
			// this.openedCard_2.cardStatus = "done";
		
			this.openedCards[0].classList.add('done');
			this.openedCards[1].classList.add('done');

			// this.openedCards[1].removeEventListener('click')
			this.cardsDone= this.cardsDone+2;
			this.openedCards = [];
			if(this.cardsDone === this.rows * this.columns)
			{
				const gameFinishedBind =  this.gameFinished.bind(this);
				setTimeout(function() { gameFinishedBind();},1500);
			}
		}
		// if not identical
		else{
			//if not equal
			// TODO - bug
			const closeOpenedCardBind =  this.closeOpenedCard.bind(this);
			setTimeout(function() { closeOpenedCardBind();},1500);
		}
	}	
}
MemoryGame.prototype.restartGame = function(){
	this.play = false;
	this.openHomePage();
}
MemoryGame.prototype.openHomePage = function(){
	const homepage = document.querySelector('.homepage');
	homepage.style.display = "block";

	const container = document.querySelector('.container');
	container.style.display = "none";

	const header = document.querySelector('.headerContainer');
	header.style.display = "none";

	const nav = document.querySelector('nav');
	nav.style.display = 'none';


	if(this.play && this.wrongGussies < this.maxWrongGussies)
	{
		const win = document.querySelector('.win');
		win.style.display = "block";

		const time = document.querySelector('.time');
		time.innerHTML = `Done in ${this.hours}:${this.minutes}:${this.seconds}`;
		const attempts = document.querySelector('.attempts');
		attempts.innerHTML = `It took you ${this.wrongGussies} attempts`;
	
	}
	else if(this.play && this.wrongGussies >= this.maxWrongGussies)
	{
		const lose = document.querySelector('.lose');
		lose.style.display = "block";
	}
}
MemoryGame.prototype.closeHomePage = function(){
	const homepage = document.querySelector('.homepage');
	homepage.style.display = "none";

	const container = document.querySelector('.container');
	container.style.display = "grid";

	const header = document.querySelector('.headerContainer');
	header.style.display = "flex";

	const nav = document.querySelector('nav');
	
	nav.style.gridArea = nav;
	nav.style.display = 'block';
}
MemoryGame.prototype.gameFinished = function()
{
	this.stopTimer();
	this.openHomePage();
}

// game click if more than two opened 
// stop opening more cards no clicks
MemoryGame.prototype.handleGameClick = function(event){

	if(this.cardsDone === this.size)
	{
		event.stopPropagation();
		return;
	}
	// const card = document.querySelector('.card');
	const cardClicked = event.target;
	if(cardClicked.classList.contains('card'))
	{
		// do nothing
		if((this.cardOpen===2) || 
			(cardClicked.classList.contains('opened')) ||
			(cardClicked.classList.contains('done')))
		{
			event.stopPropagation();
			return;
		}
		else
		{	
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
function selectLevel(e){
	e.preventDefault();
	
	rows = e.currentTarget.dataset.row;
	columns = e.currentTarget.dataset.column;
	
	const levels = document.querySelectorAll('.level');
	levels.forEach(
		level => 
		{
			const link = level.querySelector('a');
			link.classList.remove('selected');
		}
		);
		const myLink = e.currentTarget.querySelector('a');
		myLink.classList.add('selected');

}
MemoryGame.prototype.startNewGame = function(e){
	this.cards = null;
	this.wrongGussies = 0;
	this.maxWrongGussies = 100;
	this.startTime = null;
	this.selectedItems = null;
	this.cardsDone = 0;
	this.cardOpen = 0;
	this.openedCards = [];
	this.play = true;

	this.columns = columns;
	this.rows = rows;

	this.size = this.columns * this.rows;

	const root = document.documentElement;

  root.style.setProperty('--column', columns);
  root.style.setProperty('--row', rows);

	this.closeHomePage();
	
	this.initCards();
	this.loadCards();
	this.initTimer();

	const cardContainer = document.querySelector('.boardContainer');
	cardContainer.addEventListener('click',(e) =>this.handleGameClick(e),true);

	const wrongGussies = document.querySelector('.counter');
	wrongGussies.innerHTML = "Wrong Gussies" + this.wrongGussies;	
	
}
