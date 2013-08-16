var conway = new Conway(document.getElementsByTagName("canvas")[0]);
conway.init(50, 50, 10); //init the board

function render() {

	conway.render();

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
render(); //start the render loop

(function() {
	var widthInput = document.getElementById("width");
	var heightInput = document.getElementById("height");
	var sizeInput = document.getElementById("size");
	var generateButton = document.getElementById("generate");

	generateButton.addEventListener("mousedown", function(e) {

		if(isNaN(widthInput.value) || isNaN(heightInput.value) || isNaN(sizeInput.value)) {
			return;
		}

		if(conway.interval) {
			stopButton.disabled = true;
			conway.stopComputeLoop();
			startButton.disabled = false;
			stepButton.disabled = false;
		}

		conway.gridWidth = +widthInput.value - +widthInput.value%1;
		conway.gridHeight = +heightInput.value - +heightInput.value%1;
		conway.cellSize = +sizeInput.value - +sizeInput.value%1;

		widthInput.value = conway.gridWidth;
		heightInput.value = conway.gridHeight;
		sizeInput.value = conway.cellSize;

		conway.initCanvas();

	}, false)


	var intervalInput = document.getElementById("time");
	var startButton = document.getElementById("start");
	var stopButton = document.getElementById("stop");
	var stepButton = document.getElementById("step");

	startButton.addEventListener("mousedown", function(e) {
		startButton.disabled = true;
		stepButton.disabled = true;
		conway.startComputeLoop(intervalInput.value);
		stopButton.disabled = false;
	}, false);
	stopButton.addEventListener("mousedown", function(e) {
		stopButton.disabled = true;
		conway.stopComputeLoop();
		startButton.disabled = false;
		stepButton.disabled = false;
	}, false);
	stepButton.addEventListener("mousedown", function(e) {
		conway.compute();
	}, false);


	var resetCounterButton = document.getElementById("resetcounter");

	resetCounterButton.addEventListener("mousedown", function() {
		conway.tickCount = 0;
		conway.tickCounter.textContent = "Tick count : "+conway.tickCount;
	}, false);

})()