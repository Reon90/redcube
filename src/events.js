class Events {
	constructor(redraw) {
		this.redraw = redraw;
		document.addEventListener('wheel', this);
		document.addEventListener('mousedown', this);
		document.addEventListener('mousemove', this);
		document.addEventListener('mouseup', this);
	}

	handleEvent(e) {
		switch(e.type) {
			case 'wheel':
				this.zoom(e);
		}
	}

	zoom(e) {
		if (!this.zoom.v) this.zoom.v = 0; 
		this.zoom.v = Math.min(this.zoom.v + e.deltaY, 1250);
		this.redraw(Math.pow(1.001, this.zoom.v));
	}
}

export { Events };