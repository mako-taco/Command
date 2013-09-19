(function() {
	var doChain = [];
	var undoChain = [];
	var maxLength = 100;
	var buffer = [];
	var buffering = false;

	var Command = {	
		do: function(up, down) {
			if(!up) {
				throw "Command.do missing required parameter 'up'."
			}
			else if(!down) {
				throw "Command.do missing required parameter 'down'."
			}
			else {

				var action = {
					up: up,
					down: down
				};

				if(buffering) {
					buffer[buffer.length] = action;
				}
				undoChain = [];
				action.up();
				doChain.push(action);
				while(doChain.length > maxLength) {
					doChain.shift();
				}
			}
		},

		undo: function() {
			if(buffering) {
				this.clearBuffer();
			}

			var undone = doChain.pop();
			if(undone) {
				undone.down();
				undoChain.push(undone);
			}
			else {
				console.warn("Nothing to undo.");
			}
		},

		redo: function() {
			if(buffering) {
				this.clearBuffer();
			}

			var redone = undoChain.pop();
			if(redone) {
				redone.up();
				doChain.push(redone);
			}
			else {
				console.warn("Nothing to redo");
			}
		},

		bufferActions: function() {
			buffering = true;
		},

		stopBuffer: function() {
			if(!buffering) return;

			buffering = false;
			var stored = buffer.slice();
			buffer = [];
			
			var n = stored.length;
			for(var i=0; i<n; i++) {
				doChain.pop();
			}

			var action = {
				up: function() {
					for(var i=0; i<n; i++) {
						stored[i].up();
					}
				}, 
				down: function() {
					for(var i=n-1; i>=0; i--) {
						stored[i].down();
					}
				}
			}

			undoChain = [];
			doChain.push(action);
			while(doChain.length > maxLength) {
				doChain.shift();
			}
		},

		clearBuffer: function() {
			buffer = [];
			buffering = false;
		}
	};

	window.Command = Command;
})();
