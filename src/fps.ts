export class FPS {
    counterEl: HTMLDivElement;
    fps: number;
    elapsedTime: number;
    lastTime: number;

    constructor() {
        this.counterEl = document.createElement('div');
        this.counterEl.setAttribute(
            'style',
            'position: absolute; top: 0; right: 0; color: #fff; font-size: 30px; background: #000;'
        );
        document.body.appendChild(this.counterEl);
        this.fps = 0;
        this.elapsedTime = 0;
        this.lastTime = 0;
    }

    tick(time) {
        this.fps++;
        this.elapsedTime += time - this.lastTime;
        this.lastTime = time;
        if (this.elapsedTime >= 1000) {
            this.counterEl.innerHTML = String(this.fps);
            this.fps = 0;
            this.elapsedTime -= 1000;
        }
    }
}
