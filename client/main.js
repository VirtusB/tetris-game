const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();
localTetris.element.classList.add('local');
localTetris.run();

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect('ws://127.0.0.1:9000');

const keyListener = (event) => {
    const code = event.keyCode || event.which;

    const playerOneMap = [65, 68, 81, 69, 83];
    const playerTwoMap = [72, 75, 89, 73, 74];

    const combined = playerOneMap.concat(playerTwoMap);

    if (!in_array(code, combined)) {
        return;
    }

    let index = null;

    if (in_array(code, playerOneMap)) {
        index = 0;
    } else {
        index = 1;
    }


    let actions = [];
    actions["move_left"] = [65, 72, -1];
    actions["move_right"] = [68, 75, 1];
    actions["rotate_left"] = [81, 89, 1];
    actions["rotate_right"] = [69, 73, -1];
    actions["drop"] = [83, 74, 1];

    actions = Object.entries(actions).map(([key, value]) => ({key,value}));


    let action = null;
    actions.forEach((act) => {
        act.value.forEach(val => {
            if (val === code) {
                action = [act.key, act.value];
            }
        });
    });


    let functions = [];
    functions["move_left"] = localTetris;
    functions["move_right"] = localTetris;
    functions["rotate_left"] = localTetris;
    functions["rotate_right"] = localTetris;
    functions["drop"] = localTetris;


    functions = Object.entries(functions).map(([key, value]) => ({key,value}));

    functions.forEach(func => {
        if (action[0] === func.key && event.type === 'keydown') {
            switch (func.key) {
                case 'move_left':
                    func.value.player.move(-1);
                    break;
                case 'move_right':
                    func.value.player.move(1);
                    break;
                case 'rotate_left':
                    func.value.player.rotate(-1);
                    break;
                case 'rotate_right':
                    func.value.player.rotate(1);
                    break;
            }

        }

        if (action[0] === func.key && func.key === 'drop') {
            if (event.type === 'keydown' && func.value.player.dropInterval !== func.value.player.DROP_FAST) {
                func.value.player.drop();
                func.value.player.dropInterval = func.value.player.DROP_FAST;
            } else {
                func.value.player.dropInterval = func.value.player.DROP_SLOW;

            }
        }

    });

    // 65 A move left
    // 68 D move right
    // 81 Q rotate
    // 69 E rotate
    // 83 S drop

    // 72 H move left
    // 75 K move right
    // 89 Y rotate
    // 73 I rotate
    // 74 J drop
};

document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);

function in_array(needle, haystack) {
    const length = haystack.length;
    for(let i = 0; i < length; i++) {
        if(haystack[i] === needle) return true;
    }
    return false;
}






