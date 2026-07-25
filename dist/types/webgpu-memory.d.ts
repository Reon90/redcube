/**
 * Gets WebGPU memory usage. If no device is passed in returns info for all devices.
 */
declare function getWebGPUMemoryUsage(device: any): {
    memory: {
        total: number;
        buffer: number;
        texture: number;
        querySet: number;
        canvas: number;
        maxTotal: number;
    };
    resources: {
        buffer: number;
        texture: number;
        querySet: number;
    };
};
declare function resetMaxTotal(device: any): void;
export { getWebGPUMemoryUsage, resetMaxTotal };
