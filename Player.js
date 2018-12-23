class Player {
    constructor(tetris) {
        this.tetris = tetris;
        this.arena = tetris.arena;

        this.DROP_SLOW = 1000;
        this.DROP_FAST = 50;

        this.dropCounter = 0;
        this.dropInterval = this.DROP_SLOW;
        this.pos = {x: 0, y: 0};
        this.matrix = null;
        this.score = 0;

        this.reset();
    }

    move(dir) {
        this.pos.x += dir;
        if (this.arena.is_colliding(this)) {
            this.pos.x -= dir;
        }
    }

    reset() {
        const pieces = 'ILJOTSZ';

        this.matrix = Tetris.createPiece( pieces[pieces.length * Math.random() | 0 ]);
        this.pos.y = 0;
        this.pos.x = (this.arena.matrix[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0);

        if (this.arena.is_colliding( this)) {
            // GAME OVER
            this.arena.clear();
            this.score = 0;
            this.tetris.updateScore(this.score);
        }
    }

    rotate(dir) {
        const posX = this.pos.x;
        let offset = 1;

        Player._rotateMatrix(this.matrix, dir);

        while (this.arena.is_colliding(this)) {
            this.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));

            if (offset > this.matrix[0].length) {
                Player._rotateMatrix(this.matrix, -dir);
                this.pos.x = posX;
                return;
            }
        }
    }

    static _rotateMatrix(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }

        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }


    drop() {
        this.pos.y++;
        if (this.arena.is_colliding(this)) {
            this.pos.y--;
            this.arena.merge(this);
            this.reset();
            this.score += this.arena.sweep();
            this.tetris.updateScore(this.score);
        }
        this.dropCounter = 0;
    }

    update(deltaTime) {
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }
    }
}


