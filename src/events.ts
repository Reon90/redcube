class Events {
    redraw: Function;
    isPan: boolean;
    isDrag: boolean;
    x: number;
    y: number;
    zoomValue: number;

    constructor(redraw) {
        const canvas = document.querySelector('#canvas');
        this.redraw = redraw;
        this.zoomValue = 0;
        document.addEventListener('wheel', this);
        canvas.addEventListener('mousedown', this);
        canvas.addEventListener('mousemove', this);
        canvas.addEventListener('mouseup', this);
        document.addEventListener('keyup', this);
        document.addEventListener('keydown', this);
        addEventListener('resize', this);
    }

    handleEvent(e) {
        switch (e.type) {
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
            this.onEnd();
            break;
        case 'keyup':
            this.onKeyUp();
            break;
        case 'keydown':
            this.onKeyDown(e);
            break;
        case 'resize':
            this.onResize();
            break;
        }
    }

    onResize() {
        this.redraw('resize');
    }

    onKeyDown(e) {
        if (e.shiftKey || e.ctrlKey) {
            this.isPan = true;
        }
    }

    onKeyUp() {
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
                this.redraw('pan', [this.x, this.y], [e.clientX, e.clientY]);
            } else {
                this.redraw('rotate', [this.x, this.y], [e.clientX, e.clientY]);
            }
            this.x = e.clientX;
            this.y = e.clientY;
        }
    }

    onEnd() {
        this.isDrag = false;
    }

    zoom(e) {
        e.preventDefault();
        this.zoomValue = Math.min(this.zoomValue + e.deltaY, 1250);
        this.redraw('zoom', Math.pow(1.001, this.zoomValue));
    }
}

export { Events };