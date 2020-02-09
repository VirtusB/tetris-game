class TetrisManager {
    constructor(document) {
        this.document = document;

        this.template = document.getElementById('player-template');

        this.instances = [];
    }

    createPlayer() {
        const element = this.document.importNode(this.template.content, true).children[0];

        const tetris = new Tetris(element);
        this.instances.push(tetris);

        this.document.body.appendChild(tetris.element);

        return tetris;
    }

    removePlayer(tetris) {
        this.instances.splice(this.instances.findIndex(t => {
            return t === tetris;
        }), 1);
        this.document.body.removeChild(tetris.element);
    }
}
