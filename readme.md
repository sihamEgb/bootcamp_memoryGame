# Memory Game Pseudo Code and Feature Breakdown

## Submitted 
- Github
- Netlify
- free text

## What is this app?
 It is a memory card game.
 You have to find every matching pait.
 It has 3 difficulty levels

## Stuff I found Hard to Implement:
The events listeners.
The flipping cards.
Hiding data in the cards so the user can't use
the inspect source to see the data

## Known Bugs
When two cards are flipped you can rapidly flip another card
Timer

## My Review of this assignment
At first it seemed small and easy, but all the event listeners handling and card flipping made it more challenging.
But it made read deeper in event listeners and prototypes.


## My Pseudo Code 
MemoryGame object{
	matrix 3*4 (in random)
	number of wrong gusses
	timer
}
win -> popup overlay start new game
no more than 2 cards flipped
	
### Different Functionalities
- play game
- reset game
- game finished
- timer finished
- number of wrong gusses reached
- all cards open

### Things that should be in HTML
- header game name , timer , curr wrong attempts , start new game
- board 3*4


### Things that should be generated in js

fill board with random cards images
start timer

card.addEventListener



### memory board
it is two dimensional array boardSize\*boardSize
