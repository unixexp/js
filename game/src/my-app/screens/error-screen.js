import Component from "../../engine/components/component";
import { splitStringByLines } from "../../engine/utils/strings";

export default class ErrorScreen extends Component {

    constructor(app, message) {
        super(app);
        this.message = message;
    }

    async init() {
        return super.init();
    }

    update(params) {
        super.update(params);
    }

    render(params) {
        super.render(params);

        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.app.scaleByX(this.app.worldWidth), this.app.scaleByY(this.app.worldHeight));
        this.context.font = `${this.app.scaleByMinAxis(18)}px NineteenNinetySeven`;
        this.context.fillStyle = "lightGreen";
        const lines = splitStringByLines(this.context, this.app.worldWidth, this.message);

        let y = 70;
        lines.map(line => {
            this.context.fillText(line, this.app.scaleByX(20), this.app.scaleByY(y));
            y += 30;
        })
        
        this.context.fillText(`fps: ${Math.round(params.fps)}`, this.app.scaleByX(20), this.app.scaleByY(40));
    }

}