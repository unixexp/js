'use strict';

import "./assets/scss/styles.scss";
import "./assets/scss/header/header.scss";
import "./assets/scss/main/main.scss";
import "./assets/scss/footer/footer.scss";
import "./components/slider/slider.scss";
import "./assets/scss/media.scss";

import Slider from "./components/slider/slider.js";

// Slider block
const newsSlider = new Slider("news-slider");

const newsSliderSlideLeftButton = document.querySelector(".news-arrow-left");
const newsSliderSlideRightButton = document.querySelector(".news-arrow-right");

newsSliderSlideLeftButton.addEventListener(
	"click",
	(e) => {
		newsSlider.slideLeft();
	});

newsSliderSlideRightButton.addEventListener(
	"click",
	(e) => {
		newsSlider.slideRight();
	});

function watchSliderState(state) {
	if (state.position == newsSlider.POSITION_START) {
		newsSliderSlideLeftButton.classList.remove("news__arrow-img--enabled");
		newsSliderSlideRightButton.classList.add("news__arrow-img--enabled");
	} else if (state.position == newsSlider.POSITION_END) {
		newsSliderSlideLeftButton.classList.add("news__arrow-img--enabled");
		newsSliderSlideRightButton.classList.remove("news__arrow-img--enabled");
	} else {
		newsSliderSlideLeftButton.classList.add("news__arrow-img--enabled");
		newsSliderSlideRightButton.classList.add("news__arrow-img--enabled");
	}
}

newsSlider.setCallback(watchSliderState);

// MainMenu block
const mainMenuButton = document.querySelector(".menu-btn");
const mainMenu = document.querySelector(".menu");

const displayMenu = () => {
	const minimized = mainMenu.classList.contains("menu--minimized");
	if (!minimized) {
		mainMenu.classList.add("menu--minimized");
		setTimeout(() => mainMenu.classList.add("menu--hidden"), 300);
	} else {
		mainMenu.classList.remove("menu--minimized");
		setTimeout(() => mainMenu.classList.remove("menu--hidden"), 50);
	}
};
mainMenuButton.addEventListener("click", displayMenu);

window.addEventListener("load", () => {
	if (window.matchMedia('(max-width: 996px)').matches) {
		mainMenu.classList.add("menu--minimized");
		mainMenu.classList.add("menu--hidden");
	} else if (window.matchMedia('(min-width: 997px)').matches) {
		mainMenu.classList.remove("menu--minimized");
		mainMenu.classList.remove("menu--hidden");
	}
});

/*
window.addEventListener("resize", () => {
	if (window.matchMedia('(max-width: 996px)').matches) {
		mainMenu.classList.add("menu--minimized");
		setTimeout(() => mainMenu.classList.add("menu--hidden"), 300);
	} else if (window.matchMedia('(min-width: 997px)').matches) {
		mainMenu.classList.remove("menu--hidden");
		mainMenu.classList.remove("menu--minimized");
	}
});
*/

