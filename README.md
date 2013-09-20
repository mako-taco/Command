Command
=======
A functional Undo / Redo library for JavaScript

Performing Actions
-----
To perform an undoable action, use `Command.do`.
```javascript
var x = 5;

Command.do(function() {
  x += 20;
}, function() {
  x -= 20;
});
//x is now 25

Command.undo();
//x is now 5

Command.redo();
//x is now 25 again
```

Buffering Actions
-----
Sometimes, you will want to group multiple actions into a single action.
To do this, use `Command.bufferAction` or `Command.buffer` for short. This
is particularly useful when you encapsulate atomic actions in functions, 
but want to treat a group of them as a single action in the undo stack.

```javascript
var x = 5,
    y = 3;

var moveX = function() {
  Command.do(function() {
    x++;
  }, function() {
    x--;
  });
};

var moveY = function() {
  Command.do(function() {
    y++;
  }, function() {
    y--;
  });
};

var moveXandY = function() {
  Command.buffer();
  moveX();
  moveY();
  Command.stop();
};


moveXandY();
//x is 6, y is 4

Command.undo();
//x is 5, y is 3
```

If you happen to call `Command.undo` or `Command.redo` after calling `Command.buffer`
but before calling `Command.stop`, the buffer will be destroyed and the steps will 
forever be treated as atomic actions.


