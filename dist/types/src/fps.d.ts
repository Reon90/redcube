export declare class FPS {
    counterEl: HTMLDivElement;
    fps: number;
    elapsedTime: number;
    lastTime: number;
    constructor();
    tick(time: number): void;
}
