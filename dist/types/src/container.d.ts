interface Entry<T> {
    definition: T;
    dependencies: Array<string>;
    args: Array<unknown>;
}
export declare class Container {
    _services: Map<string, Entry<unknown>>;
    _singletons: Map<string, unknown>;
    constructor();
    register(name: string, definition: unknown, dependencies?: string[], ...args: unknown[]): void;
    get(name: string): unknown;
    update(name: string, ...args: unknown[]): void;
    _updateDep(name: string, definition: unknown): void;
    _getResolvedDependencies(service: Entry<unknown>): [string, unknown][];
    _createInstance(service: Entry<unknown>): Record<string, (arg: unknown) => void>;
    _isClass(definition: unknown): boolean;
}
export {};
