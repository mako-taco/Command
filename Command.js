(function() {
	var doChain = [];
	var undoChain = [];
	var maxLength = 100;

	var Command = {	
		do: function(up, down) {
			if(!up) {
				throw "UndoRedo.do missing required parameter 'up'."
			}
			else if(!down) {
				throw "UndoRedo.do missing required parameter 'down'."
			}
			else {
				var action = {
					up: up,
					down: down
				};
				undoChain = [];
				action.up();
				doChain.push(action);
				while(doChain.length > maxLength) {
					doChain.shift();
				}
			}
		};

		undo: function() {
			var undone = doChain.pop();
			if(undone) {
				undone.down();
				undoChain.push(undone);
			}
			else {
				console.warn("Nothing to undo.");
			}
		};

		redo: function() {
			var redone = undoChain.pop();
			if(redone) {
				redone.up();
				doChain.push(redone);
			}
			else {
				console.warn("Nothing to redo");
			}
		}
	};

	window.Command = Command;
})();
