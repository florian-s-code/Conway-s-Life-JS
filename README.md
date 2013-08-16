# Conway's Game of Life JS
### Version 1.0

A basic implementation of [Conway's Game of Life](//en.wikipedia.org/wiki/Conway's_Game_of_Life) in HTML5, use mouse and click on the canvas to trigger cells or use WASD/ZQSD + Enter (better precision). Activate the calculation by setting the timer with the below form (and stop it before drawing or you'll see nothing) or use the Step button to see the changes step by step. You can change the dimension of the canvas with the second form. 

Try it [here](//yho.neocities.org/conway.html).


### Changelog :

v.0.5 :
Initial release.

v0.55 :
Added tick counter

v0.6 : 
Added keyboard support   
Better render algorithm (now much faster/smoother with a high number of cells)   
Fixed mouse position after scrolling

v1.0 :
Better compute algorithm, now depend of the number of active cells, not of the total number of cells   
Added Step button   
Changed files/code layout, conway.js now correspond to a Conway object, all other code has been moved to main.js  
Slightly changed page layout   

### To do :

Add a save function to save patterns in localStorage
