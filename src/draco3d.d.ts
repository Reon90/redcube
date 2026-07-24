declare module 'draco3d' {
    export function createDecoderModule(config: { onModuleLoaded: (module: import('./decoder').DracoModule) => void }): void;
}
