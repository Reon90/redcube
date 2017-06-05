class Events {
	constructor(redraw) {
		this.redraw = redraw;
		document.addEventListener('wheel', this);
		document.addEventListener('mousedown', this);
		document.addEventListener('mousemove', this);
		document.addEventListener('mouseup', this);
		document.addEventListener('keyup', this);
		document.addEventListener('keydown', this);

		this.position = [0, 0, 0];
	}

	handleEvent(e) {
		switch(e.type) {
			case 'wheel':
				this.zoom(e);
				break;
			case 'mousedown':
				this.onStart(e);
				break;
			case 'mousemove':
				this.onMove(e);
				break;
			case 'mouseup':
				this.onEnd(e);
				break;
			case 'keyup':
				this.onKeyUp(e);
				break;
			case 'keydown':
				this.onKeyDown(e);
				break;
		}
	}

	onKeyDown(e) {
		if (e.shiftKey || e.ctrlKey) {
			this.isPan = true;
		}
	}

	onKeyUp(e) {
		this.isPan = false;
	}

	onStart(e) {
		this.x = e.clientX;
		this.y = e.clientY;
		this.isDrag = true;
	}

	onMove(e) {
		if (this.isDrag) {
			if (this.isPan) {
				this.redraw('pan', [e.clientX - this.x, e.clientY - this.y]);
			} else {
				this.redraw('rotate', [this.x, this.y], [e.clientX, e.clientY]);
				this.x = e.clientX;
				this.y = e.clientY;
			}
		}
	}

	onEnd(e) {
		this.isDrag = false;
	}

	zoom(e) {
		if (!this.zoom.v) this.zoom.v = 0; 
		this.zoom.v = Math.min(this.zoom.v + e.deltaY, 1250);
		this.redraw('zoom', Math.pow(1.001, this.zoom.v));
	}
}

export { Events };