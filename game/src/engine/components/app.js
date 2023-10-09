export default class App {

    constructor(canvasElementId, worldWidth, worldHeight, onLoad) {
        this.keys = [];
        this.componentInitialized = false;
        this.paused = false;
        this.canvas = null;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.viewPortScaleRatioX = 0;
        this.viewPortScaleRatioY = 0;
        this.viewPortScaleRatio = 0;
        this.worldMouseX = 0;
        this.worldMouseY = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.debug = 1;

        window.addEventListener("keydown", e => {
            if (this.keys.findIndex(k => k === e.key) === -1)
                this.keys.push(e.key);
        });

        window.addEventListener("keyup", e => {
            this.keys.splice(this.keys.indexOf(e.key));
        });

        window.addEventListener("mousemove", e => {
            if (e.target.id === canvasElementId) {
                const targetRect = e.target.getBoundingClientRect();
                this.mouseX = e.clientX - targetRect.left;
                this.mouseY = e.clientY - targetRect.top;
            }
        })

        window.addEventListener("load", () => {
            this.canvas = document.getElementById(canvasElementId);
            this.refreshScaling();
            this.run();
            onLoad(this);
        });

    }

    async setComponent(component) {
        this.componentInitialized = false;
        try {
            await component.init();
        } catch(err) {
            console.log(`Error init component ${component.constructor.name}: ${err}`);
            return
        }
        this.componentInitialized = true;
        this.component = component;
    }

    pause() {
        this.paused = !this.paused;
    }

    run() {
        let lastTime = 0;

        requestAnimationFrame(tick.bind(this));

        function tick(timestamp) {
            requestAnimationFrame(tick.bind(this));
    
            const deltaTime = timestamp - lastTime;
            const fps = 1000 / deltaTime;
            const secondPart = deltaTime / 1000;

            const params = {
                timestamp,
                lastTime,
                deltaTime,
                fps,
                secondPart,
                keys: this.keys
            };

            lastTime = timestamp;

            this.refreshScaling();

            if (this.component && this.componentInitialized && !this.paused) {
                this.component.update(params);
                this.component.clear();
                this.component.render(params);
            }
        }
    }

    scaleByX(value) {
        return value / this.viewPortScaleRatioX;
    }

    scaleByY(value) {
        return value / this.viewPortScaleRatioY;
    }

    scaleByMinAxis(value) {
        return value / this.viewPortScaleRatio;
    }

    refreshScaling() {
        const canvasStyle = window.getComputedStyle(this.canvas);
        this.canvas.width = parseInt(canvasStyle.width);
        this.canvas.height = parseInt(canvasStyle.height);

        this.viewPortScaleRatioX = this.worldWidth / this.canvas.width;
        this.viewPortScaleRatioY = this.worldHeight / this.canvas.height;
        this.viewPortScaleRatio = Math.max(this.viewPortScaleRatioX, this.viewPortScaleRatioY);
        this.worldMouseX = this.mouseX * this.viewPortScaleRatioX;
        this.worldMouseY = this.mouseY * this.viewPortScaleRatioY;
    }

}