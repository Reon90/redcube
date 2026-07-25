declare class Events implements EventListenerObject {
    redraw: (type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]) => void;
    isPan?: boolean;
    isDrag?: boolean;
    x: number;
    y: number;
    constructor(canvas: HTMLCanvasElement, redraw: (type: string, coordsStart?: [number, number] | number, coordsMove?: [number, number]) => void);
    handleEvent(e: Event): void;
    onResize(): void;
    onKeyDown(e: KeyboardEvent): void;
    onKeyUp(): void;
    onStart(e: MouseEvent): void;
    onMove(e: MouseEvent): void;
    onEnd(): void;
    zoom(e: WheelEvent): void;
}
export { Events };
