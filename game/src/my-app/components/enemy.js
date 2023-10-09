import Component from "../../engine/components/component";
import { loadImage } from "../../engine/utils/files";

export const ENEMY_STATE_IDLE = 0;
export const ENEMY_STATE_RUN = 1;
export const ENEMY_STATE_ATTACK = 2;
export const ENEMY_STATE_DIE = 3;

export class Enemy extends Component {

    constructor(app, x, y, width, height, layerName) {
        super(app, x, y, width, height, layerName);
        // Sprite animation
        this.spriteWidth = 0;
        this.spriteHeight = 0;
        this.startSrcX = 0;
        this.stepSrcX = 0;
        this.srcX = this.startSrcX;
        this.srcY = 0;
        this.frame = 0;
        this.frames = 0;
        this.timeToAnimate = 0;
        this.animateInterval = 50;
        this.layerName = layerName;
        // Will set by level
        this.layer = null;
        // Distance between enemy and oponent
        // when enemy will start run
        this.visibility = 0;
        this.health = 100;
        this.strength = 5;
        this.speed = 1;
        this.currentSpeed = 0;
        // Resorces and states
        this.stateData = [
            { url: null, img: null, lastLineFrame: 0, lastFrame: 0 },
            { url: null, img: null, lastLineFrame: 0, lastFrame: 0 },
            { url: null, img: null, lastLineFrame: 0, lastFrame: 0 },
            { url: null, img: null, lastLineFrame: 0, lastFrame: 0 }
        ];
        this.state = ENEMY_STATE_IDLE;
        this.isAttacking = false;
        this.attackCompleted = false;
        this.isRunning = false;
        this.isIdle = true;
        this.isDying = false;
        this.died = false;
    }

    async init() {
        await super.init();

        for (const i in this.stateData) {
            this.stateData[i].img = await loadImage(this.stateData[i].url);
        }
    }

    update(params) {
        super.update(params);

        this.x = this.x + this.layer.currentSpeed - this.currentSpeed;

        if (this.died) return;

        this.timeToAnimate += params.deltaTime;

        if (this.timeToAnimate > this.animateInterval) {

            this.frame++;
            this.frames++;

            if (this.frames == this.stateData[this.state].lastFrame) {
                if (this.isDying) {
                    this.died = true;
                    this.isDying = false;
                } else {
                    this.srcX = this.startSrcX;
                    this.srcY = 0;
                    this.frame = 0;
                    this.frames = 0;
                }

                if (this.isAttacking) {
                    this.attackCompleted = true;
                    this.isAttacking = false;
                }
            } else {
                if (this.frame == this.stateData[this.state].lastLineFrame) {
                    this.frame = 0;
                    this.srcX = this.startSrcX;
                    this.srcY += this.spriteHeight;
                } else {
                    this.srcX += this.stepSrcX;
                }
            }

            this.timeToAnimate = 0;
        }
    }

    render(params) {
        super.render(params);

        if (this.app.debug) {
            this.context.strokeRect(
                this.app.scaleByX(this.x),
                this.app.scaleByY(this.y),
                this.app.scaleByX(this.width),
                this.app.scaleByY(this.height)
                );
        }

        this.context.drawImage(
            this.stateData[this.state].img,
            this.srcX,
            this.srcY,
            this.spriteWidth,
            this.spriteHeight,
            this.app.scaleByX(this.x),
            this.app.scaleByY(this.y),
            this.app.scaleByX(this.width),
            this.app.scaleByY(this.height)
        );
    }

    idle() {
        if (this.isIdle && !this.isDying && !this.died && !this.isAttacking) {
            this.frame = 0;
            this.frames = 0;
            this.srcX = this.startSrcX;
            this.srcY = 0;
            this.frames = 0;
            this.state = ENEMY_STATE_IDLE;
            this.isRunning = false;
            this.isAttacking = false;
            this.isIdle = true;
            this.currentSpeed = 0;
        }
    }

    run() {
        if (!this.isRunning && !this.isDying && !this.died && !this.isAttacking) {
            this.frame = 0;
            this.frames = 0;
            this.srcX = this.startSrcX;
            this.srcY = 0;
            this.frames = 0;
            this.state = ENEMY_STATE_RUN;
            this.isRunning = true;
            this.isIdle = false;
            this.currentSpeed = this.speed;
        }
    }

    attack() {
        if (!this.isAttacking && !this.isDying && !this.died) {
            this.frame = 0;
            this.frames = 0;
            this.srcX = this.startSrcX;
            this.srcY = 0;
            this.frames = 0;
            this.state = ENEMY_STATE_ATTACK;
            this.isIdle = false;
            this.isRunning = false;
            this.isAttacking = true;
            this.currentSpeed = 0;
        }
    }

    die() {
        if (!this.isAttacking && !this.isDying && !this.died) {
            this.frame = 0;
            this.frames = 0;
            this.srcX = this.startSrcX;
            this.srcY = 0;
            this.frames = 0;
            this.state = ENEMY_STATE_DIE;
            this.isIdle = false;
            this.isRunning = false;
            this.isAttacking = false;
            this.isDying = true;
            this.currentSpeed = 0;
        }
    }

    checkCollision(component) {
        if (!this.died && this.x < component.x + component.width - this.startSrcX && this.x > component.x) {
            return true;
        } else {
            return false;
        }
    }

    checkVisibility(component) {
        const distance = this.x - (component.x + component.width);
        if (distance <= this.visibility && !this.checkCollision(component)) {
            return true;
        } else {
            return false;
        }
    }

}