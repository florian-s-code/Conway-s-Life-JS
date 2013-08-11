(function() {
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

		gridWidth = +widthInput.value - +widthInput.value%1;
		gridHeight = +heightInput.value - +heightInput.value%1;
		cellSize = +sizeInput.value - +sizeInput.value%1;

		widthInput.value = gridWidth;
		heightInput.value = gridHeight;
		sizeInput.value = cellSize;

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


	var resetCounterButton = document.getElementById("resetcounter");

	resetCounterButton.addEventListener("mousedown", function() {
		tickCount = 0;
		tickCounter.textContent = "Tick count : "+tickCount;
	}, false);

})()