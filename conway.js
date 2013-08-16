function Conway(canvas) {

	this.canvas = canvas; //document.getElementsByTagName("canvas")[0]
	this.ctx = canvas.getContext("2d"); //canvas context

	this.cells = [];
	this.changed = []; //cells which have changed last tick
	this.gridWidth; //in cells
	this.gridHeight; //in cells
	this.cellSize; //in pixels
	this.selected = []; //cells to be highlighted
	this.interval; //computation loop -> window.setInterval()
	this.tickCount = 0;
	this.tickCounter;

	//mouse related:
	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseDown = false;
	this.lastCell = -1; //last triggered cell (avoid multiple triggering of the same cell)

}

Conway.prototype.init = function(ngridWidth, ngridHeight, ncellSize) {

	this.gridWidth = ngridWidth;
	this.gridHeight = ngridHeight;
	this.cellSize = ncellSize;

	this.tickCounter = document.createElement("p");
	this.tickCounter.style.marginTop = "5px";
	this.tickCounter.style.color = "grey";
	this.tickCounter.innerHTML = "Tick count : "+this.tickCount;
	this.tickCounter = document.body.insertBefore(this.tickCounter, this.canvas.nextSibling);

	this.initCanvas();


	var conway = this; //prevent scope error - LOOKING FOR A BETTER WAY (if someone reading this know something : @yhoyhoj)

	this.canvas.addEventListener("mousemove", function(e) {

			conway.mouseX = e.clientX - conway.canvas.offsetLeft + window.pageXOffset;
			conway.mouseY = e.clientY - conway.canvas.offsetTop + window.pageYOffset;

			var cell = conway.getCell(conway.mouseX, conway.mouseY);
			conway.selected = conway.getSurroundingCells(cell);

			if(conway.mouseDown && cell != conway.lastCell) {
				conway.triggerCell(cell);
				conway.lastCell = cell;
			}

	}, false);

	this.canvas.addEventListener("mousedown", function(e) {
		var cell = conway.getCell(conway.mouseX, conway.mouseY);
		conway.triggerCell(cell);
		conway.lastCell = cell;
		conway.mouseDown = true;
	
	}, false);

	this.canvas.addEventListener("mouseup", function(e) {
		conway.mouseDown = false;
	}, false);

	this.canvas.addEventListener("mouseleave", function(e) {
		conway.mouseDown = false;
	}, false);

	/**/document.addEventListener("keydown", function(e) {

		var moved = false;

		switch(e.keyCode) {

			case 81: //Q or A -> left
			case 65: 
				conway.mouseX -= conway.cellSize;
				moved = true;
			break;

			case 87: //W or Z -> up
			case 90:
				conway.mouseY -= conway.cellSize;
				moved = true;
			break;

			case 68: //D -> right
				conway.mouseX += conway.cellSize;
				moved = true;
			break;

			case 83: //S -> down
				conway.mouseY += conway.cellSize;
				moved = true;
			break;

			case 13: //enter
				conway.triggerCell(conway.getCell(conway.mouseX, conway.mouseY));
			break;
		}

		if(moved) {
			var cell = conway.getCell(conway.mouseX, conway.mouseY);
			conway.selected = conway.getSurroundingCells(cell);
		}

		return false;

	}, false);//*/

}

Conway.prototype.startComputeLoop = function(time) {

	var conway = this;
	this.interval = setInterval(function() {conway.compute()}, time);
}

Conway.prototype.stopComputeLoop = function() {
	clearInterval(this.interval);
}

Conway.prototype.getPos = function(cell) {						//return the position f the given cell

	var posY = ((cell-cell%this.gridWidth)/this.gridWidth)*this.cellSize;
	var posX = (cell%this.gridWidth)*this.cellSize;

	return {x:posX, y:posY}
}

Conway.prototype.getCell = function(x, y) {					//return the cells at the given position
	var lines = (y-y%this.cellSize)/this.cellSize;
	var columns = (x-x%this.cellSize)/this.cellSize;

	return lines*this.gridWidth + columns;
}

