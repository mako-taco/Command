test( "Command", function() {
	ok(window.hasOwnProperty("Command"), "Passed!");
	ok(Command.buffer === Command.bufferActions, "Command.buffer aliases Command.bufferActions");
	ok(Command.stop === Command.stopBuffer, "Command.stop aliases Command.stopBuffer");
});

test("Do, Undo, Redo", function() {
	var a = 0;
	Command.do(function() {
		a = 5;
	}, function() {
		a = 0;
	});
	ok(a === 5, "Command is do-able");

	Command.undo();
	ok(a === 0, "Command is undo-able");

	Command.redo()
	ok(a === 5, "Command is redo-able");

	var n = 3;
	while(n--) {
		Command.do(function() {
			a--;
		}, function() {
			a++;
		});
	}

	ok(a === 2, "Multiple commands in a row do correctly");

	Command.undo();
	Command.undo();
	ok(a === 4, "and undo correctly");
});

test("Maximum stored actions", function() {
	var n = Command.maxLength;
	Command.maxLength++;

	ok(Command.maxLength === n + 1, "Command.maxLength should be settable");

	Command.maxLength = 3;

	var a = 0;
	var n = 5;
	while(n--) {
		Command.do(function() {
			a++;
		}, function() {
			a--;
		});
	}

	n = 5;
	while(n--) {
		Command.undo();
	}

	ok(a === 2, "Command should only record up to maxLength actions");
});

test("Buffered actions", function() {
	var a = 0;
		n = 5;

	Command.maxLength = 100;
	Command.bufferActions();
	while(n--) {
		Command.do(function() {
			a++;
		}, function() {
			a--;
		});
	}

	Command.undo();
	Command.undo();

	ok(a === 3, "Undoing during a buffer should behave like buffering was false");

	a = 0;
	n = 5;
	Command.bufferActions();
	while(n--) {
		Command.do(function() {
			a++;
		}, function() {
			a--;
		});
	}
	Command.stopBuffer();

	Command.undo();
	ok(a === 0, "1x Undo after stopping the buffer should undo all buffered actions");

	Command.redo();
	ok(a === 5, "1x Redo after stopping the buffer / undoing should apply all buffered actions");
});

test("Multiple calls to buffer", function() {
	var a = 100;

	var divideBy2AndAdd5 = function() {
		Command.buffer();
		
		Command.do(function() {
			a /= 2;
		}, function() {
			a *= 2;
		});

		Command.do(function() {
			a += 5;
		}, function() {
			a -= 5;
		});

		Command.stopBuffer();
	}

	Command.buffer();

	var oldA = a;
	Command.do(function() {
 		a %= 7;
	}, function() {
		a = oldA;
	})

	divideBy2AndAdd5();

	Command.stopBuffer();
	ok(a === 6, "shouln't affect functionality");

	Command.undo();
	ok(a === 100, "should all undo after the buffer is stopped that many times");

	Command.redo();
	ok(a === 6, "should redo as a single action after the buffer is stopped that many times (" + a + " === 6?)" );
})