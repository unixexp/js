import Component from "../../engine/components/component";
import { loadImage } from "../../engine/utils/files";

export class Level extends Component {

    constructor(app) {
        super(app, 0, 0, 0, 0);
        // Level speed and length
        this.startPosition = 0;
        this.endPosition = 999999;
        this.speed = 2;
        // Background
        this.backgrounds = [];
        // Fader
        this.fadeLength = 0; // sec
        this.fadeTimer = 0;
        this.fadeAlpha = 1;
        this.currentBackgroundIndex = -1;
        this.nextBackgroundIndex = -1;
        // Characters and components
        this.player = null;
        this.enemies = [];
        this.artifacts = [];
        this.mainSpeedLayer = null;
    }

    async init() {
        await super.init();

        for (const background of this.backgrounds) {
            await background.init();

            
            if (this.mainSpeedLayer == null) {
                const mainSpeedLayerIndex = background.layers.findIndex(layer => layer.speedModifier == 1 ) ;
            
                if (mainSpeedLayerIndex != -1)
                    this.mainSpeedLayer = background.layers[mainSpeedLayerIndex];
            }
        }

        if (this.mainSpeedLayer == null)
            throw new Error("At least one of layers should have speed modifier = 1" +
                " for correct level position definition")

        for (const enemy of this.enemies) {
            await enemy.init();
            try {
                const layerIndex = this.backgrounds[0].layers.findIndex(layer => layer.name === enemy.layerName);
                enemy.layer = this.backgrounds[0].layers[layerIndex];
            } catch(err) {
                console.log(err);
                this.enemies = [];
            }
        }

        await this.player.init();
    }

    update(params) {
        super.update(params);
        this.fader(params);

        this.player.forwardCollisions = 0;
        this.enemies.forEach(enemy => {
            if (enemy.checkCollision(this.player)) {
                this.player.forwardCollisions++;
                enemy.attack();
            } else if (enemy.checkVisibility(this.player)) {
                enemy.run();
            } else {
                if (this.player.forwardCollisions > 0) {
                    this.player.forwardCollisions--;
                } else {
                    this.player.forwardCollisions = 0;
                }
            }

        this.enemies.forEach(enemy => {
            if (enemy.checkCollision(this.player)) {
                if (enemy.attackCompleted == true) {
                    enemy.attackCompleted = false;
                    this.player.health -= enemy.strength;
                    console.log(`GOAL!: ${this.player.health}`);
                }
            } else {
                if (enemy.attackCompleted == true) {
                    enemy.attackCompleted = false;
                    console.log(`MISS!: ${this.player.health}`);
                }
            }
        })

            enemy.update(params);
        });
        
        this.player.update(params);

        if (this.player.isRunningForward && -this.mainSpeedLayer.position < this.endPosition) {
            if (this.currentBackgroundIndex !== -1) {
                this.backgrounds[this.currentBackgroundIndex].runForward();
                this.backgrounds[this.currentBackgroundIndex].update(params);
            }
            
            if (this.nextBackgroundIndex !== -1) {
                this.backgrounds[this.nextBackgroundIndex].runForward();
                this.backgrounds[this.nextBackgroundIndex].update(params);
            }
        } else if (this.player.isRunningBackward && -this.mainSpeedLayer.position > this.startPosition) {
            if (this.currentBackgroundIndex !== -1) {
                this.backgrounds[this.currentBackgroundIndex].runBackward();
                this.backgrounds[this.currentBackgroundIndex].update(params);
            }
            
            if (this.nextBackgroundIndex !== -1) {
                this.backgrounds[this.nextBackgroundIndex].runBackward();
                this.backgrounds[this.nextBackgroundIndex].update(params);
            }
        } else {
            if (this.currentBackgroundIndex !== -1) {
                this.backgrounds[this.currentBackgroundIndex].idle();
                this.backgrounds[this.currentBackgroundIndex].update(params);
            }
            
            if (this.nextBackgroundIndex !== -1) {
                this.backgrounds[this.nextBackgroundIndex].idle();
                this.backgrounds[this.nextBackgroundIndex].update(params);
            }
        }
    }

