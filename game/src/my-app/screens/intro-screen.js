import Component from "../../engine/components/component";
import ErrorScreen from "./error-screen";
import GameScreen from "./game-screen";
import { loadImage } from "../../engine/utils/files";

export default class IntroScreen extends Component {

    constructor(app, x, y, width, height) {
        super(app, x, y, width, height);
        this.images = [];
        this.fps = 15;
        this.timeToAnimate = 0;
        this.frame = 0;
    }

    async init() {
        super.init();

        try {
            for (let i = 1; i <= 60; i++) {
                const image = await loadImage(`assets/img/intro/${i}.jpg`);
                this.images.push(image);
            }
        } catch (err) {
            this.app.setComponent(new ErrorScreen(this.app, err));
            return false;
        }

        return true;
    }

    update(params) {
        super.update(params);

        this.timeToAnimate += params.deltaTime;
        if (this.timeToAnimate >= 1000 / this.fps) {
            if (this.frame < this.images.length-1) {
                this.frame++;
            } else {
                this.app.setComponent(new GameScreen(this.app, this.canvas));
                return
            }

            this.timeToAnimate = 0;
        }
    }

    render(params) {
        super.render(params);
        
        this.context.drawImage(
            this.images[this.frame],
            0,
            0,
            this.app.scaleByX(this.app.worldWidth),
            this.app.scaleByY(this.app.worldHeight)
            );

    }

}