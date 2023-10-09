import { loadImage } from "../../engine/utils/files";
import { Enemy, ENEMY_STATE_IDLE, ENEMY_STATE_RUN, ENEMY_STATE_ATTACK, ENEMY_STATE_DIE } from "../components/enemy";

export class DragonEnemy extends Enemy {

    constructor(app, x, y, width, height, layerName) {
        super(app, x, y, width, height, layerName);
        this.spriteWidth = 230;
        this.spriteHeight = 160;
        this.startSrcX = 70;
        this.stepSrcX = 300;
        this.visibility = 350;

        this.stateData = [
            { url: "assets/img/characters/dragon-enemy-idle.png", lastLineFrame: 4, lastFrame: 20 },
            { url: "assets/img/characters/dragon-enemy-run.png", lastLineFrame: 4, lastFrame: 20 },
            { url: "assets/img/characters/dragon-enemy-attack.png", lastLineFrame: 5, lastFrame: 30 },
            { url: "assets/img/characters/dragon-enemy-die.png", lastLineFrame: 4, lastFrame: 24 }
        ];
    }

    async init() {
        await super.init();
    }

    update(params) {
        super.update(params);
    }

    render(params) {
        super.render(params);
    }

}