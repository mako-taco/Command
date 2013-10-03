(function() {
	var doChain = [];
	var undoChain = [];
	var buffer = [];
	var buffering = 0;

	var Command = {	
		maxLength: 500,
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
					var curBuffer = buffer[buffering];
					curBuffer[curBuffer.length] = action;
				}
				undoChain = [];
				action.up();
				doChain.push(action);
				while(doChain.length > this.maxLength) {
					doChain.shift();
				}
			}
		},

		undo: function() {
			if(buffering) {
				buffering = 0;
				//should actually undo the BUFFER here!
				buffer = [];
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
				buffering = 0;
				buffer = [];
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
			buffering++;
			buffer[buffering] = [];
		},

		stopBuffer: function() {
			if(buffering <= 0) return;

			var stored = buffer[buffering].slice();
			buffer[buffering] = [];
			
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

			buffering--;
			if(buffering) {
				var curBuffer = buffer[buffering];
				curBuffer[curBuffer.length] = action;
			}
			else {
				undoChain = [];
				doChain.push(action);
				while(doChain.length > this.maxLength) {
					doChain.shift();
				}
			}

		},

		clearBuffer: function() {
			buffering = 0;
			buffer = [];
		}
	};

	Command.stop = Command.stopBuffer;
	Command.buffer = Command.bufferActions;
	window.Command = Command;
})();
