export default function Slider(sliderWrapperClassName) {

	const sliderWrapper = document.querySelector("." + sliderWrapperClassName);
	const slider = sliderWrapper.querySelector(".slider");
	const track = slider.querySelector(".slider__track");

	this.POSITION_START = 1;
	this.POSITION_MIDDLE = 2;
	this.POSITION_END = 3;

	this.callback = null;

	this.state = {
		offset: 0,
		maxOffset: 0,
		itemWidth: 0,
		position: this.POSITION_START
	};

	window.addEventListener(
		"resize",
		() => {
			this.state.position = this.POSITION_START;
			this.state.offset = 0;
			track.style.marginLeft = 0;

			if (this.callback !== null)
				this.callback(this.state);
		});

	this.slideRight = () => {
		const items = track.querySelectorAll(".slider__item");

		this.state.itemWidth = items[0].offsetWidth;
		this.state.maxOffset = track.offsetWidth - slider.offsetWidth;
		this.state.offset = this.state.offset - this.state.itemWidth;

		if (this.state.maxOffset > 0) {
			if (Math.abs(this.state.offset) >= this.state.maxOffset) {
				this.state.offset = this.state.maxOffset * -1;
				this.state.position = this.POSITION_END;
			} else {
				this.state.position = this.POSITION_MIDDLE;
			}

			track.style.marginLeft = this.state.offset.toString() + "px";
		}

		if (this.callback !== null)
			this.callback(this.state);
	}

	this.slideLeft = () => {
		const items = track.querySelectorAll(".slider__item");

		this.state.itemWidth = items[0].offsetWidth;
		this.state.offset = this.state.offset + this.state.itemWidth;

		if (this.state.offset >= 0) {
			this.state.offset = 0;
			this.state.position = this.POSITION_START;
		} else {
			this.state.position = this.POSITION_MIDDLE;
		}

		track.style.marginLeft = this.state.offset.toString() + "px";

		if (this.callback !== null)
			this.callback(this.state);
	}

	
	this.setCallback = (fns) => {
		this.callback = fns;
		if (this.callback !== null)
			this.callback(this.state);
	}

	if (this.callback !== null)
		this.callback(this.state);

}