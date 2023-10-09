import { Level, Background, Layer } from "../components/level";
import { Player } from "../components/player";
import { DragonEnemy } from "../enemies/dragon-enemy";

export default class ParkLevel extends Level {

    constructor(app) {
        super(app);
        this.startPosition = 0;
        this.endPosition = 2000;
        this.backgrounds = [
            new Background(app, this, [
                new Layer(app, "sky", "assets/img/levels/park-level/day/sky.png", 0.1, false),
                new Layer(app, "clouds", "assets/img/levels/park-level/day/clouds.png", 0.15, true),
                new Layer(app, "landscape-far", "assets/img/levels/park-level/day/landscape-far.png", 0.25, false),
                new Layer(app, "andscape-middle", "assets/img/levels/park-level/day/landscape-middle.png", 0.5, false),
                new Layer(app, "front", "assets/img/levels/park-level/day/front.png", 0.5, false),
                new Layer(app, "trees", "assets/img/levels/park-level/day/trees.png", 0.5, false),
                new Layer(app, "ground", "assets/img/levels/park-level/day/ground.png", 1, false),
                new Layer(app, "light", "assets/img/levels/park-level/day/light.png", 1, false)
            ]),
            new Background(app, this, [
                new Layer(app, "sky", "assets/img/levels/park-level/night/sky.png", 0.1, false),
                new Layer(app, "clouds", "assets/img/levels/park-level/night/clouds.png", 0.15, true),
                new Layer(app, "landscape-far", "assets/img/levels/park-level/night/landscape-far.png", 0.25, false),
                new Layer(app, "andscape-middle", "assets/img/levels/park-level/night/landscape-middle.png", 0.5, false),
                new Layer(app, "front", "assets/img/levels/park-level/night/front.png", 0.5, false),
                new Layer(app, "trees", "assets/img/levels/park-level/night/trees.png", 0.5, false),
                new Layer(app, "ground", "assets/img/levels/park-level/night/ground.png", 1, false),
                new Layer(app, "light", "assets/img/levels/park-level/night/light.png", 1, false)
            ])
        ];
        this.fadeLength = 60;
        this.player = new Player(this.app, 100, 290, 230, 160);
        this.enemies = [
            new DragonEnemy(this.app, 700, 290, 230, 160, "ground"),
            // new Enemy(this.app, 10000, 290, 230, 160, "ground")
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