Command
=======
A functional Undo / Redo library for JavaScript. Command creates a variable on window 
called `Command` which you use to perform your actions.

Performing Actions
-----
To perform an undoable action, use `Command.do(up, down)`, which takes two function
arguments. The first is the action you want to perform right now, and the
second is the 'undo' function.
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
To do this, use `Command.bufferAction()` or `Command.buffer()` for short. This
is particularly useful when you encapsulate atomic actions in functions, 
but want to treat a group of them as a single action in the undo stack. End the
buffer with `Command.stopBuffer()` or `Command.stop()`.

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

Common Patterns
-----
###Keeping track of Closure
In most cases, you should rely on the magic of closures to remember your two states.
I like to use variables prefixed with `old` and `new` to help keep this organized.
```javascript
var myValue = "Hello";

//...
var oldValue = myValue,
  newValue = "Goodbye";
  
Command.do(function() {
  myValue = newValue;
}, function() {
  myValue = oldValue;
});
```
###Order of Operations
The order of your statements inside the `do` and `undo` functions is very important.
In general, if `do` A, then B, then C, you want to `undo` C, then B, then A.
```javascript
var num = 5,
  num2 = 5;

//incorrect!
var doBadMath = function(n) {
  Command.do(function() {
    num *= n; //A
    num += n; //B
  }, function() {
    num /= n; //A
    num -= n; //B
  });  
};

//correct!
var doMath = function(n) {
  Command.do(function() {
    num2 *= n; //A
    num2 += n; //B
  }, function() {
    num2 -= n; //B
    num2 /= n; //A
  });  
};

doBadMath(3); 
doMath(3);
//num = 18, num2 = 18

Command.undo();
Command.undo();
//num = 3, num2 = 5
```
