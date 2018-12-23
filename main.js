const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);










function createPiece(type) {
    switch (type) {
        case 'T':
            return [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ];
        case 'O':
            return [
                [2, 2],
                [2, 2]
            ];4
        case 'L':
            return [
                [0, 3, 0],
                [0, 3, 0],
                [0, 3, 3]
            ];
        case 'J':
            return [
                [0, 4, 0],
                [0, 4, 0],
                [4, 4, 0]
            ];
        case 'I':
            return [
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0]
            ];
        case 'S':
            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0]
            ];
        case 'Z':
            return [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ];
    }
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena.matrix, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}





let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    player.update(deltaTime);

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

const colors = [
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];

const arena = new Arena(12, 20);

const player = new Player();


document.addEventListener('keydown', event => {
    const code = event.keyCode || event.which;

    switch (code) {
        case 37:
            player.move(-1);
            break;
        case 39:
            player.move(1);
            break;
        case 40:
            player.drop();
            break;
        case 81:
            player.rotate(-1);
            break;
        case 87:
            player.rotate(1);
            break;
    }
});


player.reset();
update();



