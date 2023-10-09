import { Level, Background, Layer } from "../components/level";
import { Player } from "../components/player";
import { DragonEnemy } from "../enemies/dragon-enemy";

export default class MetroLevel extends Level {

    constructor(app) {
        super(app);
        this.startPosition = 0;
        this.endPosition = 2000;
        this.backgrounds = [
            new Background(app, this, [
                new Layer(app, "back", "assets/img/levels/metro-level/standard/back.png", 0.5, false),
                new Layer(app, "train", "assets/img/levels/metro-level/standard/train.png", 0.5, false),
                new Layer(app, "ground", "assets/img/levels/metro-level/standard/ground.png", 1, false),
                new Layer(app, "col", "assets/img/levels/metro-level/standard/col.png", 1, false),
            ])
        ];
        this.fadeLength = 60;
        this.player = new Player(this.app, 100, 290, 230, 160);
        this.enemies = [
            new DragonEnemy(this.app, 700, 290, 230, 160, "ground")
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