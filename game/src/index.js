'use strict';

import "./assets/scss/index.scss";
import App from "./engine/components/app"
import IntroScreen from "./my-app/screens/intro-screen";
import GameScreen from "./my-app/screens/game-screen";

const width = 800;
const height = 500;

const app = new App("main-canvas", width, height, (app) => {
    app.setComponent(new GameScreen(app, 0, 0, width, height));

    const actions = document.querySelector(".actions");
    actions.addEventListener("click", (e) => {
        e.target.blur();
        if (e.target.id == "pause") {
            app.pause();
            e.target.innerHTML = app.paused ? "Release" : "Pause";
        } else if (e.target.id == "about") {
            alert("About =)");
        } else if (e.target.id === "new-game") {
            app.setComponent(new IntroScreen(app, 0, 0, width, height));
        }
    });
});
