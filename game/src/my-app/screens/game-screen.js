import Component from "../../engine/components/component";
import ErrorScreen from "./error-screen";
import ParkLevel from "../levels/park-level";
import MetroLevel from "../levels/metro-level";

export default class GameScreen extends Component {

    constructor(app, x, y, width, height) {
        super(app, x, y, width, height);
        this.levels = [ParkLevel, MetroLevel]
        this.level = null;
    }

    async init() {
        await super.init();

        try {
            this.level = new this.levels[0](this.app);
            await this.level.init();
        } catch(err) {
            console.log(err);
            this.app.setComponent(new ErrorScreen(this.app, err.toString()));
        }
    }

    update(params) {
        super.update(params);

        if (params.keys.findIndex(k => k === "ArrowLeft") !== -1) {
            this.level.player.runBackward();
        } else if (params.keys.findIndex(k => k === "ArrowRight") !== -1) {
            this.level.player.runForward();
        } else if (params.keys.findIndex(k => k === " ") !== -1) {
            this.level.player.attack();
        }  else {
            this.level.player.idle();
        }

        this.level.update(params);
    }

    render(params) {
        super.render(params);
        this.level.render(params);
    }

}