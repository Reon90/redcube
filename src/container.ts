interface Entry<T> {
    definition: T;
    dependencies: Array<string>;
    args: Array<unknown>;
}

export class Container {
    _services: Map<string, Entry<unknown>>;
    _singletons: Map<string, unknown>;

    constructor() {
        this._services = new Map();
        this._singletons = new Map();
        this.update = this.update.bind(this);
    }

    register(name: string, definition: unknown, dependencies: string[] = [], ...args: unknown[]) {
        this._services.set(name, { definition, dependencies, args });

        if (!this._isClass(definition)) {
            this._updateDep(name, definition);
        } else {
            (definition as Record<string, unknown>).__update = this.update;
        }
    }

    get(name: string): unknown {
        const c = this._services.get(name);

        if (!c) {
            return null;
        }

        if (this._isClass(c.definition)) {
            const singletonInstance = this._singletons.get(name);
            if (singletonInstance) {
                return singletonInstance;
            } else {
                const newSingletonInstance = this._createInstance(c);
                this._singletons.set(name, newSingletonInstance);
                return newSingletonInstance;
            }
        } else {
            return c.definition;
        }
    }

    update(name: string, ...args: unknown[]) {
        const c = this._services.get(name)!;
        c.args = args;
        this._singletons.delete(name);

        const instance = this.get(name);
        this._updateDep(name, instance);
    }

    _updateDep(name: string, definition: unknown) {
        for (const [key, instance] of this._singletons) {
            if (this._services.get(key)!.dependencies.some(dep => dep === name)) {
                (instance as Record<string, (arg: unknown) => void>)[`set${name.charAt(0).toUpperCase() + name.slice(1)}`].call(instance, definition);
            }
        }
        this._singletons.set(name, definition);
    }

    _getResolvedDependencies(service: Entry<unknown>): [string, unknown][] {
        let classDependencies: [string, unknown][] = [];
        if (service.dependencies) {
            classDependencies = service.dependencies.map(dep => {
                return [dep, this.get(dep)] as [string, unknown];
            });
        }
        return classDependencies;
    }

    _createInstance(service: Entry<unknown>) {
        const Definition = service.definition as new (...args: unknown[]) => Record<string, (arg: unknown) => void>;
        const instance = new Definition(...service.args);
        this._getResolvedDependencies(service).forEach(([name, dep]) => {
            instance[`set${name.charAt(0).toUpperCase() + name.slice(1)}`].call(instance, dep);
        });

        return instance;
    }

    _isClass(definition: unknown) {
        return typeof definition === 'function' && /^class\s/.test(Function.prototype.toString.call(definition));
    }
}
