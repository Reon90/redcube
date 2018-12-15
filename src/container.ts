interface Entry<T> {
    definition: T;
    dependencies: Array<string>;
    args: Array<any>;
}

export class Container {
    _services: Map<string, Entry<Function>>;
    _singletons: Map<string, object>;

    constructor() {
        this._services = new Map();
        this._singletons = new Map();
        this.update = this.update.bind(this);
    }

    register(name, definition, dependencies = [], ...args) {
        this._services.set(name, { definition, dependencies, args });

        if (!this._isClass(definition)) {
            this._updateDep(name, definition);
        } else {
            definition.__update = this.update;
        }
    }

    get(name) {
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

    update(name, ...args) {
        const c = this._services.get(name);
        c.args = args;
        this._singletons.delete(name);

        const instance = this.get(name);
        this._updateDep(name, instance);
    }

    _updateDep(name, definition) {
        for (const [key, instance] of this._singletons) {
            if (
                this._services.get(key).dependencies.some(dep => dep === name)
            ) {
                instance[
                    `set${name.charAt(0).toUpperCase() + name.slice(1)}`
                ].call(instance, definition);
            }
        }
        this._singletons.set(name, definition);
    }

    _getResolvedDependencies(service) {
        let classDependencies = [];
        if (service.dependencies) {
            classDependencies = service.dependencies.map(dep => {
                return [dep, this.get(dep)];
            });
        }
        return classDependencies;
    }

    _createInstance(service) {
        const instance = new service.definition(...service.args);
        this._getResolvedDependencies(service).forEach(([name, dep]) => {
            instance[`set${name.charAt(0).toUpperCase() + name.slice(1)}`].call(
                instance,
                dep
            );
        });

        return instance;
    }

    _isClass(definition) {
        return (
            typeof definition === 'function' &&
            /^class\s/.test(Function.prototype.toString.call(definition))
        );
    }
}