    render(params) {
        super.render(params);

        if (this.nextBackgroundIndex !== -1) {
            this.backgrounds[this.nextBackgroundIndex].render(params);
            this.context.globalAlpha = this.fadeAlpha;
        }
        this.backgrounds[this.currentBackgroundIndex].render(params);
        this.context.globalAlpha = 1;

        this.enemies.forEach(enemy => {
            enemy.render(params);
        })

        this.player.render(params);
    }

    fader(params) {
        const backgroundsCount = this.backgrounds.length;

        if (!backgroundsCount) {
            this.currentBackgroundIndex = -1;
            this.nextBackgroundIndex = -1;
        } else if (backgroundsCount === 1) {
            this.currentBackgroundIndex = 0;
            this.nextBackgroundIndex = -1;
        } else {
            if (this.fadeLength > 0) {
                if (this.currentBackgroundIndex == -1) {
                    this.currentBackgroundIndex = 0;
                    this.nextBackgroundIndex = this.currentBackgroundIndex + 1;
                } else {
                    this.fadeTimer += params.deltaTime;
                    if (this.fadeTimer >= (1000 * this.fadeLength / 60)) {
                        this.fadeAlpha -= 0.016;
                        this.fadeTimer = 0;
                    }

                    if (this.fadeAlpha <= 0) {
                        this.currentBackgroundIndex = this.nextBackgroundIndex;
                        this.nextBackgroundIndex = this.currentBackgroundIndex + 1;
                        if (this.nextBackgroundIndex > backgroundsCount - 1)
                            this.nextBackgroundIndex = 0;
                        this.fadeAlpha = 1;
                    }
                }
            } else {
                this.currentBackgroundIndex = 0;
                this.nextBackgroundIndex = -1;
            }
        }
    }

}

export class Background extends Component {

    constructor(app, level, layers) {
        super(app, 0, 0, 0, 0);
        this.level = level;
        this.layers = layers;
        this.permanentLayers = this.layers.filter(layer => layer.permanent);
    }

    async init() {
        await super.init();

        for (const layer of this.layers) {
            await layer.init();
            layer.speed = this.level.speed * layer.speedModifier;
            layer.currentSpeed = 0;
        }
    }

    update(params) {
        super.update(params);
        this.layers.forEach(layer => layer.update(params));
    }

    render(params) {
        super.update(params);
        this.layers.forEach(layer => layer.render(params));
    }

    idle() {
        this.layers.forEach(layer => layer.currentSpeed = 0);
    }

    runForward() {
        this.layers.forEach(layer => layer.currentSpeed = -layer.speed);
    }

    runBackward() {
        this.layers.forEach(layer => layer.currentSpeed = layer.speed);
    }

}

export class Layer extends Component {

    constructor(app, name, imageURL, speedModifier, permanent) {
        super(app, 0, 0, 0, 0);
        this.name = name;
        this.imageURL = imageURL;
        this.image = null;
        this.width = 0;
        this.height = 0;
        this.position = 0;
        this.x1 = 0;
        this.x2 = 0;
        this.speedModifier = speedModifier;
        this.speed = 0;
        this.permanent = permanent;
    }

    async init() {
        await super.init();

        this.image = await loadImage(this.imageURL);
        this.width = this.image.width;
        this.height = this.image.height;
        this.x1 = 0;
        this.x2 = this.image.width;
    }

    update(params) {
        super.update(params);

        if (this.x1 < -this.width) {
            this.x1 = this.width + this.x2;
        }

        if (this.x2 < -this.width) {
            this.x2 = this.width + this.x1;
        }

        if (this.x1 > this.width) {
            this.x1 = this.x2 - this.width;
        }

        if (this.x2 > this.width) {
            this.x2 = this.x1 - this.width;
        }

        if (this.permanent) {
            this.x1 -= this.speed;
            this.x2 -= this.speed;
            this.position -= this.speed;
        }

        this.x1 += this.currentSpeed;
        this.x2 += this.currentSpeed;
        this.position += this.currentSpeed;
    }

    render(params) {
        super.render(params);

        this.context.drawImage(
            this.image,
            this.app.scaleByX(this.x1),
            this.app.scaleByY(0),
            this.app.scaleByX(this.width),
            this.app.scaleByY(this.height)
            );

        this.context.drawImage(
            this.image,
            this.app.scaleByX(this.x2),
            this.app.scaleByY(0),
            this.app.scaleByX(this.width),
            this.app.scaleByY(this.height)
            );
    }

}