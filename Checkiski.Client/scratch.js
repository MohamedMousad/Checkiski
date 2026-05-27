const { Chess } = require('chess.js');

const game = new Chess();
game.move('e4');
game.move('e5');
game.move('Nf3');
game.move('Nc6');

const history = game.history({ verbose: true });
console.log("Length:", history.length);
console.log("Move 0:", history[0]);
console.log("Move 1:", history[1]);
