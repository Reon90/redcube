class Events implements EventListenerObject {
    redraw: (type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]) => void;
    isPan?: boolean;
    isDrag?: boolean;
    x!: number;
    y!: number;

    constructor(
        canvas: HTMLCanvasElement,
        redraw: (type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]) => void,
    ) {
        this.redraw = redraw;
        document.addEventListener('wheel', this, { passive: false });
        canvas.addEventListener('mousedown', this);
        canvas.addEventListener('mousemove', this);
        canvas.addEventListener('mouseup', this);
        document.addEventListener('keyup', this);
        document.addEventListener('keydown', this);
        addEventListener('resize', this);
    }

    handleEvent(e: Event) {
        switch (e.type) {
            case 'wheel':
                this.zoom(e as WheelEvent);
                break;
            case 'mousedown':
                this.onStart(e as MouseEvent);
                break;
            case 'mousemove':
                this.onMove(e as MouseEvent);
                break;
            case 'mouseup':
                this.onEnd();
                break;
            case 'keyup':
                this.onKeyUp();
                break;
            case 'keydown':
                this.onKeyDown(e as KeyboardEvent);
                break;
            case 'resize':
                this.onResize();
                break;
        }
    }

    onResize() {
        this.redraw('resize');
    }

    onKeyDown(e: KeyboardEvent) {
        if (e.shiftKey || e.ctrlKey) {
            this.isPan = true;
        }
    }

    onKeyUp() {
        this.isPan = false;
    }

    onStart(e: MouseEvent) {
        this.x = e.clientX;
        this.y = e.clientY;
        this.isDrag = true;
    }

    onMove(e: MouseEvent) {
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

    zoom(e: WheelEvent) {
        e.preventDefault();
        this.redraw('zoom', e.deltaY);
    }
}

export { Events };
