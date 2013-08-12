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

	cells = [];

	for(var i = 0; i < gridWidth*gridHeight; i++){ 		
		cells[i] = 0;
	}
}
function triggerCell(cell) {
	cells[cell] == 1 ? cells[cell] = 0 : cells[cell] = 1;
	changed.push(cell);
}

var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d"); //canvas context

var cells = [];
var changed = []; //cells which state have changed
var gridWidth; //in cells
var gridHeight; //in cells
var cellSize; //in pixels
var selected = []; //cells to be highlighted
var interval; //computation loop -> window.setInterval()
var tickCount = 0;
var tickCounter;

//mouse related:
var mouseX = 0;
var mouseY = 0;
var mouseDown = false;
var lastCell = -1; //last triggered cell (avoid multiple triggering of the same cell)

function init(ngridWidth, ngridHeight, ncellSize) {

	gridWidth = ngridWidth;
	gridHeight = ngridHeight;
	cellSize = ncellSize;

	tickCounter = document.createElement("p");
	tickCounter.style.marginTop = "5px";
	tickCounter.style.color = "grey";
	tickCounter.innerHTML = "Tick count : "+tickCount;
	tickCounter = document.body.insertBefore(tickCounter, canvas.nextSibling);

	initCanvas();

	canvas.addEventListener("mousemove", function(e) {

			mouseX = e.clientX - canvas.offsetLeft + window.pageXOffset;
			mouseY = e.clientY - canvas.offsetTop + window.pageYOffset;

			var cell = getCell(mouseX, mouseY);
			selected = getSurroundingCells(cell);

			if(mouseDown && cell != lastCell) {
				triggerCell(cell);
				lastCell = cell;
			}

	}, false);

	canvas.addEventListener("mousedown", function(e) {
		var cell = getCell(mouseX, mouseY);
		triggerCell(cell);
		lastCell = cell;
		mouseDown = true;
	
	}, false);

	canvas.addEventListener("mouseup", function(e) {
		mouseDown = false;
	}, false);

	canvas.addEventListener("mouseleave", function(e) {
		mouseDown = false;
	}, false);

	/**/document.addEventListener("keydown", function(e) {

		var moved = false;

		console.log("keypressed");
		switch(e.keyCode) {

			case 81: //Q or A -> left
			case 65: 
				mouseX -= cellSize;
				moved = true;
			break;

			case 87: //W or Z -> up
			case 90:
				mouseY -= cellSize;
				moved = true;
			break;

			case 68: //D -> right
				mouseX += cellSize;
				moved = true;
			break;

			case 83: //S -> down
				mouseY += cellSize;
				moved = true;
			break;

			case 13: //enter
				triggerCell(getCell(mouseX, mouseY));
			break;
		}

		if(moved) {
			var cell = getCell(mouseX, mouseY);
			selected = getSurroundingCells(cell);
		}

		return false;

	}, false);//*/

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
		var rightCell = -1;									//Have to be fixed though.

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

	var toDie = [];     //cells to be killed at this tick
	var toBorn = [];    //cells to be set alive at this tick
	var cellsNumber = cells.length;

	for(var cell = 0; cell < cellsNumber; cell++){

		var livingSurroundingCells = getLivingSurroundingCells(cell).length;

		switch(livingSurroundingCells) {
			case 0:
			case 1:
				if(cells[cell] == 1)
					toDie.push(cell);
			break;

			case 2:
				//stay the same
			break;

			case 3:
				if(cells[cell] == 0)
					toBorn.push(cell);
			break;

			default:
				if(cells[cell] == 1)
					toDie.push(cell);
		}
	}

	cellsNumber = toDie.length;
	for(var cell = 0; cell < cellsNumber; cell++)
		cells[toDie[cell]] = 0;

	cellsNumber = toBorn.length;
	for(var cell = 0; cell < cellsNumber; cell++)
		cells[toBorn[cell]] = 1;

	changed = toDie.concat(toBorn);
	tickCounter.textContent = "Tick count : "+tickCount++;

	return true;
}

function render() {

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var length = cells.length;
	for(var cell = 0; cell < length; cell++) {

		if(cells[cell] == 1) {

			ctx.fillStyle="black";
			var pos = getPos(cell);
			ctx.fillRect( pos.x, pos.y, cellSize, cellSize );   //render the cell
		}
		
	}

	length = selected.length;
	for(var i = 0; i < length; i++){

		var cell = selected[i];

		cells[cell] == 1 ? ctx.fillStyle = "#522" : ctx.fillStyle = "#aaa";
		var pos = getPos(cell);
		ctx.fillRect( pos.x, pos.y, cellSize, cellSize );
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