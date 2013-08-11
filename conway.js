function getPos(cell) {						//return the position f the given cell

	var posY = ((cell-cell%gridWidth)/gridWidth)*cellSize;
	var posX = (cell%gridWidth)*cellSize;

	return {x:posX, y:posY}
}

function getCell(x, y) {					//return the cells at the given position
	var lines = (y-y%cellSize)/cellSize;
	var columns = (x-x%cellSize)/cellSize;

	return lines*gridWidth + columns;
}

function initCanvas() {
	canvas.height = canvas.style.height = gridHeight*cellSize;
	canvas.width = canvas.style.width = gridWidth*cellSize;
	ctx = canvas.getContext("2d");

	for(var i = 0; i < gridWidth*gridHeight; i++){ 		
		cells[i] = 0;
	}
}

var canvas = document.getElementsByTagName("canvas")[0];
var ctx; //canvas context

var cells = [];
var gridWidth; //in cells
var gridHeight; //in cells
var cellSize; //in pixels
var selected = []; //cells to be highlighted
var interval; //computation loop -> window.setInterval()

//mouse position :
var mouseX;
var mouseY;

function init(ngridWidth, ngridHeight, ncellSize) {

	gridWidth = ngridWidth;
	gridHeight = ngridHeight;
	cellSize = ncellSize;

	initCanvas();

	canvas.addEventListener("mousemove", function(e) {
		mouseX = e.clientX - canvas.offsetLeft;
		mouseY = e.clientY - canvas.offsetTop;

		var cell = getCell(mouseX, mouseY);
		selected = getSurroundingCells(cell);


	}, false);

	canvas.addEventListener("mousedown", function(e) {

		var cell = getCell(mouseX, mouseY);
		cells[cell] == 1 ? cells[cell] = 0 : cells[cell] = 1;

		//console.log(cell);

	}, false);

	var widthInput = document.getElementById("width");
	var heightInput = document.getElementById("height");
	var sizeInput = document.getElementById("size");
	var generateButton = document.getElementById("generate");

	generateButton.addEventListener("mousedown", function(e) {
		if(interval) {
			stopButton.disabled = true;
			clearInterval(interval);
			startButton.disabled = false;
		}

		gridWidth = +widthInput.value;
		gridHeight = +heightInput.value;
		cellSize = +sizeInput.value;

		initCanvas();

	}, false)


	var intervalInput = document.getElementById("time");
	var startButton = document.getElementById("start");
	var stopButton = document.getElementById("stop");

	startButton.addEventListener("mousedown", function(e) {
		startButton.disabled = true;
		interval = setInterval(compute, intervalInput.value);
		stopButton.disabled = false;
	}, false);
	stopButton.addEventListener("mousedown", function(e) {
		stopButton.disabled = true;
		clearInterval(interval);
		startButton.disabled = false;
	}, false);

}

function getSurroundingCells(cell) {       // return surrounding cells, clockwise starting with the top-left corner. Return -1 if cell is not on the board.

	cellPosition = getPos(cell)

	if(cellPosition.y > cellSize-1 )
		var upperCells = [cell-gridWidth-1, cell-gridWidth, cell-gridWidth+1];
	else
		var upperCells = [-1, -1, -1];

	if(cellPosition.y < gridHeight*cellSize-cellSize)
		var lowerCells = [cell+gridWidth-1, cell+gridWidth, cell+gridWidth+1];
	else
		var lowerCells = [-1, -1, -1];

	//if(cellPosition.x < gridWidth*cellSize-cellSize)      //checking this way wasn't useful because it didn't work with diagonal cells (which are checked with the top and bottom ones)  
		var rightCell = cell+1;								//I'll pretend this permit the "torroidal array" (should be the right name), it means what reaches the left, appears at right.
	/*else 													//And it doesn't look broken (so it's okay this way !)
		var rightCell = -1;

	if(cellPosition.x > cellSize-1)*/
		var leftCell = cell-1;
	/*else
		var leftCell = -1;*/

	return [upperCells[0], upperCells[1], upperCells[2], rightCell, lowerCells[0], lowerCells[1], lowerCells[2], leftCell];

}

function getLivingSurroundingCells(cell){     //return the living cells surrounding the given one.

	livingCells = [];
	var surroundingCells = getSurroundingCells(cell);
	var length = surroundingCells.length;

	for(var i = 0; i < length; i++) {

		if(surroundingCells[i] > -1)
			cells[surroundingCells[i]] == 1 ? livingCells.push(surroundingCells[i]): false;
	}

	return livingCells;
}

function compute() {


	var toDie = [];     //cells to be killed at this tick    (Actually there is no checking to see if the cells will change its state or not, so cells wich are already dead can be in this array)
	var toBorn = [];    //cells to be set alive at this tick	(Same thing with this array)
	var cellsNumber = cells.length;

	for(var cell = 0; cell < cellsNumber; cell++){

		var livingSurroundingCells = getLivingSurroundingCells(cell).length;

		switch(livingSurroundingCells) {
			case 0:
			case 1:
				toDie.push(cell);
			break;

			case 2:
				//stay the same
			break;

			case 3:
				toBorn.push(cell);
			break;

			default:
				toDie.push(cell);
		}

	}

	cellsNumber = toDie.length;
	for(var cell = 0; cell < cellsNumber; cell++)
		cells[toDie[cell]] = 0;

	cellsNumber = toBorn.length;
	for(var cell = 0; cell < cellsNumber; cell++)
		cells[toBorn[cell]] = 1;

	return true;
}

function render() {

	/*var time = Date.now();
	var delta = (time - then)/1000;*/

	var cellsNumber = cells.length;
	for(var cell = 0; cell < cellsNumber; cell++) {

		if(selected.indexOf(cell) > -1)											//if the cell has to be higlighted
			cells[cell] == 1 ? ctx.fillStyle = "#500": ctx.fillStyle = "#bbb";
		else
			cells[cell] == 1 ? ctx.fillStyle = "black" : ctx.fillStyle = "white";

		var pos = getPos(cell);
		
		//console.log(pos.x+"  x  "+pos.y);  //uncommenting this will slow everything down

		ctx.fillRect( pos.x, pos.y, cellSize, cellSize );   //render the cell

		//console.log(cell);

	}

	if(!window.requestAnimationFrame) {                  //loop using requestAnimationFrame (compatibility check)
		if(window.mozRequestAnimationFrame)
			mozRequestAnimationFrame(render);
		else if(window.webkitRequestAnimationFrame)
			webkitRequestAnimationFrame(render);
		else
			setInterval(render, 1000/50)
	}
	else
		requestAnimationFrame(render);


}

init(50, 50, 10); //init the board
render(); //start the render loop