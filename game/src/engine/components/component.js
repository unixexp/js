export default class Component {

    constructor(app, x, y, width, height) {
        this.id = Math.floor(Math.random() * 1000);
        this.app = app;
        this.canvas = app.canvas;
        this.context = this.canvas.getContext("2d");
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    async init() {
    }

    clear() {
        this.context.clearRect(
            this.app.scaleByX(this.x),
            this.app.scaleByY(this.y),
            this.app.scaleByX(this.width),
            this.app.scaleByY(this.height)
        );
    }

    update(params) {
        // Implement this method in extended custom components
        // Do not forget call super.update(params); first

        // All game logic should be implemented in virtual world
        // coordinate system. Application props: worldWidth, worldHeight, worldMouseX etc..
    }

    render(params) {
        // Implement this method in extended custom components
        // Do not forget call super.render(params); first

        // To correct rendering world coordinate system to
        // canvas, please use application methods scaleByX(worldMouseX),
        // scaleByY(someObjectYPosition)
    }

}