Conway.prototype.initCanvas = function() {
	this.canvas.height = this.canvas.style.height = this.gridHeight*this.cellSize;
	this.canvas.width = this.canvas.style.width = this.gridWidth*this.cellSize;

	this.cells = [];
	this.selected= [];

	var length = this.gridWidth*this.gridHeight;
	for(var i = 0; i < length; i++) { 		
		this.cells[i] = 0;
	}
}
Conway.prototype.triggerCell = function(cell) {
	this.cells[cell] == 1 ? this.cells[cell] = 0 : this.cells[cell] = 1;
	this.changed.push(cell);
}

Conway.prototype.getSurroundingCells = function(cell) {       // return surrounding cells, clockwise starting with the top-left corner. Return -1 if cell is not on the board.

	var cellPosition = this.getPos(cell)

	if(cellPosition.y > this.cellSize-1 )
		var upperCells = [cell-this.gridWidth-1, cell-this.gridWidth, cell-this.gridWidth+1];
	else
		var upperCells = [-1, -1, -1];

	if(cellPosition.y < this.gridHeight*this.cellSize-this.cellSize)
		var lowerCells = [cell+this.gridWidth-1, cell+this.gridWidth, cell+this.gridWidth+1];
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

Conway.prototype.getLivingSurroundingCells = function(cell) {     //return the living cells surrounding the given one.

	var livingCells = [];
	var surroundingCells = this.getSurroundingCells(cell);
	var length = surroundingCells.length;

	for(var i = 0; i < length; i++) {

		if(surroundingCells[i] > -1)
			this.cells[surroundingCells[i]] == 1 ? livingCells.push(surroundingCells[i]): false;
	}

	return livingCells;
}

Conway.prototype.nextState = function(cell) { //return the next state of the cell OR -1 if the cell shouldn't change.

	var initialState = this.cells[cell];
	var change = false;

	switch(this.getLivingSurroundingCells(cell).length) {
		case 0:
		case 1:
			if(initialState == 1)
				change = true;
		break;

		case 2:
			//stay the same
		break;

		case 3:
			if(initialState == 0)
				change = true;
		break;

		default:
			if(initialState == 1)
				change = true;
	}

	if(change){
		if(initialState == 1)
			return 0;
		else
			return 1;
	}
	else
		return -1

}

Conway.prototype.compute = function() {

	var toDie = [];     //cells to be killed at this tick
	var toBorn = [];    //cells to be set alive at this tick
	var toBeTested = []; //cells
	var tested = [];    //cells already tested

	// "A cell that did not change at the last time step, and none of whose neighbours changed, is guaranteed not to change at the current time step as well" - Wikipedia
	// So a cell which have been changed last tick or is one the changed cells' neighbours should be tested.

	var length = this.changed.length;
	for(var i = 0; i < length; i++) {
		toBeTested = toBeTested.concat(this.changed[i], this.getSurroundingCells(this.changed[i]));
	}

	while(toBeTested.length != 0) {

		var cell = toBeTested.shift();

		if(tested.indexOf(cell) == -1 && cell != -1) {
			tested.push(cell);
			var cellState = this.nextState(cell);
			if(cellState != -1) {
				cellState == 1 ? toBorn.push(cell) : toDie.push(cell);
			}
		}

	}

	cellsNumber = toDie.length;
	for(var cell = 0; cell < cellsNumber; cell++)
		this.cells[toDie[cell]] = 0;

	cellsNumber = toBorn.length;
	for(var cell = 0; cell < cellsNumber; cell++)
		this.cells[toBorn[cell]] = 1;

	this.tickCounter.textContent = "Tick count : "+this.tickCount++;

	this.changed = toDie.concat(toBorn);

	return true;
}

Conway.prototype.render = function() {

	ctx = this.ctx;
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	var length = this.cells.length;
	for(var cell = 0; cell < length; cell++) {

		if(this.cells[cell] == 1) {
			ctx.fillStyle="black";
			var pos = this.getPos(cell);
			ctx.fillRect( pos.x, pos.y, this.cellSize, this.cellSize );   //render the cell
		}
		
	}

	length = this.selected.length;
	for(var i = 0; i < length; i++){

		var cell = this.selected[i];

		this.cells[cell] == 1 ? ctx.fillStyle = "#522" : ctx.fillStyle = "#aaa";
		var pos = this.getPos(cell);
		ctx.fillRect( pos.x, pos.y, this.cellSize, this.cellSize );
	}
}