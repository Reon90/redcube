var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// basis_transcoder.js
var basis_transcoder_exports = {};
var init_basis_transcoder = __esm({
  "basis_transcoder.js"() {
    window.BASIS = (() => {
      var _scriptName = typeof document != "undefined" ? document.currentScript?.src : void 0;
      if (typeof __filename != "undefined") _scriptName ||= __filename;
      return (function(moduleArg = {}) {
        var moduleRtn;
        var Module = moduleArg;
        var readyPromiseResolve, readyPromiseReject;
        var readyPromise = new Promise((resolve, reject) => {
          readyPromiseResolve = resolve;
          readyPromiseReject = reject;
        });
        var ENVIRONMENT_IS_WEB = typeof window == "object";
        var ENVIRONMENT_IS_WORKER = typeof importScripts == "function";
        var ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
        if (ENVIRONMENT_IS_NODE) {
        }
        var moduleOverrides = Object.assign({}, Module);
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = (status, toThrow) => {
          throw toThrow;
        };
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var readAsync, readBinary;
        if (ENVIRONMENT_IS_NODE) {
          var fs = require("fs");
          var nodePath = require("path");
          scriptDirectory = __dirname + "/";
          readBinary = (filename) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            var ret = fs.readFileSync(filename);
            return ret;
          };
          readAsync = (filename, binary = true) => {
            filename = isFileURI(filename) ? new URL(filename) : nodePath.normalize(filename);
            return new Promise((resolve, reject) => {
              fs.readFile(filename, binary ? void 0 : "utf8", (err2, data) => {
                if (err2) reject(err2);
                else resolve(binary ? data.buffer : data);
              });
            });
          };
          if (!Module["thisProgram"] && process.argv.length > 1) {
            thisProgram = process.argv[1].replace(/\\/g, "/");
          }
          arguments_ = process.argv.slice(2);
          quit_ = (status, toThrow) => {
            process.exitCode = status;
            throw toThrow;
          };
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (typeof document != "undefined" && document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptName) {
            scriptDirectory = _scriptName;
          }
          if (scriptDirectory.startsWith("blob:")) {
            scriptDirectory = "";
          } else {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
          }
          {
            if (ENVIRONMENT_IS_WORKER) {
              readBinary = (url) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response);
              };
            }
            readAsync = (url) => {
              if (isFileURI(url)) {
                return new Promise((reject, resolve) => {
                  var xhr = new XMLHttpRequest();
                  xhr.open("GET", url, true);
                  xhr.responseType = "arraybuffer";
                  xhr.onload = () => {
                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                      resolve(xhr.response);
                    }
                    reject(xhr.status);
                  };
                  xhr.onerror = reject;
                  xhr.send(null);
                });
              }
              return fetch(url, { credentials: "same-origin" }).then((response) => {
                if (response.ok) {
                  return response.arrayBuffer();
                }
                return Promise.reject(new Error(response.status + " : " + response.url));
              });
            };
          }
        } else {
        }
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.error.bind(console);
        Object.assign(Module, moduleOverrides);
        moduleOverrides = null;
        if (Module["arguments"]) arguments_ = Module["arguments"];
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        if (Module["quit"]) quit_ = Module["quit"];
        var wasmBinary;
        if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
        var wasmMemory;
        var ABORT = false;
        var EXITSTATUS;
        var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateMemoryViews() {
          var b = wasmMemory.buffer;
          Module["HEAP8"] = HEAP8 = new Int8Array(b);
          Module["HEAP16"] = HEAP16 = new Int16Array(b);
          Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
          Module["HEAPU16"] = HEAPU16 = new Uint16Array(b);
          Module["HEAP32"] = HEAP32 = new Int32Array(b);
          Module["HEAPU32"] = HEAPU32 = new Uint32Array(b);
          Module["HEAPF32"] = HEAPF32 = new Float32Array(b);
          Module["HEAPF64"] = HEAPF64 = new Float64Array(b);
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        function preRun() {
          if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
              addOnPreRun(Module["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          runtimeInitialized = true;
          callRuntimeCallbacks(__ATINIT__);
        }
        function postRun() {
          if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
              addOnPostRun(Module["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnInit(cb) {
          __ATINIT__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function addRunDependency(id) {
          runDependencies++;
          Module["monitorRunDependencies"]?.(runDependencies);
        }
        function removeRunDependency(id) {
          runDependencies--;
          Module["monitorRunDependencies"]?.(runDependencies);
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        function abort(what) {
          Module["onAbort"]?.(what);
          what = "Aborted(" + what + ")";
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          what += ". Build with -sASSERTIONS for more info.";
          var e = new WebAssembly.RuntimeError(what);
          readyPromiseReject(e);
          throw e;
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
        var isFileURI = (filename) => filename.startsWith("file://");
        function findWasmBinary() {
          var f = "basis_transcoder.wasm";
          if (!isDataURI(f)) {
            return locateFile(f);
          }
          return f;
        }
        var wasmBinaryFile;
        function getBinarySync(file) {
          if (file == wasmBinaryFile && wasmBinary) {
            return new Uint8Array(wasmBinary);
          }
          if (readBinary) {
            return readBinary(file);
          }
          throw "both async and sync fetching of the wasm failed";
        }
        function getBinaryPromise(binaryFile) {
          if (!wasmBinary) {
            return readAsync(binaryFile).then((response) => new Uint8Array(response), () => getBinarySync(binaryFile));
          }
          return Promise.resolve().then(() => getBinarySync(binaryFile));
        }
        function instantiateArrayBuffer(binaryFile, imports, receiver) {
          return getBinaryPromise(binaryFile).then((binary) => WebAssembly.instantiate(binary, imports)).then(receiver, (reason) => {
            err(`failed to asynchronously prepare wasm: ${reason}`);
            abort(reason);
          });
        }
        function instantiateAsync(binary, binaryFile, imports, callback) {
          if (!binary && typeof WebAssembly.instantiateStreaming == "function" && !isDataURI(binaryFile) && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE && typeof fetch == "function") {
            return fetch(binaryFile, { credentials: "same-origin" }).then((response) => {
              var result = WebAssembly.instantiateStreaming(response, imports);
              return result.then(callback, function(reason) {
                err(`wasm streaming compile failed: ${reason}`);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(binaryFile, imports, callback);
              });
            });
          }
          return instantiateArrayBuffer(binaryFile, imports, callback);
        }
        function getWasmImports() {
          return { a: wasmImports };
        }
        function createWasm() {
          var info = getWasmImports();
          function receiveInstance(instance, module2) {
            wasmExports = instance.exports;
            wasmMemory = wasmExports["L"];
            updateMemoryViews();
            wasmTable = wasmExports["P"];
            addOnInit(wasmExports["M"]);
            removeRunDependency("wasm-instantiate");
            return wasmExports;
          }
          addRunDependency("wasm-instantiate");
          function receiveInstantiationResult(result) {
            receiveInstance(result["instance"]);
          }
          if (Module["instantiateWasm"]) {
            try {
              return Module["instantiateWasm"](info, receiveInstance);
            } catch (e) {
              err(`Module.instantiateWasm callback failed with error: ${e}`);
              readyPromiseReject(e);
            }
          }
          if (!wasmBinaryFile) wasmBinaryFile = findWasmBinary();
          instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
          return {};
        }
        var callRuntimeCallbacks = (callbacks) => {
          while (callbacks.length > 0) {
            callbacks.shift()(Module);
          }
        };
        var noExitRuntime = Module["noExitRuntime"] || true;
        class ExceptionInfo {
          constructor(excPtr) {
            this.excPtr = excPtr;
            this.ptr = excPtr - 24;
          }
          set_type(type) {
            HEAPU32[this.ptr + 4 >> 2] = type;
          }
          get_type() {
            return HEAPU32[this.ptr + 4 >> 2];
          }
          set_destructor(destructor) {
            HEAPU32[this.ptr + 8 >> 2] = destructor;
          }
          get_destructor() {
            return HEAPU32[this.ptr + 8 >> 2];
          }
          set_caught(caught) {
            caught = caught ? 1 : 0;
            HEAP8[this.ptr + 12] = caught;
          }
          get_caught() {
            return HEAP8[this.ptr + 12] != 0;
          }
          set_rethrown(rethrown) {
            rethrown = rethrown ? 1 : 0;
            HEAP8[this.ptr + 13] = rethrown;
          }
          get_rethrown() {
            return HEAP8[this.ptr + 13] != 0;
          }
          init(type, destructor) {
            this.set_adjusted_ptr(0);
            this.set_type(type);
            this.set_destructor(destructor);
          }
          set_adjusted_ptr(adjustedPtr) {
            HEAPU32[this.ptr + 16 >> 2] = adjustedPtr;
          }
          get_adjusted_ptr() {
            return HEAPU32[this.ptr + 16 >> 2];
          }
          get_exception_ptr() {
            var isPointer = ___cxa_is_pointer_type(this.get_type());
            if (isPointer) {
              return HEAPU32[this.excPtr >> 2];
            }
            var adjusted = this.get_adjusted_ptr();
            if (adjusted !== 0) return adjusted;
            return this.excPtr;
          }
        }
        var exceptionLast = 0;
        var uncaughtExceptionCount = 0;
        var ___cxa_throw = (ptr, type, destructor) => {
          var info = new ExceptionInfo(ptr);
          info.init(type, destructor);
          exceptionLast = ptr;
          uncaughtExceptionCount++;
          throw exceptionLast;
        };
        var __abort_js = () => {
          abort("");
        };
        var structRegistrations = {};
        var runDestructors = (destructors) => {
          while (destructors.length) {
            var ptr = destructors.pop();
            var del = destructors.pop();
            del(ptr);
          }
        };
        function readPointer(pointer) {
          return this["fromWireType"](HEAPU32[pointer >> 2]);
        }
        var awaitingDependencies = {};
        var registeredTypes = {};
        var typeDependencies = {};
        var InternalError;
        var throwInternalError = (message) => {
          throw new InternalError(message);
        };
        var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
          myTypes.forEach(function(type) {
            typeDependencies[type] = dependentTypes;
          });
          function onComplete(typeConverters2) {
            var myTypeConverters = getTypeConverters(typeConverters2);
            if (myTypeConverters.length !== myTypes.length) {
              throwInternalError("Mismatched type converter count");
            }
            for (var i = 0; i < myTypes.length; ++i) {
              registerType(myTypes[i], myTypeConverters[i]);
            }
          }
          var typeConverters = new Array(dependentTypes.length);
          var unregisteredTypes = [];
          var registered = 0;
          dependentTypes.forEach((dt, i) => {
            if (registeredTypes.hasOwnProperty(dt)) {
              typeConverters[i] = registeredTypes[dt];
            } else {
              unregisteredTypes.push(dt);
              if (!awaitingDependencies.hasOwnProperty(dt)) {
                awaitingDependencies[dt] = [];
              }
              awaitingDependencies[dt].push(() => {
                typeConverters[i] = registeredTypes[dt];
                ++registered;
                if (registered === unregisteredTypes.length) {
                  onComplete(typeConverters);
                }
              });
            }
          });
          if (0 === unregisteredTypes.length) {
            onComplete(typeConverters);
          }
        };
        var __embind_finalize_value_object = (structType) => {
          var reg = structRegistrations[structType];
          delete structRegistrations[structType];
          var rawConstructor = reg.rawConstructor;
          var rawDestructor = reg.rawDestructor;
          var fieldRecords = reg.fields;
          var fieldTypes = fieldRecords.map((field) => field.getterReturnType).concat(fieldRecords.map((field) => field.setterArgumentType));
          whenDependentTypesAreResolved([structType], fieldTypes, (fieldTypes2) => {
            var fields = {};
            fieldRecords.forEach((field, i) => {
              var fieldName = field.fieldName;
              var getterReturnType = fieldTypes2[i];
              var getter = field.getter;
              var getterContext = field.getterContext;
              var setterArgumentType = fieldTypes2[i + fieldRecords.length];
              var setter = field.setter;
              var setterContext = field.setterContext;
              fields[fieldName] = { read: (ptr) => getterReturnType["fromWireType"](getter(getterContext, ptr)), write: (ptr, o) => {
                var destructors = [];
                setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
                runDestructors(destructors);
              } };
            });
            return [{ name: reg.name, fromWireType: (ptr) => {
              var rv = {};
              for (var i in fields) {
                rv[i] = fields[i].read(ptr);
              }
              rawDestructor(ptr);
              return rv;
            }, toWireType: (destructors, o) => {
              for (var fieldName in fields) {
                if (!(fieldName in o)) {
                  throw new TypeError(`Missing field: "${fieldName}"`);
                }
              }
              var ptr = rawConstructor();
              for (fieldName in fields) {
                fields[fieldName].write(ptr, o[fieldName]);
              }
              if (destructors !== null) {
                destructors.push(rawDestructor, ptr);
              }
              return ptr;
            }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction: rawDestructor }];
          });
        };
        var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {
        };
        var embind_init_charCodes = () => {
          var codes = new Array(256);
          for (var i = 0; i < 256; ++i) {
            codes[i] = String.fromCharCode(i);
          }
          embind_charCodes = codes;
        };
        var embind_charCodes;
        var readLatin1String = (ptr) => {
          var ret = "";
          var c = ptr;
          while (HEAPU8[c]) {
            ret += embind_charCodes[HEAPU8[c++]];
          }
          return ret;
        };
        var BindingError;
        var throwBindingError = (message) => {
          throw new BindingError(message);
        };
        function sharedRegisterType(rawType, registeredInstance, options = {}) {
          var name = registeredInstance.name;
          if (!rawType) {
            throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
          }
          if (registeredTypes.hasOwnProperty(rawType)) {
            if (options.ignoreDuplicateRegistrations) {
              return;
            } else {
              throwBindingError(`Cannot register type '${name}' twice`);
            }
          }
          registeredTypes[rawType] = registeredInstance;
          delete typeDependencies[rawType];
          if (awaitingDependencies.hasOwnProperty(rawType)) {
            var callbacks = awaitingDependencies[rawType];
            delete awaitingDependencies[rawType];
            callbacks.forEach((cb) => cb());
          }
        }
        function registerType(rawType, registeredInstance, options = {}) {
          if (!("argPackAdvance" in registeredInstance)) {
            throw new TypeError("registerType registeredInstance requires argPackAdvance");
          }
          return sharedRegisterType(rawType, registeredInstance, options);
        }
        var GenericWireTypeSize = 8;
        var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
          name = readLatin1String(name);
          registerType(rawType, { name, fromWireType: function(wt) {
            return !!wt;
          }, toWireType: function(destructors, o) {
            return o ? trueValue : falseValue;
          }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: function(pointer) {
            return this["fromWireType"](HEAPU8[pointer]);
          }, destructorFunction: null });
        };
        var shallowCopyInternalPointer = (o) => ({ count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType });
        var throwInstanceAlreadyDeleted = (obj) => {
          function getInstanceTypeName(handle) {
            return handle.$$.ptrType.registeredClass.name;
          }
          throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
        };
        var finalizationRegistry = false;
        var detachFinalizer = (handle) => {
        };
        var runDestructor = ($$) => {
          if ($$.smartPtr) {
            $$.smartPtrType.rawDestructor($$.smartPtr);
          } else {
            $$.ptrType.registeredClass.rawDestructor($$.ptr);
          }
        };
        var releaseClassHandle = ($$) => {
          $$.count.value -= 1;
          var toDelete = 0 === $$.count.value;
          if (toDelete) {
            runDestructor($$);
          }
        };
        var downcastPointer = (ptr, ptrClass, desiredClass) => {
          if (ptrClass === desiredClass) {
            return ptr;
          }
          if (void 0 === desiredClass.baseClass) {
            return null;
          }
          var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
          if (rv === null) {
            return null;
          }
          return desiredClass.downcast(rv);
        };
        var registeredPointers = {};
        var getInheritedInstanceCount = () => Object.keys(registeredInstances).length;
        var getLiveInheritedInstances = () => {
          var rv = [];
          for (var k in registeredInstances) {
            if (registeredInstances.hasOwnProperty(k)) {
              rv.push(registeredInstances[k]);
            }
          }
          return rv;
        };
        var deletionQueue = [];
        var flushPendingDeletes = () => {
          while (deletionQueue.length) {
            var obj = deletionQueue.pop();
            obj.$$.deleteScheduled = false;
            obj["delete"]();
          }
        };
        var delayFunction;
        var setDelayFunction = (fn) => {
          delayFunction = fn;
          if (deletionQueue.length && delayFunction) {
            delayFunction(flushPendingDeletes);
          }
        };
        var init_embind = () => {
          Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
          Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
          Module["flushPendingDeletes"] = flushPendingDeletes;
          Module["setDelayFunction"] = setDelayFunction;
        };
        var registeredInstances = {};
        var getBasestPointer = (class_, ptr) => {
          if (ptr === void 0) {
            throwBindingError("ptr should not be undefined");
          }
          while (class_.baseClass) {
            ptr = class_.upcast(ptr);
            class_ = class_.baseClass;
          }
          return ptr;
        };
        var getInheritedInstance = (class_, ptr) => {
          ptr = getBasestPointer(class_, ptr);
          return registeredInstances[ptr];
        };
        var makeClassHandle = (prototype, record) => {
          if (!record.ptrType || !record.ptr) {
            throwInternalError("makeClassHandle requires ptr and ptrType");
          }
          var hasSmartPtrType = !!record.smartPtrType;
          var hasSmartPtr = !!record.smartPtr;
          if (hasSmartPtrType !== hasSmartPtr) {
            throwInternalError("Both smartPtrType and smartPtr must be specified");
          }
          record.count = { value: 1 };
          return attachFinalizer(Object.create(prototype, { $$: { value: record, writable: true } }));
        };
        function RegisteredPointer_fromWireType(ptr) {
          var rawPointer = this.getPointee(ptr);
          if (!rawPointer) {
            this.destructor(ptr);
            return null;
          }
          var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
          if (void 0 !== registeredInstance) {
            if (0 === registeredInstance.$$.count.value) {
              registeredInstance.$$.ptr = rawPointer;
              registeredInstance.$$.smartPtr = ptr;
              return registeredInstance["clone"]();
            } else {
              var rv = registeredInstance["clone"]();
              this.destructor(ptr);
              return rv;
            }
          }
          function makeDefaultHandle() {
            if (this.isSmartPointer) {
              return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr });
            } else {
              return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr });
            }
          }
          var actualType = this.registeredClass.getActualType(rawPointer);
          var registeredPointerRecord = registeredPointers[actualType];
          if (!registeredPointerRecord) {
            return makeDefaultHandle.call(this);
          }
          var toType;
          if (this.isConst) {
            toType = registeredPointerRecord.constPointerType;
          } else {
            toType = registeredPointerRecord.pointerType;
          }
          var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
          if (dp === null) {
            return makeDefaultHandle.call(this);
          }
          if (this.isSmartPointer) {
            return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr });
          } else {
            return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp });
          }
        }
        var attachFinalizer = (handle) => {
          if ("undefined" === typeof FinalizationRegistry) {
            attachFinalizer = (handle2) => handle2;
            return handle;
          }
          finalizationRegistry = new FinalizationRegistry((info) => {
            releaseClassHandle(info.$$);
          });
          attachFinalizer = (handle2) => {
            var $$ = handle2.$$;
            var hasSmartPtr = !!$$.smartPtr;
            if (hasSmartPtr) {
              var info = { $$ };
              finalizationRegistry.register(handle2, info, handle2);
            }
            return handle2;
          };
          detachFinalizer = (handle2) => finalizationRegistry.unregister(handle2);
          return attachFinalizer(handle);
        };
        var init_ClassHandle = () => {
          Object.assign(ClassHandle.prototype, { isAliasOf(other) {
            if (!(this instanceof ClassHandle)) {
              return false;
            }
            if (!(other instanceof ClassHandle)) {
              return false;
            }
            var leftClass = this.$$.ptrType.registeredClass;
            var left = this.$$.ptr;
            other.$$ = other.$$;
            var rightClass = other.$$.ptrType.registeredClass;
            var right = other.$$.ptr;
            while (leftClass.baseClass) {
              left = leftClass.upcast(left);
              leftClass = leftClass.baseClass;
            }
            while (rightClass.baseClass) {
              right = rightClass.upcast(right);
              rightClass = rightClass.baseClass;
            }
            return leftClass === rightClass && left === right;
          }, clone() {
            if (!this.$$.ptr) {
              throwInstanceAlreadyDeleted(this);
            }
            if (this.$$.preservePointerOnDelete) {
              this.$$.count.value += 1;
              return this;
            } else {
              var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
              clone.$$.count.value += 1;
              clone.$$.deleteScheduled = false;
              return clone;
            }
          }, delete() {
            if (!this.$$.ptr) {
              throwInstanceAlreadyDeleted(this);
            }
            if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
              throwBindingError("Object already scheduled for deletion");
            }
            detachFinalizer(this);
            releaseClassHandle(this.$$);
            if (!this.$$.preservePointerOnDelete) {
              this.$$.smartPtr = void 0;
              this.$$.ptr = void 0;
            }
          }, isDeleted() {
            return !this.$$.ptr;
          }, deleteLater() {
            if (!this.$$.ptr) {
              throwInstanceAlreadyDeleted(this);
            }
            if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
              throwBindingError("Object already scheduled for deletion");
            }
            deletionQueue.push(this);
            if (deletionQueue.length === 1 && delayFunction) {
              delayFunction(flushPendingDeletes);
            }
            this.$$.deleteScheduled = true;
            return this;
          } });
        };
        function ClassHandle() {
        }
        var createNamedFunction = (name, body) => Object.defineProperty(body, "name", { value: name });
        var ensureOverloadTable = (proto, methodName, humanName) => {
          if (void 0 === proto[methodName].overloadTable) {
            var prevFunc = proto[methodName];
            proto[methodName] = function(...args) {
              if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) {
                throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`);
              }
              return proto[methodName].overloadTable[args.length].apply(this, args);
            };
            proto[methodName].overloadTable = [];
            proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
          }
        };
        var exposePublicSymbol = (name, value, numArguments) => {
          if (Module.hasOwnProperty(name)) {
            if (void 0 === numArguments || void 0 !== Module[name].overloadTable && void 0 !== Module[name].overloadTable[numArguments]) {
              throwBindingError(`Cannot register public name '${name}' twice`);
            }
            ensureOverloadTable(Module, name, name);
            if (Module.hasOwnProperty(numArguments)) {
              throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
            }
            Module[name].overloadTable[numArguments] = value;
          } else {
            Module[name] = value;
            if (void 0 !== numArguments) {
              Module[name].numArguments = numArguments;
            }
          }
        };
        var char_0 = 48;
        var char_9 = 57;
        var makeLegalFunctionName = (name) => {
          if (void 0 === name) {
            return "_unknown";
          }
          name = name.replace(/[^a-zA-Z0-9_]/g, "$");
          var f = name.charCodeAt(0);
          if (f >= char_0 && f <= char_9) {
            return `_${name}`;
          }
          return name;
        };
        function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
          this.name = name;
          this.constructor = constructor;
          this.instancePrototype = instancePrototype;
          this.rawDestructor = rawDestructor;
          this.baseClass = baseClass;
          this.getActualType = getActualType;
          this.upcast = upcast;
          this.downcast = downcast;
          this.pureVirtualFunctions = [];
        }
        var upcastPointer = (ptr, ptrClass, desiredClass) => {
          while (ptrClass !== desiredClass) {
            if (!ptrClass.upcast) {
              throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
            }
            ptr = ptrClass.upcast(ptr);
            ptrClass = ptrClass.baseClass;
          }
          return ptr;
        };
        function constNoSmartPtrRawPointerToWireType(destructors, handle) {
          if (handle === null) {
            if (this.isReference) {
              throwBindingError(`null is not a valid ${this.name}`);
            }
            return 0;
          }
          if (!handle.$$) {
            throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          }
          if (!handle.$$.ptr) {
            throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          return ptr;
        }
        function genericPointerToWireType(destructors, handle) {
          var ptr;
          if (handle === null) {
            if (this.isReference) {
              throwBindingError(`null is not a valid ${this.name}`);
            }
            if (this.isSmartPointer) {
              ptr = this.rawConstructor();
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
              return ptr;
            } else {
              return 0;
            }
          }
          if (!handle || !handle.$$) {
            throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          }
          if (!handle.$$.ptr) {
            throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          }
          if (!this.isConst && handle.$$.ptrType.isConst) {
            throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          if (this.isSmartPointer) {
            if (void 0 === handle.$$.smartPtr) {
              throwBindingError("Passing raw pointer to smart pointer is illegal");
            }
            switch (this.sharingPolicy) {
              case 0:
                if (handle.$$.smartPtrType === this) {
                  ptr = handle.$$.smartPtr;
                } else {
                  throwBindingError(`Cannot convert argument of type ${handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name} to parameter type ${this.name}`);
                }
                break;
              case 1:
                ptr = handle.$$.smartPtr;
                break;
              case 2:
                if (handle.$$.smartPtrType === this) {
                  ptr = handle.$$.smartPtr;
                } else {
                  var clonedHandle = handle["clone"]();
                  ptr = this.rawShare(ptr, Emval.toHandle(() => clonedHandle["delete"]()));
                  if (destructors !== null) {
                    destructors.push(this.rawDestructor, ptr);
                  }
                }
                break;
              default:
                throwBindingError("Unsupporting sharing policy");
            }
          }
          return ptr;
        }
        function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
          if (handle === null) {
            if (this.isReference) {
              throwBindingError(`null is not a valid ${this.name}`);
            }
            return 0;
          }
          if (!handle.$$) {
            throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
          }
          if (!handle.$$.ptr) {
            throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
          }
          if (handle.$$.ptrType.isConst) {
            throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          return ptr;
        }
        var init_RegisteredPointer = () => {
          Object.assign(RegisteredPointer.prototype, { getPointee(ptr) {
            if (this.rawGetPointee) {
              ptr = this.rawGetPointee(ptr);
            }
            return ptr;
          }, destructor(ptr) {
            this.rawDestructor?.(ptr);
          }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, fromWireType: RegisteredPointer_fromWireType });
        };
        function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
          this.name = name;
          this.registeredClass = registeredClass;
          this.isReference = isReference;
          this.isConst = isConst;
          this.isSmartPointer = isSmartPointer;
          this.pointeeType = pointeeType;
          this.sharingPolicy = sharingPolicy;
          this.rawGetPointee = rawGetPointee;
          this.rawConstructor = rawConstructor;
          this.rawShare = rawShare;
          this.rawDestructor = rawDestructor;
          if (!isSmartPointer && registeredClass.baseClass === void 0) {
            if (isConst) {
              this["toWireType"] = constNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
            } else {
              this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
            }
          } else {
            this["toWireType"] = genericPointerToWireType;
          }
        }
        var replacePublicSymbol = (name, value, numArguments) => {
          if (!Module.hasOwnProperty(name)) {
            throwInternalError("Replacing nonexistent public symbol");
          }
          if (void 0 !== Module[name].overloadTable && void 0 !== numArguments) {
            Module[name].overloadTable[numArguments] = value;
          } else {
            Module[name] = value;
            Module[name].argCount = numArguments;
          }
        };
        var dynCallLegacy = (sig, ptr, args) => {
          sig = sig.replace(/p/g, "i");
          var f = Module["dynCall_" + sig];
          return f(ptr, ...args);
        };
        var wasmTableMirror = [];
        var wasmTable;
        var getWasmTableEntry = (funcPtr) => {
          var func = wasmTableMirror[funcPtr];
          if (!func) {
            if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
            wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
          }
          return func;
        };
        var dynCall = (sig, ptr, args = []) => {
          if (sig.includes("j")) {
            return dynCallLegacy(sig, ptr, args);
          }
          var rtn = getWasmTableEntry(ptr)(...args);
          return rtn;
        };
        var getDynCaller = (sig, ptr) => (...args) => dynCall(sig, ptr, args);
        var embind__requireFunction = (signature, rawFunction) => {
          signature = readLatin1String(signature);
          function makeDynCaller() {
            if (signature.includes("j")) {
              return getDynCaller(signature, rawFunction);
            }
            return getWasmTableEntry(rawFunction);
          }
          var fp = makeDynCaller();
          if (typeof fp != "function") {
            throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
          }
          return fp;
        };
        var extendError = (baseErrorType, errorName) => {
          var errorClass = createNamedFunction(errorName, function(message) {
            this.name = errorName;
            this.message = message;
            var stack = new Error(message).stack;
            if (stack !== void 0) {
              this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
            }
          });
          errorClass.prototype = Object.create(baseErrorType.prototype);
          errorClass.prototype.constructor = errorClass;
          errorClass.prototype.toString = function() {
            if (this.message === void 0) {
              return this.name;
            } else {
              return `${this.name}: ${this.message}`;
            }
          };
          return errorClass;
        };
        var UnboundTypeError;
        var getTypeName = (type) => {
          var ptr = ___getTypeName(type);
          var rv = readLatin1String(ptr);
          _free(ptr);
          return rv;
        };
        var throwUnboundTypeError = (message, types) => {
          var unboundTypes = [];
          var seen = {};
          function visit(type) {
            if (seen[type]) {
              return;
            }
            if (registeredTypes[type]) {
              return;
            }
            if (typeDependencies[type]) {
              typeDependencies[type].forEach(visit);
              return;
            }
            unboundTypes.push(type);
            seen[type] = true;
          }
          types.forEach(visit);
          throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([", "]));
        };
        var __embind_register_class = (rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) => {
          name = readLatin1String(name);
          getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
          upcast &&= embind__requireFunction(upcastSignature, upcast);
          downcast &&= embind__requireFunction(downcastSignature, downcast);
          rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
          var legalFunctionName = makeLegalFunctionName(name);
          exposePublicSymbol(legalFunctionName, function() {
            throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
          });
          whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], (base) => {
            base = base[0];
            var baseClass;
            var basePrototype;
            if (baseClassRawType) {
              baseClass = base.registeredClass;
              basePrototype = baseClass.instancePrototype;
            } else {
              basePrototype = ClassHandle.prototype;
            }
            var constructor = createNamedFunction(name, function(...args) {
              if (Object.getPrototypeOf(this) !== instancePrototype) {
                throw new BindingError("Use 'new' to construct " + name);
              }
              if (void 0 === registeredClass.constructor_body) {
                throw new BindingError(name + " has no accessible constructor");
              }
              var body = registeredClass.constructor_body[args.length];
              if (void 0 === body) {
                throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${args.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`);
              }
              return body.apply(this, args);
            });
            var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
            constructor.prototype = instancePrototype;
            var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
            if (registeredClass.baseClass) {
              registeredClass.baseClass.__derivedClasses ??= [];
              registeredClass.baseClass.__derivedClasses.push(registeredClass);
            }
            var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
            var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
            var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
            registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
            replacePublicSymbol(legalFunctionName, constructor);
            return [referenceConverter, pointerConverter, constPointerConverter];
          });
        };
        var heap32VectorToArray = (count, firstElement) => {
          var array = [];
          for (var i = 0; i < count; i++) {
            array.push(HEAPU32[firstElement + i * 4 >> 2]);
          }
          return array;
        };
        function usesDestructorStack(argTypes) {
          for (var i = 1; i < argTypes.length; ++i) {
            if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) {
              return true;
            }
          }
          return false;
        }
        function newFunc(constructor, argumentList) {
          if (!(constructor instanceof Function)) {
            throw new TypeError(`new_ called with constructor type ${typeof constructor} which is not a function`);
          }
          var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {
          });
          dummy.prototype = constructor.prototype;
          var obj = new dummy();
          var r = constructor.apply(obj, argumentList);
          return r instanceof Object ? r : obj;
        }
        function createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync) {
          var needsDestructorStack = usesDestructorStack(argTypes);
          var argCount = argTypes.length;
          var argsList = "";
          var argsListWired = "";
          for (var i = 0; i < argCount - 2; ++i) {
            argsList += (i !== 0 ? ", " : "") + "arg" + i;
            argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
          }
          var invokerFnBody = `
        return function (${argsList}) {
        if (arguments.length !== ${argCount - 2}) {
          throwBindingError('function ' + humanName + ' called with ' + arguments.length + ' arguments, expected ${argCount - 2}');
        }`;
          if (needsDestructorStack) {
            invokerFnBody += "var destructors = [];\n";
          }
          var dtorStack = needsDestructorStack ? "destructors" : "null";
          var args1 = ["humanName", "throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
          if (isClassMethodFunc) {
            invokerFnBody += "var thisWired = classParam['toWireType'](" + dtorStack + ", this);\n";
          }
          for (var i = 0; i < argCount - 2; ++i) {
            invokerFnBody += "var arg" + i + "Wired = argType" + i + "['toWireType'](" + dtorStack + ", arg" + i + ");\n";
            args1.push("argType" + i);
          }
          if (isClassMethodFunc) {
            argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
          }
          invokerFnBody += (returns || isAsync ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
          if (needsDestructorStack) {
            invokerFnBody += "runDestructors(destructors);\n";
          } else {
            for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
              var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
              if (argTypes[i].destructorFunction !== null) {
                invokerFnBody += `${paramName}_dtor(${paramName});
`;
                args1.push(`${paramName}_dtor`);
              }
            }
          }
          if (returns) {
            invokerFnBody += "var ret = retType['fromWireType'](rv);\nreturn ret;\n";
          } else {
          }
          invokerFnBody += "}\n";
          return [args1, invokerFnBody];
        }
        function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
          var argCount = argTypes.length;
          if (argCount < 2) {
            throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
          }
          var isClassMethodFunc = argTypes[1] !== null && classType !== null;
          var needsDestructorStack = usesDestructorStack(argTypes);
          var returns = argTypes[0].name !== "void";
          var closureArgs = [humanName, throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
          for (var i = 0; i < argCount - 2; ++i) {
            closureArgs.push(argTypes[i + 2]);
          }
          if (!needsDestructorStack) {
            for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
              if (argTypes[i].destructorFunction !== null) {
                closureArgs.push(argTypes[i].destructorFunction);
              }
            }
          }
          let [args, invokerFnBody] = createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync);
          args.push(invokerFnBody);
          var invokerFn = newFunc(Function, args)(...closureArgs);
          return createNamedFunction(humanName, invokerFn);
        }
        var __embind_register_class_constructor = (rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) => {
          var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          invoker = embind__requireFunction(invokerSignature, invoker);
          whenDependentTypesAreResolved([], [rawClassType], (classType) => {
            classType = classType[0];
            var humanName = `constructor ${classType.name}`;
            if (void 0 === classType.registeredClass.constructor_body) {
              classType.registeredClass.constructor_body = [];
            }
            if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) {
              throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
            }
            classType.registeredClass.constructor_body[argCount - 1] = () => {
              throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
            };
            whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
              argTypes.splice(1, 0, null);
              classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
              return [];
            });
            return [];
          });
        };
        var getFunctionName = (signature) => {
          signature = signature.trim();
          const argsIndex = signature.indexOf("(");
          if (argsIndex !== -1) {
            return signature.substr(0, argsIndex);
          } else {
            return signature;
          }
        };
        var __embind_register_class_function = (rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual, isAsync) => {
          var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          methodName = readLatin1String(methodName);
          methodName = getFunctionName(methodName);
          rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
          whenDependentTypesAreResolved([], [rawClassType], (classType) => {
            classType = classType[0];
            var humanName = `${classType.name}.${methodName}`;
            if (methodName.startsWith("@@")) {
              methodName = Symbol[methodName.substring(2)];
            }
            if (isPureVirtual) {
              classType.registeredClass.pureVirtualFunctions.push(methodName);
            }
            function unboundTypesHandler() {
              throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
            }
            var proto = classType.registeredClass.instancePrototype;
            var method = proto[methodName];
            if (void 0 === method || void 0 === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
              unboundTypesHandler.argCount = argCount - 2;
              unboundTypesHandler.className = classType.name;
              proto[methodName] = unboundTypesHandler;
            } else {
              ensureOverloadTable(proto, methodName, humanName);
              proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
            }
            whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
              var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync);
              if (void 0 === proto[methodName].overloadTable) {
                memberFunction.argCount = argCount - 2;
                proto[methodName] = memberFunction;
              } else {
                proto[methodName].overloadTable[argCount - 2] = memberFunction;
              }
              return [];
            });
            return [];
          });
        };
        var __embind_register_constant = (name, type, value) => {
          name = readLatin1String(name);
          whenDependentTypesAreResolved([], [type], (type2) => {
            type2 = type2[0];
            Module[name] = type2["fromWireType"](value);
            return [];
          });
        };
        var emval_freelist = [];
        var emval_handles = [];
        var __emval_decref = (handle) => {
          if (handle > 9 && 0 === --emval_handles[handle + 1]) {
            emval_handles[handle] = void 0;
            emval_freelist.push(handle);
          }
        };
        var count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length;
        var init_emval = () => {
          emval_handles.push(0, 1, void 0, 1, null, 1, true, 1, false, 1);
          Module["count_emval_handles"] = count_emval_handles;
        };
        var Emval = { toValue: (handle) => {
          if (!handle) {
            throwBindingError("Cannot use deleted val. handle = " + handle);
          }
          return emval_handles[handle];
        }, toHandle: (value) => {
          switch (value) {
            case void 0:
              return 2;
            case null:
              return 4;
            case true:
              return 6;
            case false:
              return 8;
            default: {
              const handle = emval_freelist.pop() || emval_handles.length;
              emval_handles[handle] = value;
              emval_handles[handle + 1] = 1;
              return handle;
            }
          }
        } };
        var EmValType = { name: "emscripten::val", fromWireType: (handle) => {
          var rv = Emval.toValue(handle);
          __emval_decref(handle);
          return rv;
        }, toWireType: (destructors, value) => Emval.toHandle(value), argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction: null };
        var __embind_register_emval = (rawType) => registerType(rawType, EmValType);
        var enumReadValueFromPointer = (name, width, signed) => {
          switch (width) {
            case 1:
              return signed ? function(pointer) {
                return this["fromWireType"](HEAP8[pointer]);
              } : function(pointer) {
                return this["fromWireType"](HEAPU8[pointer]);
              };
            case 2:
              return signed ? function(pointer) {
                return this["fromWireType"](HEAP16[pointer >> 1]);
              } : function(pointer) {
                return this["fromWireType"](HEAPU16[pointer >> 1]);
              };
            case 4:
              return signed ? function(pointer) {
                return this["fromWireType"](HEAP32[pointer >> 2]);
              } : function(pointer) {
                return this["fromWireType"](HEAPU32[pointer >> 2]);
              };
            default:
              throw new TypeError(`invalid integer width (${width}): ${name}`);
          }
        };
        var __embind_register_enum = (rawType, name, size, isSigned) => {
          name = readLatin1String(name);
          function ctor() {
          }
          ctor.values = {};
          registerType(rawType, { name, constructor: ctor, fromWireType: function(c) {
            return this.constructor.values[c];
          }, toWireType: (destructors, c) => c.value, argPackAdvance: GenericWireTypeSize, readValueFromPointer: enumReadValueFromPointer(name, size, isSigned), destructorFunction: null });
          exposePublicSymbol(name, ctor);
        };
        var requireRegisteredType = (rawType, humanName) => {
          var impl = registeredTypes[rawType];
          if (void 0 === impl) {
            throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
          }
          return impl;
        };
        var __embind_register_enum_value = (rawEnumType, name, enumValue) => {
          var enumType = requireRegisteredType(rawEnumType, "enum");
          name = readLatin1String(name);
          var Enum = enumType.constructor;
          var Value = Object.create(enumType.constructor.prototype, { value: { value: enumValue }, constructor: { value: createNamedFunction(`${enumType.name}_${name}`, function() {
          }) } });
          Enum.values[enumValue] = Value;
          Enum[name] = Value;
        };
        var embindRepr = (v) => {
          if (v === null) {
            return "null";
          }
          var t = typeof v;
          if (t === "object" || t === "array" || t === "function") {
            return v.toString();
          } else {
            return "" + v;
          }
        };
        var floatReadValueFromPointer = (name, width) => {
          switch (width) {
            case 4:
              return function(pointer) {
                return this["fromWireType"](HEAPF32[pointer >> 2]);
              };
            case 8:
              return function(pointer) {
                return this["fromWireType"](HEAPF64[pointer >> 3]);
              };
            default:
              throw new TypeError(`invalid float width (${width}): ${name}`);
          }
        };
        var __embind_register_float = (rawType, name, size) => {
          name = readLatin1String(name);
          registerType(rawType, { name, fromWireType: (value) => value, toWireType: (destructors, value) => value, argPackAdvance: GenericWireTypeSize, readValueFromPointer: floatReadValueFromPointer(name, size), destructorFunction: null });
        };
        var __embind_register_function = (name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync) => {
          var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          name = readLatin1String(name);
          name = getFunctionName(name);
          rawInvoker = embind__requireFunction(signature, rawInvoker);
          exposePublicSymbol(name, function() {
            throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
          }, argCount - 1);
          whenDependentTypesAreResolved([], argTypes, (argTypes2) => {
            var invokerArgsArray = [argTypes2[0], null].concat(argTypes2.slice(1));
            replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync), argCount - 1);
            return [];
          });
        };
        var integerReadValueFromPointer = (name, width, signed) => {
          switch (width) {
            case 1:
              return signed ? (pointer) => HEAP8[pointer] : (pointer) => HEAPU8[pointer];
            case 2:
              return signed ? (pointer) => HEAP16[pointer >> 1] : (pointer) => HEAPU16[pointer >> 1];
            case 4:
              return signed ? (pointer) => HEAP32[pointer >> 2] : (pointer) => HEAPU32[pointer >> 2];
            default:
              throw new TypeError(`invalid integer width (${width}): ${name}`);
          }
        };
        var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
          name = readLatin1String(name);
          if (maxRange === -1) {
            maxRange = 4294967295;
          }
          var fromWireType = (value) => value;
          if (minRange === 0) {
            var bitshift = 32 - 8 * size;
            fromWireType = (value) => value << bitshift >>> bitshift;
          }
          var isUnsignedType = name.includes("unsigned");
          var checkAssertions = (value, toTypeName) => {
          };
          var toWireType;
          if (isUnsignedType) {
            toWireType = function(destructors, value) {
              checkAssertions(value, this.name);
              return value >>> 0;
            };
          } else {
            toWireType = function(destructors, value) {
              checkAssertions(value, this.name);
              return value;
            };
          }
          registerType(primitiveType, { name, fromWireType, toWireType, argPackAdvance: GenericWireTypeSize, readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0), destructorFunction: null });
        };
        var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
          var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
          var TA = typeMapping[dataTypeIndex];
          function decodeMemoryView(handle) {
            var size = HEAPU32[handle >> 2];
            var data = HEAPU32[handle + 4 >> 2];
            return new TA(HEAP8.buffer, data, size);
          }
          name = readLatin1String(name);
          registerType(rawType, { name, fromWireType: decodeMemoryView, argPackAdvance: GenericWireTypeSize, readValueFromPointer: decodeMemoryView }, { ignoreDuplicateRegistrations: true });
        };
        var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
          if (!(maxBytesToWrite > 0)) return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              heap[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              heap[outIdx++] = 192 | u >> 6;
              heap[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              heap[outIdx++] = 224 | u >> 12;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx) break;
              heap[outIdx++] = 240 | u >> 18;
              heap[outIdx++] = 128 | u >> 12 & 63;
              heap[outIdx++] = 128 | u >> 6 & 63;
              heap[outIdx++] = 128 | u & 63;
            }
          }
          heap[outIdx] = 0;
          return outIdx - startIdx;
        };
        var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        var lengthBytesUTF8 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var c = str.charCodeAt(i);
            if (c <= 127) {
              len++;
            } else if (c <= 2047) {
              len += 2;
            } else if (c >= 55296 && c <= 57343) {
              len += 4;
              ++i;
            } else {
              len += 3;
            }
          }
          return len;
        };
        var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder() : void 0;
        var UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
          if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
            return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
          }
          var str = "";
          while (idx < endPtr) {
            var u0 = heapOrArray[idx++];
            if (!(u0 & 128)) {
              str += String.fromCharCode(u0);
              continue;
            }
            var u1 = heapOrArray[idx++] & 63;
            if ((u0 & 224) == 192) {
              str += String.fromCharCode((u0 & 31) << 6 | u1);
              continue;
            }
            var u2 = heapOrArray[idx++] & 63;
            if ((u0 & 240) == 224) {
              u0 = (u0 & 15) << 12 | u1 << 6 | u2;
            } else {
              u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63;
            }
            if (u0 < 65536) {
              str += String.fromCharCode(u0);
            } else {
              var ch = u0 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            }
          }
          return str;
        };
        var UTF8ToString = (ptr, maxBytesToRead) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        var __embind_register_std_string = (rawType, name) => {
          name = readLatin1String(name);
          var stdStringIsUTF8 = name === "std::string";
          registerType(rawType, { name, fromWireType(value) {
            var length = HEAPU32[value >> 2];
            var payload = value + 4;
            var str;
            if (stdStringIsUTF8) {
              var decodeStartPtr = payload;
              for (var i = 0; i <= length; ++i) {
                var currentBytePtr = payload + i;
                if (i == length || HEAPU8[currentBytePtr] == 0) {
                  var maxRead = currentBytePtr - decodeStartPtr;
                  var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
                  if (str === void 0) {
                    str = stringSegment;
                  } else {
                    str += String.fromCharCode(0);
                    str += stringSegment;
                  }
                  decodeStartPtr = currentBytePtr + 1;
                }
              }
            } else {
              var a = new Array(length);
              for (var i = 0; i < length; ++i) {
                a[i] = String.fromCharCode(HEAPU8[payload + i]);
              }
              str = a.join("");
            }
            _free(value);
            return str;
          }, toWireType(destructors, value) {
            if (value instanceof ArrayBuffer) {
              value = new Uint8Array(value);
            }
            var length;
            var valueIsOfTypeString = typeof value == "string";
            if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
              throwBindingError("Cannot pass non-string to std::string");
            }
            if (stdStringIsUTF8 && valueIsOfTypeString) {
              length = lengthBytesUTF8(value);
            } else {
              length = value.length;
            }
            var base = _malloc(4 + length + 1);
            var ptr = base + 4;
            HEAPU32[base >> 2] = length;
            if (stdStringIsUTF8 && valueIsOfTypeString) {
              stringToUTF8(value, ptr, length + 1);
            } else {
              if (valueIsOfTypeString) {
                for (var i = 0; i < length; ++i) {
                  var charCode = value.charCodeAt(i);
                  if (charCode > 255) {
                    _free(ptr);
                    throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                  }
                  HEAPU8[ptr + i] = charCode;
                }
              } else {
                for (var i = 0; i < length; ++i) {
                  HEAPU8[ptr + i] = value[i];
                }
              }
            }
            if (destructors !== null) {
              destructors.push(_free, base);
            }
            return base;
          }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction(ptr) {
            _free(ptr);
          } });
        };
        var UTF16Decoder = typeof TextDecoder != "undefined" ? new TextDecoder("utf-16le") : void 0;
        var UTF16ToString = (ptr, maxBytesToRead) => {
          var endPtr = ptr;
          var idx = endPtr >> 1;
          var maxIdx = idx + maxBytesToRead / 2;
          while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
          endPtr = idx << 1;
          if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
          var str = "";
          for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
            var codeUnit = HEAP16[ptr + i * 2 >> 1];
            if (codeUnit == 0) break;
            str += String.fromCharCode(codeUnit);
          }
          return str;
        };
        var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
          maxBytesToWrite ??= 2147483647;
          if (maxBytesToWrite < 2) return 0;
          maxBytesToWrite -= 2;
          var startPtr = outPtr;
          var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
          for (var i = 0; i < numCharsToWrite; ++i) {
            var codeUnit = str.charCodeAt(i);
            HEAP16[outPtr >> 1] = codeUnit;
            outPtr += 2;
          }
          HEAP16[outPtr >> 1] = 0;
          return outPtr - startPtr;
        };
        var lengthBytesUTF16 = (str) => str.length * 2;
        var UTF32ToString = (ptr, maxBytesToRead) => {
          var i = 0;
          var str = "";
          while (!(i >= maxBytesToRead / 4)) {
            var utf32 = HEAP32[ptr + i * 4 >> 2];
            if (utf32 == 0) break;
            ++i;
            if (utf32 >= 65536) {
              var ch = utf32 - 65536;
              str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
            } else {
              str += String.fromCharCode(utf32);
            }
          }
          return str;
        };
        var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
          maxBytesToWrite ??= 2147483647;
          if (maxBytesToWrite < 4) return 0;
          var startPtr = outPtr;
          var endPtr = startPtr + maxBytesToWrite - 4;
          for (var i = 0; i < str.length; ++i) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit >= 55296 && codeUnit <= 57343) {
              var trailSurrogate = str.charCodeAt(++i);
              codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
            }
            HEAP32[outPtr >> 2] = codeUnit;
            outPtr += 4;
            if (outPtr + 4 > endPtr) break;
          }
          HEAP32[outPtr >> 2] = 0;
          return outPtr - startPtr;
        };
        var lengthBytesUTF32 = (str) => {
          var len = 0;
          for (var i = 0; i < str.length; ++i) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
            len += 4;
          }
          return len;
        };
        var __embind_register_std_wstring = (rawType, charSize, name) => {
          name = readLatin1String(name);
          var decodeString, encodeString, readCharAt, lengthBytesUTF;
          if (charSize === 2) {
            decodeString = UTF16ToString;
            encodeString = stringToUTF16;
            lengthBytesUTF = lengthBytesUTF16;
            readCharAt = (pointer) => HEAPU16[pointer >> 1];
          } else if (charSize === 4) {
            decodeString = UTF32ToString;
            encodeString = stringToUTF32;
            lengthBytesUTF = lengthBytesUTF32;
            readCharAt = (pointer) => HEAPU32[pointer >> 2];
          }
          registerType(rawType, { name, fromWireType: (value) => {
            var length = HEAPU32[value >> 2];
            var str;
            var decodeStartPtr = value + 4;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i * charSize;
              if (i == length || readCharAt(currentBytePtr) == 0) {
                var maxReadBytes = currentBytePtr - decodeStartPtr;
                var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
                if (str === void 0) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + charSize;
              }
            }
            _free(value);
            return str;
          }, toWireType: (destructors, value) => {
            if (!(typeof value == "string")) {
              throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
            }
            var length = lengthBytesUTF(value);
            var ptr = _malloc(4 + length + charSize);
            HEAPU32[ptr >> 2] = length / charSize;
            encodeString(value, ptr + 4, length + charSize);
            if (destructors !== null) {
              destructors.push(_free, ptr);
            }
            return ptr;
          }, argPackAdvance: GenericWireTypeSize, readValueFromPointer: readPointer, destructorFunction(ptr) {
            _free(ptr);
          } });
        };
        var __embind_register_value_object = (rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) => {
          structRegistrations[rawType] = { name: readLatin1String(name), rawConstructor: embind__requireFunction(constructorSignature, rawConstructor), rawDestructor: embind__requireFunction(destructorSignature, rawDestructor), fields: [] };
        };
        var __embind_register_value_object_field = (structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) => {
          structRegistrations[structType].fields.push({ fieldName: readLatin1String(fieldName), getterReturnType, getter: embind__requireFunction(getterSignature, getter), getterContext, setterArgumentType, setter: embind__requireFunction(setterSignature, setter), setterContext });
        };
        var __embind_register_void = (rawType, name) => {
          name = readLatin1String(name);
          registerType(rawType, { isVoid: true, name, argPackAdvance: 0, fromWireType: () => void 0, toWireType: (destructors, o) => void 0 });
        };
        var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
        var emval_returnValue = (returnType, destructorsRef, handle) => {
          var destructors = [];
          var result = returnType["toWireType"](destructors, handle);
          if (destructors.length) {
            HEAPU32[destructorsRef >> 2] = Emval.toHandle(destructors);
          }
          return result;
        };
        var __emval_as = (handle, returnType, destructorsRef) => {
          handle = Emval.toValue(handle);
          returnType = requireRegisteredType(returnType, "emval::as");
          return emval_returnValue(returnType, destructorsRef, handle);
        };
        var emval_methodCallers = [];
        var __emval_call = (caller, handle, destructorsRef, args) => {
          caller = emval_methodCallers[caller];
          handle = Emval.toValue(handle);
          return caller(null, handle, destructorsRef, args);
        };
        var emval_symbols = {};
        var getStringOrSymbol = (address) => {
          var symbol = emval_symbols[address];
          if (symbol === void 0) {
            return readLatin1String(address);
          }
          return symbol;
        };
        var __emval_call_method = (caller, objHandle, methodName, destructorsRef, args) => {
          caller = emval_methodCallers[caller];
          objHandle = Emval.toValue(objHandle);
          methodName = getStringOrSymbol(methodName);
          return caller(objHandle, objHandle[methodName], destructorsRef, args);
        };
        var emval_get_global = () => {
          if (typeof globalThis == "object") {
            return globalThis;
          }
          return (/* @__PURE__ */ (function() {
            return Function;
          })())("return this")();
        };
        var __emval_get_global = (name) => {
          if (name === 0) {
            return Emval.toHandle(emval_get_global());
          } else {
            name = getStringOrSymbol(name);
            return Emval.toHandle(emval_get_global()[name]);
          }
        };
        var emval_addMethodCaller = (caller) => {
          var id = emval_methodCallers.length;
          emval_methodCallers.push(caller);
          return id;
        };
        var emval_lookupTypes = (argCount, argTypes) => {
          var a = new Array(argCount);
          for (var i = 0; i < argCount; ++i) {
            a[i] = requireRegisteredType(HEAPU32[argTypes + i * 4 >> 2], "parameter " + i);
          }
          return a;
        };
        var reflectConstruct = Reflect.construct;
        var __emval_get_method_caller = (argCount, argTypes, kind) => {
          var types = emval_lookupTypes(argCount, argTypes);
          var retType = types.shift();
          argCount--;
          var functionBody = `return function (obj, func, destructorsRef, args) {
`;
          var offset = 0;
          var argsList = [];
          if (kind === 0) {
            argsList.push("obj");
          }
          var params = ["retType"];
          var args = [retType];
          for (var i = 0; i < argCount; ++i) {
            argsList.push("arg" + i);
            params.push("argType" + i);
            args.push(types[i]);
            functionBody += `  var arg${i} = argType${i}.readValueFromPointer(args${offset ? "+" + offset : ""});
`;
            offset += types[i]["argPackAdvance"];
          }
          var invoker = kind === 1 ? "new func" : "func.call";
          functionBody += `  var rv = ${invoker}(${argsList.join(", ")});
`;
          if (!retType.isVoid) {
            params.push("emval_returnValue");
            args.push(emval_returnValue);
            functionBody += "  return emval_returnValue(retType, destructorsRef, rv);\n";
          }
          functionBody += "};\n";
          params.push(functionBody);
          var invokerFunction = newFunc(Function, params)(...args);
          var functionName = `methodCaller<(${types.map((t) => t.name).join(", ")}) => ${retType.name}>`;
          return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction));
        };
        var __emval_get_module_property = (name) => {
          name = getStringOrSymbol(name);
          return Emval.toHandle(Module[name]);
        };
        var __emval_get_property = (handle, key) => {
          handle = Emval.toValue(handle);
          key = Emval.toValue(key);
          return Emval.toHandle(handle[key]);
        };
        var __emval_incref = (handle) => {
          if (handle > 9) {
            emval_handles[handle + 1] += 1;
          }
        };
        var __emval_new_cstring = (v) => Emval.toHandle(getStringOrSymbol(v));
        var __emval_run_destructors = (handle) => {
          var destructors = Emval.toValue(handle);
          runDestructors(destructors);
          __emval_decref(handle);
        };
        var getHeapMax = () => 2147483648;
        var growMemory = (size) => {
          var b = wasmMemory.buffer;
          var pages = (size - b.byteLength + 65535) / 65536;
          try {
            wasmMemory.grow(pages);
            updateMemoryViews();
            return 1;
          } catch (e) {
          }
        };
        var _emscripten_resize_heap = (requestedSize) => {
          var oldSize = HEAPU8.length;
          requestedSize >>>= 0;
          var maxHeapSize = getHeapMax();
          if (requestedSize > maxHeapSize) {
            return false;
          }
          var alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
          for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
            var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
            overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
            var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
            var replacement = growMemory(newSize);
            if (replacement) {
              return true;
            }
          }
          return false;
        };
        var _fd_close = (fd) => 52;
        var convertI32PairToI53Checked = (lo, hi) => hi + 2097152 >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          var offset = convertI32PairToI53Checked(offset_low, offset_high);
          return 70;
        }
        var printCharBuffers = [null, [], []];
        var printChar = (stream, curr) => {
          var buffer = printCharBuffers[stream];
          if (curr === 0 || curr === 10) {
            (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
            buffer.length = 0;
          } else {
            buffer.push(curr);
          }
        };
        var _fd_write = (fd, iov, iovcnt, pnum) => {
          var num = 0;
          for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAPU32[iov >> 2];
            var len = HEAPU32[iov + 4 >> 2];
            iov += 8;
            for (var j = 0; j < len; j++) {
              printChar(fd, HEAPU8[ptr + j]);
            }
            num += len;
          }
          HEAPU32[pnum >> 2] = num;
          return 0;
        };
        InternalError = Module["InternalError"] = class InternalError extends Error {
          constructor(message) {
            super(message);
            this.name = "InternalError";
          }
        };
        embind_init_charCodes();
        BindingError = Module["BindingError"] = class BindingError extends Error {
          constructor(message) {
            super(message);
            this.name = "BindingError";
          }
        };
        init_ClassHandle();
        init_embind();
        init_RegisteredPointer();
        UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
        init_emval();
        var wasmImports = { K: ___cxa_throw, G: __abort_js, s: __embind_finalize_value_object, C: __embind_register_bigint, I: __embind_register_bool, w: __embind_register_class, v: __embind_register_class_constructor, d: __embind_register_class_function, m: __embind_register_constant, H: __embind_register_emval, o: __embind_register_enum, a: __embind_register_enum_value, A: __embind_register_float, i: __embind_register_function, l: __embind_register_integer, f: __embind_register_memory_view, z: __embind_register_std_string, u: __embind_register_std_wstring, t: __embind_register_value_object, c: __embind_register_value_object_field, J: __embind_register_void, F: __emscripten_memcpy_js, n: __emval_as, q: __emval_call, p: __emval_call_method, b: __emval_decref, x: __emval_get_global, j: __emval_get_method_caller, r: __emval_get_module_property, g: __emval_get_property, k: __emval_incref, h: __emval_new_cstring, e: __emval_run_destructors, D: _emscripten_resize_heap, E: _fd_close, B: _fd_seek, y: _fd_write };
        var wasmExports = createWasm();
        var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports["M"])();
        var ___getTypeName = (a0) => (___getTypeName = wasmExports["N"])(a0);
        var _malloc = (a0) => (_malloc = wasmExports["O"])(a0);
        var _free = (a0) => (_free = wasmExports["Q"])(a0);
        var ___cxa_is_pointer_type = (a0) => (___cxa_is_pointer_type = wasmExports["R"])(a0);
        var dynCall_jiji = Module["dynCall_jiji"] = (a0, a1, a2, a3, a4) => (dynCall_jiji = Module["dynCall_jiji"] = wasmExports["S"])(a0, a1, a2, a3, a4);
        var calledRun;
        dependenciesFulfilled = function runCaller() {
          if (!calledRun) run();
          if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function run() {
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0) {
            return;
          }
          function doRun() {
            if (calledRun) return;
            calledRun = true;
            Module["calledRun"] = true;
            if (ABORT) return;
            initRuntime();
            readyPromiseResolve(Module);
            Module["onRuntimeInitialized"]?.();
            postRun();
          }
          if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
          while (Module["preInit"].length > 0) {
            Module["preInit"].pop()();
          }
        }
        run();
        moduleRtn = readyPromise;
        return moduleRtn;
      });
    })();
    if (typeof exports === "object" && typeof module === "object")
      module.exports = BASIS;
    else if (typeof define === "function" && define["amd"])
      define([], () => BASIS);
  }
});

// node_modules/draco3d/draco_encoder_nodejs.js
var require_draco_encoder_nodejs = __commonJS({
  "node_modules/draco3d/draco_encoder_nodejs.js"(exports2, module2) {
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.arrayIteratorImpl = function(l) {
      var p = 0;
      return function() {
        return p < l.length ? { done: false, value: l[p++] } : { done: true };
      };
    };
    $jscomp.arrayIterator = function(l) {
      return { next: $jscomp.arrayIteratorImpl(l) };
    };
    $jscomp.makeIterator = function(l) {
      var p = "undefined" != typeof Symbol && Symbol.iterator && l[Symbol.iterator];
      return p ? p.call(l) : $jscomp.arrayIterator(l);
    };
    $jscomp.ASSUME_ES5 = false;
    $jscomp.ASSUME_NO_NATIVE_MAP = false;
    $jscomp.ASSUME_NO_NATIVE_SET = false;
    $jscomp.SIMPLE_FROUND_POLYFILL = false;
    $jscomp.ISOLATE_POLYFILLS = false;
    $jscomp.FORCE_POLYFILL_PROMISE = false;
    $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = false;
    $jscomp.getGlobal = function(l) {
      l = ["object" == typeof globalThis && globalThis, l, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
      for (var p = 0; p < l.length; ++p) {
        var m = l[p];
        if (m && m.Math == Math) return m;
      }
      throw Error("Cannot find global object");
    };
    $jscomp.global = $jscomp.getGlobal(exports2);
    $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(l, p, m) {
      if (l == Array.prototype || l == Object.prototype) return l;
      l[p] = m.value;
      return l;
    };
    $jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof /* @__PURE__ */ Symbol("x");
    $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
    $jscomp.polyfills = {};
    $jscomp.propertyToPolyfillSymbol = {};
    $jscomp.POLYFILL_PREFIX = "$jscp$";
    $jscomp.polyfill = function(l, p, m, r) {
      p && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(l, p, m, r) : $jscomp.polyfillUnisolated(l, p, m, r));
    };
    $jscomp.polyfillUnisolated = function(l, p, m, r) {
      m = $jscomp.global;
      l = l.split(".");
      for (r = 0; r < l.length - 1; r++) {
        var k = l[r];
        if (!(k in m)) return;
        m = m[k];
      }
      l = l[l.length - 1];
      r = m[l];
      p = p(r);
      p != r && null != p && $jscomp.defineProperty(m, l, { configurable: true, writable: true, value: p });
    };
    $jscomp.polyfillIsolated = function(l, p, m, r) {
      var k = l.split(".");
      l = 1 === k.length;
      r = k[0];
      r = !l && r in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
      for (var C = 0; C < k.length - 1; C++) {
        var h = k[C];
        if (!(h in r)) return;
        r = r[h];
      }
      k = k[k.length - 1];
      m = $jscomp.IS_SYMBOL_NATIVE && "es6" === m ? r[k] : null;
      p = p(m);
      null != p && (l ? $jscomp.defineProperty($jscomp.polyfills, k, { configurable: true, writable: true, value: p }) : p !== m && (void 0 === $jscomp.propertyToPolyfillSymbol[k] && (m = 1e9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[k] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(k) : $jscomp.POLYFILL_PREFIX + m + "$" + k), $jscomp.defineProperty(r, $jscomp.propertyToPolyfillSymbol[k], { configurable: true, writable: true, value: p })));
    };
    $jscomp.polyfill("Promise", function(l) {
      function p() {
        this.batch_ = null;
      }
      function m(h) {
        return h instanceof k ? h : new k(function(q, w) {
          q(h);
        });
      }
      if (l && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return l;
      p.prototype.asyncExecute = function(h) {
        if (null == this.batch_) {
          this.batch_ = [];
          var q = this;
          this.asyncExecuteFunction(function() {
            q.executeBatch_();
          });
        }
        this.batch_.push(h);
      };
      var r = $jscomp.global.setTimeout;
      p.prototype.asyncExecuteFunction = function(h) {
        r(h, 0);
      };
      p.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length; ) {
          var h = this.batch_;
          this.batch_ = [];
          for (var q = 0; q < h.length; ++q) {
            var w = h[q];
            h[q] = null;
            try {
              w();
            } catch (B) {
              this.asyncThrow_(B);
            }
          }
        }
        this.batch_ = null;
      };
      p.prototype.asyncThrow_ = function(h) {
        this.asyncExecuteFunction(function() {
          throw h;
        });
      };
      var k = function(h) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        this.isRejectionHandled_ = false;
        var q = this.createResolveAndReject_();
        try {
          h(q.resolve, q.reject);
        } catch (w) {
          q.reject(w);
        }
      };
      k.prototype.createResolveAndReject_ = function() {
        function h(B) {
          return function(v) {
            w || (w = true, B.call(q, v));
          };
        }
        var q = this, w = false;
        return { resolve: h(this.resolveTo_), reject: h(this.reject_) };
      };
      k.prototype.resolveTo_ = function(h) {
        if (h === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (h instanceof k) this.settleSameAsPromise_(h);
        else {
          a: switch (typeof h) {
            case "object":
              var q = null != h;
              break a;
            case "function":
              q = true;
              break a;
            default:
              q = false;
          }
          q ? this.resolveToNonPromiseObj_(h) : this.fulfill_(h);
        }
      };
      k.prototype.resolveToNonPromiseObj_ = function(h) {
        var q = void 0;
        try {
          q = h.then;
        } catch (w) {
          this.reject_(w);
          return;
        }
        "function" == typeof q ? this.settleSameAsThenable_(q, h) : this.fulfill_(h);
      };
      k.prototype.reject_ = function(h) {
        this.settle_(2, h);
      };
      k.prototype.fulfill_ = function(h) {
        this.settle_(1, h);
      };
      k.prototype.settle_ = function(h, q) {
        if (0 != this.state_) throw Error("Cannot settle(" + h + ", " + q + "): Promise already settled in state" + this.state_);
        this.state_ = h;
        this.result_ = q;
        2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
        this.executeOnSettledCallbacks_();
      };
      k.prototype.scheduleUnhandledRejectionCheck_ = function() {
        var h = this;
        r(function() {
          if (h.notifyUnhandledRejection_()) {
            var q = $jscomp.global.console;
            "undefined" !== typeof q && q.error(h.result_);
          }
        }, 1);
      };
      k.prototype.notifyUnhandledRejection_ = function() {
        if (this.isRejectionHandled_) return false;
        var h = $jscomp.global.CustomEvent, q = $jscomp.global.Event, w = $jscomp.global.dispatchEvent;
        if ("undefined" === typeof w) return true;
        "function" === typeof h ? h = new h("unhandledrejection", { cancelable: true }) : "function" === typeof q ? h = new q("unhandledrejection", { cancelable: true }) : (h = $jscomp.global.document.createEvent("CustomEvent"), h.initCustomEvent("unhandledrejection", false, true, h));
        h.promise = this;
        h.reason = this.result_;
        return w(h);
      };
      k.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
          for (var h = 0; h < this.onSettledCallbacks_.length; ++h) C.asyncExecute(this.onSettledCallbacks_[h]);
          this.onSettledCallbacks_ = null;
        }
      };
      var C = new p();
      k.prototype.settleSameAsPromise_ = function(h) {
        var q = this.createResolveAndReject_();
        h.callWhenSettled_(q.resolve, q.reject);
      };
      k.prototype.settleSameAsThenable_ = function(h, q) {
        var w = this.createResolveAndReject_();
        try {
          h.call(q, w.resolve, w.reject);
        } catch (B) {
          w.reject(B);
        }
      };
      k.prototype.then = function(h, q) {
        function w(I, J) {
          return "function" == typeof I ? function(Q) {
            try {
              B(I(Q));
            } catch (R) {
              v(R);
            }
          } : J;
        }
        var B, v, D = new k(function(I, J) {
          B = I;
          v = J;
        });
        this.callWhenSettled_(w(h, B), w(q, v));
        return D;
      };
      k.prototype.catch = function(h) {
        return this.then(void 0, h);
      };
      k.prototype.callWhenSettled_ = function(h, q) {
        function w() {
          switch (B.state_) {
            case 1:
              h(B.result_);
              break;
            case 2:
              q(B.result_);
              break;
            default:
              throw Error("Unexpected state: " + B.state_);
          }
        }
        var B = this;
        null == this.onSettledCallbacks_ ? C.asyncExecute(w) : this.onSettledCallbacks_.push(w);
        this.isRejectionHandled_ = true;
      };
      k.resolve = m;
      k.reject = function(h) {
        return new k(function(q, w) {
          w(h);
        });
      };
      k.race = function(h) {
        return new k(function(q, w) {
          for (var B = $jscomp.makeIterator(h), v = B.next(); !v.done; v = B.next()) m(v.value).callWhenSettled_(q, w);
        });
      };
      k.all = function(h) {
        var q = $jscomp.makeIterator(h), w = q.next();
        return w.done ? m([]) : new k(function(B, v) {
          function D(Q) {
            return function(R) {
              I[Q] = R;
              J--;
              0 == J && B(I);
            };
          }
          var I = [], J = 0;
          do
            I.push(void 0), J++, m(w.value).callWhenSettled_(D(I.length - 1), v), w = q.next();
          while (!w.done);
        });
      };
      return k;
    }, "es6", "es3");
    $jscomp.owns = function(l, p) {
      return Object.prototype.hasOwnProperty.call(l, p);
    };
    $jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(l, p) {
      for (var m = 1; m < arguments.length; m++) {
        var r = arguments[m];
        if (r) for (var k in r) $jscomp.owns(r, k) && (l[k] = r[k]);
      }
      return l;
    };
    $jscomp.polyfill("Object.assign", function(l) {
      return l || $jscomp.assign;
    }, "es6", "es3");
    $jscomp.checkStringArgs = function(l, p, m) {
      if (null == l) throw new TypeError("The 'this' value for String.prototype." + m + " must not be null or undefined");
      if (p instanceof RegExp) throw new TypeError("First argument to String.prototype." + m + " must not be a regular expression");
      return l + "";
    };
    $jscomp.polyfill("String.prototype.startsWith", function(l) {
      return l ? l : function(p, m) {
        var r = $jscomp.checkStringArgs(this, p, "startsWith");
        p += "";
        var k = r.length, C = p.length;
        m = Math.max(0, Math.min(m | 0, r.length));
        for (var h = 0; h < C && m < k; ) if (r[m++] != p[h++]) return false;
        return h >= C;
      };
    }, "es6", "es3");
    $jscomp.polyfill("Array.prototype.copyWithin", function(l) {
      function p(m) {
        m = Number(m);
        return Infinity === m || -Infinity === m ? m : m | 0;
      }
      return l ? l : function(m, r, k) {
        var C = this.length;
        m = p(m);
        r = p(r);
        k = void 0 === k ? C : p(k);
        m = 0 > m ? Math.max(C + m, 0) : Math.min(m, C);
        r = 0 > r ? Math.max(C + r, 0) : Math.min(r, C);
        k = 0 > k ? Math.max(C + k, 0) : Math.min(k, C);
        if (m < r) for (; r < k; ) r in this ? this[m++] = this[r++] : (delete this[m++], r++);
        else for (k = Math.min(k, C + r - m), m += k - r; k > r; ) --k in this ? this[--m] = this[k] : delete this[--m];
        return this;
      };
    }, "es6", "es3");
    $jscomp.typedArrayCopyWithin = function(l) {
      return l ? l : Array.prototype.copyWithin;
    };
    $jscomp.polyfill("Int8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint8ClampedArray.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Int16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Int32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Float32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Float64Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    var DracoEncoderModule = (function() {
      var l = "undefined" !== typeof document && document.currentScript ? document.currentScript.src : void 0;
      "undefined" !== typeof __filename && (l = l || __filename);
      return function(p) {
        function m(f) {
          return a.locateFile ? a.locateFile(f, L) : L + f;
        }
        function r() {
          var f = ba.buffer;
          a.HEAP8 = O = new Int8Array(f);
          a.HEAP16 = ea = new Int16Array(f);
          a.HEAP32 = S = new Int32Array(f);
          a.HEAPU8 = fa = new Uint8Array(f);
          a.HEAPU16 = new Uint16Array(f);
          a.HEAPU32 = T = new Uint32Array(f);
          a.HEAPF32 = ha = new Float32Array(f);
          a.HEAPF64 = new Float64Array(f);
        }
        function k(f) {
          if (a.onAbort) a.onAbort(f);
          f = "Aborted(" + f + ")";
          W(f);
          na = true;
          f = new WebAssembly.RuntimeError(f + ". Build with -sASSERTIONS for more info.");
          ca(f);
          throw f;
        }
        function C(f) {
          try {
            if (f == K && X) return new Uint8Array(X);
            if (ia) return ia(f);
            throw "both async and sync fetching of the wasm failed";
          } catch (b) {
            k(b);
          }
        }
        function h() {
          if (!X && (oa || Y)) {
            if ("function" == typeof fetch && !K.startsWith("file://")) return fetch(K, { credentials: "same-origin" }).then(function(f) {
              if (!f.ok) throw "failed to load wasm binary file at '" + K + "'";
              return f.arrayBuffer();
            }).catch(function() {
              return C(K);
            });
            if (ja) return new Promise(function(f, b) {
              ja(K, function(c) {
                f(new Uint8Array(c));
              }, b);
            });
          }
          return Promise.resolve().then(function() {
            return C(K);
          });
        }
        function q(f) {
          for (; 0 < f.length; ) f.shift()(a);
        }
        function w(f) {
          this.excPtr = f;
          this.ptr = f - 24;
          this.set_type = function(b) {
            T[this.ptr + 4 >> 2] = b;
          };
          this.get_type = function() {
            return T[this.ptr + 4 >> 2];
          };
          this.set_destructor = function(b) {
            T[this.ptr + 8 >> 2] = b;
          };
          this.get_destructor = function() {
            return T[this.ptr + 8 >> 2];
          };
          this.set_refcount = function(b) {
            S[this.ptr >> 2] = b;
          };
          this.set_caught = function(b) {
            O[this.ptr + 12 >> 0] = b ? 1 : 0;
          };
          this.get_caught = function() {
            return 0 != O[this.ptr + 12 >> 0];
          };
          this.set_rethrown = function(b) {
            O[this.ptr + 13 >> 0] = b ? 1 : 0;
          };
          this.get_rethrown = function() {
            return 0 != O[this.ptr + 13 >> 0];
          };
          this.init = function(b, c) {
            this.set_adjusted_ptr(0);
            this.set_type(b);
            this.set_destructor(c);
            this.set_refcount(0);
            this.set_caught(false);
            this.set_rethrown(false);
          };
          this.add_ref = function() {
            S[this.ptr >> 2] += 1;
          };
          this.release_ref = function() {
            var b = S[this.ptr >> 2];
            S[this.ptr >> 2] = b - 1;
            return 1 === b;
          };
          this.set_adjusted_ptr = function(b) {
            T[this.ptr + 16 >> 2] = b;
          };
          this.get_adjusted_ptr = function() {
            return T[this.ptr + 16 >> 2];
          };
          this.get_exception_ptr = function() {
            if (pa(this.get_type())) return T[this.excPtr >> 2];
            var b = this.get_adjusted_ptr();
            return 0 !== b ? b : this.excPtr;
          };
        }
        function B() {
          function f() {
            if (!da && (da = true, a.calledRun = true, !na)) {
              qa = true;
              q(ka);
              ra(a);
              if (a.onRuntimeInitialized) a.onRuntimeInitialized();
              if (a.postRun) for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length; ) sa.unshift(a.postRun.shift());
              q(sa);
            }
          }
          if (!(0 < U)) {
            if (a.preRun) for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length; ) ta.unshift(a.preRun.shift());
            q(ta);
            0 < U || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
              setTimeout(function() {
                a.setStatus("");
              }, 1);
              f();
            }, 1)) : f());
          }
        }
        function v() {
        }
        function D(f) {
          return (f || v).__cache__;
        }
        function I(f, b) {
          var c = D(b), d = c[f];
          if (d) return d;
          d = Object.create((b || v).prototype);
          d.ptr = f;
          return c[f] = d;
        }
        function J(f) {
          if ("string" === typeof f) {
            for (var b = 0, c = 0; c < f.length; ++c) {
              var d = f.charCodeAt(c);
              127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
            }
            b = Array(b + 1);
            c = 0;
            d = b.length;
            if (0 < d) {
              d = c + d - 1;
              for (var e = 0; e < f.length; ++e) {
                var g = f.charCodeAt(e);
                if (55296 <= g && 57343 >= g) {
                  var t = f.charCodeAt(++e);
                  g = 65536 + ((g & 1023) << 10) | t & 1023;
                }
                if (127 >= g) {
                  if (c >= d) break;
                  b[c++] = g;
                } else {
                  if (2047 >= g) {
                    if (c + 1 >= d) break;
                    b[c++] = 192 | g >> 6;
                  } else {
                    if (65535 >= g) {
                      if (c + 2 >= d) break;
                      b[c++] = 224 | g >> 12;
                    } else {
                      if (c + 3 >= d) break;
                      b[c++] = 240 | g >> 18;
                      b[c++] = 128 | g >> 12 & 63;
                    }
                    b[c++] = 128 | g >> 6 & 63;
                  }
                  b[c++] = 128 | g & 63;
                }
              }
              b[c] = 0;
            }
            f = n.alloc(b, O);
            n.copy(b, O, f);
            return f;
          }
          return f;
        }
        function Q(f) {
          if ("object" === typeof f) {
            var b = n.alloc(f, O);
            n.copy(f, O, b);
            return b;
          }
          return f;
        }
        function R(f) {
          if ("object" === typeof f) {
            var b = n.alloc(f, ea);
            n.copy(f, ea, b);
            return b;
          }
          return f;
        }
        function V(f) {
          if ("object" === typeof f) {
            var b = n.alloc(f, S);
            n.copy(f, S, b);
            return b;
          }
          return f;
        }
        function Z(f) {
          if ("object" === typeof f) {
            var b = n.alloc(f, ha);
            n.copy(f, ha, b);
            return b;
          }
          return f;
        }
        function P() {
          throw "cannot construct a VoidPtr, no constructor in IDL";
        }
        function M() {
          this.ptr = ua();
          D(M)[this.ptr] = this;
        }
        function z() {
          this.ptr = va();
          D(z)[this.ptr] = this;
        }
        function G() {
          this.ptr = wa();
          D(G)[this.ptr] = this;
        }
        function E() {
          this.ptr = xa();
          D(E)[this.ptr] = this;
        }
        function N() {
          this.ptr = ya();
          D(N)[this.ptr] = this;
        }
        function H() {
          this.ptr = za();
          D(H)[this.ptr] = this;
        }
        function F() {
          this.ptr = Aa();
          D(F)[this.ptr] = this;
        }
        function x() {
          this.ptr = Ba();
          D(x)[this.ptr] = this;
        }
        function u() {
          this.ptr = Ca();
          D(u)[this.ptr] = this;
        }
        function y() {
          this.ptr = Da();
          D(y)[this.ptr] = this;
        }
        function A(f) {
          f && "object" === typeof f && (f = f.ptr);
          this.ptr = Ea(f);
          D(A)[this.ptr] = this;
        }
        p = void 0 === p ? {} : p;
        var a = "undefined" != typeof p ? p : {}, ra, ca;
        a.ready = new Promise(function(f, b) {
          ra = f;
          ca = b;
        });
        var Fa = false, Ga = false;
        a.onRuntimeInitialized = function() {
          Fa = true;
          if (Ga && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
        };
        a.onModuleParsed = function() {
          Ga = true;
          if (Fa && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
        };
        a.isVersionSupported = function(f) {
          if ("string" !== typeof f) return false;
          f = f.split(".");
          return 2 > f.length || 3 < f.length ? false : 1 == f[0] && 0 <= f[1] && 5 >= f[1] ? true : 0 != f[0] || 10 < f[1] ? false : true;
        };
        var Ha = Object.assign({}, a), oa = "object" == typeof window, Y = "function" == typeof importScripts, Ia = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, L = "";
        if (Ia) {
          var Ja = require("fs"), la = require("path");
          L = Y ? la.dirname(L) + "/" : __dirname + "/";
          var Ka = function(f, b) {
            f = f.startsWith("file://") ? new URL(f) : la.normalize(f);
            return Ja.readFileSync(f, b ? void 0 : "utf8");
          };
          var ia = function(f) {
            f = Ka(f, true);
            f.buffer || (f = new Uint8Array(f));
            return f;
          };
          var ja = function(f, b, c) {
            f = f.startsWith("file://") ? new URL(f) : la.normalize(f);
            Ja.readFile(f, function(d, e) {
              d ? c(d) : b(e.buffer);
            });
          };
          1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
          process.argv.slice(2);
          a.inspect = function() {
            return "[Emscripten Module object]";
          };
        } else if (oa || Y) Y ? L = self.location.href : "undefined" != typeof document && document.currentScript && (L = document.currentScript.src), l && (L = l), L = 0 !== L.indexOf("blob:") ? L.substr(0, L.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", Ka = function(f) {
          var b = new XMLHttpRequest();
          b.open("GET", f, false);
          b.send(null);
          return b.responseText;
        }, Y && (ia = function(f) {
          var b = new XMLHttpRequest();
          b.open("GET", f, false);
          b.responseType = "arraybuffer";
          b.send(null);
          return new Uint8Array(b.response);
        }), ja = function(f, b, c) {
          var d = new XMLHttpRequest();
          d.open("GET", f, true);
          d.responseType = "arraybuffer";
          d.onload = function() {
            200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
          };
          d.onerror = c;
          d.send(null);
        };
        a.print || console.log.bind(console);
        var W = a.printErr || console.warn.bind(console);
        Object.assign(a, Ha);
        Ha = null;
        var X;
        a.wasmBinary && (X = a.wasmBinary);
        "object" != typeof WebAssembly && k("no native wasm support detected");
        var ba, na = false, O, fa, ea, S, T, ha, ta = [], ka = [], sa = [], qa = false, U = 0, ma = null, aa = null;
        var K = "draco_encoder.wasm";
        K.startsWith("data:application/octet-stream;base64,") || (K = m(K));
        var pc = 0, qc = { b: function(f, b, c) {
          new w(f).init(b, c);
          pc++;
          throw f;
        }, a: function() {
          k("");
        }, d: function(f, b, c) {
          fa.copyWithin(f, b, b + c);
        }, c: function(f) {
          var b = fa.length;
          f >>>= 0;
          if (2147483648 < f) return false;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, f + 100663296);
            var e = Math;
            d = Math.max(f, d);
            e = e.min.call(
              e,
              2147483648,
              d + (65536 - d % 65536) % 65536
            );
            a: {
              d = ba.buffer;
              try {
                ba.grow(e - d.byteLength + 65535 >>> 16);
                r();
                var g = 1;
                break a;
              } catch (t) {
              }
              g = void 0;
            }
            if (g) return true;
          }
          return false;
        } };
        (function() {
          function f(e, g) {
            a.asm = e.exports;
            ba = a.asm.e;
            r();
            ka.unshift(a.asm.f);
            U--;
            a.monitorRunDependencies && a.monitorRunDependencies(U);
            0 == U && (null !== ma && (clearInterval(ma), ma = null), aa && (e = aa, aa = null, e()));
          }
          function b(e) {
            f(e.instance);
          }
          function c(e) {
            return h().then(function(g) {
              return WebAssembly.instantiate(g, d);
            }).then(function(g) {
              return g;
            }).then(e, function(g) {
              W("failed to asynchronously prepare wasm: " + g);
              k(g);
            });
          }
          var d = { a: qc };
          U++;
          a.monitorRunDependencies && a.monitorRunDependencies(U);
          if (a.instantiateWasm) try {
            return a.instantiateWasm(d, f);
          } catch (e) {
            W("Module.instantiateWasm callback failed with error: " + e), ca(e);
          }
          (function() {
            return X || "function" != typeof WebAssembly.instantiateStreaming || K.startsWith("data:application/octet-stream;base64,") || K.startsWith("file://") || Ia || "function" != typeof fetch ? c(b) : fetch(K, { credentials: "same-origin" }).then(function(e) {
              return WebAssembly.instantiateStreaming(e, d).then(
                b,
                function(g) {
                  W("wasm streaming compile failed: " + g);
                  W("falling back to ArrayBuffer instantiation");
                  return c(b);
                }
              );
            });
          })().catch(ca);
          return {};
        })();
        var La = a._emscripten_bind_VoidPtr___destroy___0 = function() {
          return (La = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.h).apply(null, arguments);
        }, ua = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
          return (ua = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = a.asm.i).apply(null, arguments);
        }, Ma = a._emscripten_bind_GeometryAttribute___destroy___0 = function() {
          return (Ma = a._emscripten_bind_GeometryAttribute___destroy___0 = a.asm.j).apply(null, arguments);
        }, va = a._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
          return (va = a._emscripten_bind_PointAttribute_PointAttribute_0 = a.asm.k).apply(null, arguments);
        }, Na = a._emscripten_bind_PointAttribute_size_0 = function() {
          return (Na = a._emscripten_bind_PointAttribute_size_0 = a.asm.l).apply(null, arguments);
        }, Oa = a._emscripten_bind_PointAttribute_attribute_type_0 = function() {
          return (Oa = a._emscripten_bind_PointAttribute_attribute_type_0 = a.asm.m).apply(null, arguments);
        }, Pa = a._emscripten_bind_PointAttribute_data_type_0 = function() {
          return (Pa = a._emscripten_bind_PointAttribute_data_type_0 = a.asm.n).apply(null, arguments);
        }, Qa = a._emscripten_bind_PointAttribute_num_components_0 = function() {
          return (Qa = a._emscripten_bind_PointAttribute_num_components_0 = a.asm.o).apply(null, arguments);
        }, Ra = a._emscripten_bind_PointAttribute_normalized_0 = function() {
          return (Ra = a._emscripten_bind_PointAttribute_normalized_0 = a.asm.p).apply(null, arguments);
        }, Sa = a._emscripten_bind_PointAttribute_byte_stride_0 = function() {
          return (Sa = a._emscripten_bind_PointAttribute_byte_stride_0 = a.asm.q).apply(null, arguments);
        }, Ta = a._emscripten_bind_PointAttribute_byte_offset_0 = function() {
          return (Ta = a._emscripten_bind_PointAttribute_byte_offset_0 = a.asm.r).apply(null, arguments);
        }, Ua = a._emscripten_bind_PointAttribute_unique_id_0 = function() {
          return (Ua = a._emscripten_bind_PointAttribute_unique_id_0 = a.asm.s).apply(null, arguments);
        }, Va = a._emscripten_bind_PointAttribute___destroy___0 = function() {
          return (Va = a._emscripten_bind_PointAttribute___destroy___0 = a.asm.t).apply(null, arguments);
        }, wa = a._emscripten_bind_PointCloud_PointCloud_0 = function() {
          return (wa = a._emscripten_bind_PointCloud_PointCloud_0 = a.asm.u).apply(null, arguments);
        }, Wa = a._emscripten_bind_PointCloud_num_attributes_0 = function() {
          return (Wa = a._emscripten_bind_PointCloud_num_attributes_0 = a.asm.v).apply(null, arguments);
        }, Xa = a._emscripten_bind_PointCloud_num_points_0 = function() {
          return (Xa = a._emscripten_bind_PointCloud_num_points_0 = a.asm.w).apply(null, arguments);
        }, Ya = a._emscripten_bind_PointCloud___destroy___0 = function() {
          return (Ya = a._emscripten_bind_PointCloud___destroy___0 = a.asm.x).apply(null, arguments);
        }, xa = a._emscripten_bind_Mesh_Mesh_0 = function() {
          return (xa = a._emscripten_bind_Mesh_Mesh_0 = a.asm.y).apply(null, arguments);
        }, Za = a._emscripten_bind_Mesh_num_faces_0 = function() {
          return (Za = a._emscripten_bind_Mesh_num_faces_0 = a.asm.z).apply(null, arguments);
        }, $a = a._emscripten_bind_Mesh_num_attributes_0 = function() {
          return ($a = a._emscripten_bind_Mesh_num_attributes_0 = a.asm.A).apply(null, arguments);
        }, ab = a._emscripten_bind_Mesh_num_points_0 = function() {
          return (ab = a._emscripten_bind_Mesh_num_points_0 = a.asm.B).apply(null, arguments);
        }, bb = a._emscripten_bind_Mesh_set_num_points_1 = function() {
          return (bb = a._emscripten_bind_Mesh_set_num_points_1 = a.asm.C).apply(null, arguments);
        }, cb = a._emscripten_bind_Mesh___destroy___0 = function() {
          return (cb = a._emscripten_bind_Mesh___destroy___0 = a.asm.D).apply(null, arguments);
        }, ya = a._emscripten_bind_Metadata_Metadata_0 = function() {
          return (ya = a._emscripten_bind_Metadata_Metadata_0 = a.asm.E).apply(null, arguments);
        }, db = a._emscripten_bind_Metadata___destroy___0 = function() {
          return (db = a._emscripten_bind_Metadata___destroy___0 = a.asm.F).apply(null, arguments);
        }, za = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
          return (za = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = a.asm.G).apply(null, arguments);
        }, eb = a._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
          return (eb = a._emscripten_bind_DracoInt8Array_GetValue_1 = a.asm.H).apply(null, arguments);
        }, fb = a._emscripten_bind_DracoInt8Array_size_0 = function() {
          return (fb = a._emscripten_bind_DracoInt8Array_size_0 = a.asm.I).apply(null, arguments);
        }, gb = a._emscripten_bind_DracoInt8Array___destroy___0 = function() {
          return (gb = a._emscripten_bind_DracoInt8Array___destroy___0 = a.asm.J).apply(null, arguments);
        }, Aa = a._emscripten_bind_MetadataBuilder_MetadataBuilder_0 = function() {
          return (Aa = a._emscripten_bind_MetadataBuilder_MetadataBuilder_0 = a.asm.K).apply(null, arguments);
        }, hb = a._emscripten_bind_MetadataBuilder_AddStringEntry_3 = function() {
          return (hb = a._emscripten_bind_MetadataBuilder_AddStringEntry_3 = a.asm.L).apply(null, arguments);
        }, ib = a._emscripten_bind_MetadataBuilder_AddIntEntry_3 = function() {
          return (ib = a._emscripten_bind_MetadataBuilder_AddIntEntry_3 = a.asm.M).apply(null, arguments);
        }, jb = a._emscripten_bind_MetadataBuilder_AddIntEntryArray_4 = function() {
          return (jb = a._emscripten_bind_MetadataBuilder_AddIntEntryArray_4 = a.asm.N).apply(null, arguments);
        }, kb = a._emscripten_bind_MetadataBuilder_AddDoubleEntry_3 = function() {
          return (kb = a._emscripten_bind_MetadataBuilder_AddDoubleEntry_3 = a.asm.O).apply(null, arguments);
        }, lb = a._emscripten_bind_MetadataBuilder___destroy___0 = function() {
          return (lb = a._emscripten_bind_MetadataBuilder___destroy___0 = a.asm.P).apply(null, arguments);
        }, Ba = a._emscripten_bind_PointCloudBuilder_PointCloudBuilder_0 = function() {
          return (Ba = a._emscripten_bind_PointCloudBuilder_PointCloudBuilder_0 = a.asm.Q).apply(null, arguments);
        }, mb = a._emscripten_bind_PointCloudBuilder_AddFloatAttribute_5 = function() {
          return (mb = a._emscripten_bind_PointCloudBuilder_AddFloatAttribute_5 = a.asm.R).apply(null, arguments);
        }, nb = a._emscripten_bind_PointCloudBuilder_AddInt8Attribute_5 = function() {
          return (nb = a._emscripten_bind_PointCloudBuilder_AddInt8Attribute_5 = a.asm.S).apply(null, arguments);
        }, ob = a._emscripten_bind_PointCloudBuilder_AddUInt8Attribute_5 = function() {
          return (ob = a._emscripten_bind_PointCloudBuilder_AddUInt8Attribute_5 = a.asm.T).apply(null, arguments);
        }, pb = a._emscripten_bind_PointCloudBuilder_AddInt16Attribute_5 = function() {
          return (pb = a._emscripten_bind_PointCloudBuilder_AddInt16Attribute_5 = a.asm.U).apply(null, arguments);
        }, qb = a._emscripten_bind_PointCloudBuilder_AddUInt16Attribute_5 = function() {
          return (qb = a._emscripten_bind_PointCloudBuilder_AddUInt16Attribute_5 = a.asm.V).apply(null, arguments);
        }, rb = a._emscripten_bind_PointCloudBuilder_AddInt32Attribute_5 = function() {
          return (rb = a._emscripten_bind_PointCloudBuilder_AddInt32Attribute_5 = a.asm.W).apply(null, arguments);
        }, sb = a._emscripten_bind_PointCloudBuilder_AddUInt32Attribute_5 = function() {
          return (sb = a._emscripten_bind_PointCloudBuilder_AddUInt32Attribute_5 = a.asm.X).apply(null, arguments);
        }, tb = a._emscripten_bind_PointCloudBuilder_AddMetadata_2 = function() {
          return (tb = a._emscripten_bind_PointCloudBuilder_AddMetadata_2 = a.asm.Y).apply(null, arguments);
        }, ub = a._emscripten_bind_PointCloudBuilder_SetMetadataForAttribute_3 = function() {
          return (ub = a._emscripten_bind_PointCloudBuilder_SetMetadataForAttribute_3 = a.asm.Z).apply(null, arguments);
        }, vb = a._emscripten_bind_PointCloudBuilder_SetNormalizedFlagForAttribute_3 = function() {
          return (vb = a._emscripten_bind_PointCloudBuilder_SetNormalizedFlagForAttribute_3 = a.asm._).apply(null, arguments);
        }, wb = a._emscripten_bind_PointCloudBuilder___destroy___0 = function() {
          return (wb = a._emscripten_bind_PointCloudBuilder___destroy___0 = a.asm.$).apply(null, arguments);
        }, Ca = a._emscripten_bind_MeshBuilder_MeshBuilder_0 = function() {
          return (Ca = a._emscripten_bind_MeshBuilder_MeshBuilder_0 = a.asm.aa).apply(null, arguments);
        }, xb = a._emscripten_bind_MeshBuilder_AddFacesToMesh_3 = function() {
          return (xb = a._emscripten_bind_MeshBuilder_AddFacesToMesh_3 = a.asm.ba).apply(null, arguments);
        }, yb = a._emscripten_bind_MeshBuilder_AddFloatAttributeToMesh_5 = function() {
          return (yb = a._emscripten_bind_MeshBuilder_AddFloatAttributeToMesh_5 = a.asm.ca).apply(null, arguments);
        }, zb = a._emscripten_bind_MeshBuilder_AddInt32AttributeToMesh_5 = function() {
          return (zb = a._emscripten_bind_MeshBuilder_AddInt32AttributeToMesh_5 = a.asm.da).apply(null, arguments);
        }, Ab = a._emscripten_bind_MeshBuilder_AddMetadataToMesh_2 = function() {
          return (Ab = a._emscripten_bind_MeshBuilder_AddMetadataToMesh_2 = a.asm.ea).apply(null, arguments);
        }, Bb = a._emscripten_bind_MeshBuilder_AddFloatAttribute_5 = function() {
          return (Bb = a._emscripten_bind_MeshBuilder_AddFloatAttribute_5 = a.asm.fa).apply(
            null,
            arguments
          );
        }, Cb = a._emscripten_bind_MeshBuilder_AddInt8Attribute_5 = function() {
          return (Cb = a._emscripten_bind_MeshBuilder_AddInt8Attribute_5 = a.asm.ga).apply(null, arguments);
        }, Db = a._emscripten_bind_MeshBuilder_AddUInt8Attribute_5 = function() {
          return (Db = a._emscripten_bind_MeshBuilder_AddUInt8Attribute_5 = a.asm.ha).apply(null, arguments);
        }, Eb = a._emscripten_bind_MeshBuilder_AddInt16Attribute_5 = function() {
          return (Eb = a._emscripten_bind_MeshBuilder_AddInt16Attribute_5 = a.asm.ia).apply(null, arguments);
        }, Fb = a._emscripten_bind_MeshBuilder_AddUInt16Attribute_5 = function() {
          return (Fb = a._emscripten_bind_MeshBuilder_AddUInt16Attribute_5 = a.asm.ja).apply(null, arguments);
        }, Gb = a._emscripten_bind_MeshBuilder_AddInt32Attribute_5 = function() {
          return (Gb = a._emscripten_bind_MeshBuilder_AddInt32Attribute_5 = a.asm.ka).apply(null, arguments);
        }, Hb = a._emscripten_bind_MeshBuilder_AddUInt32Attribute_5 = function() {
          return (Hb = a._emscripten_bind_MeshBuilder_AddUInt32Attribute_5 = a.asm.la).apply(null, arguments);
        }, Ib = a._emscripten_bind_MeshBuilder_AddMetadata_2 = function() {
          return (Ib = a._emscripten_bind_MeshBuilder_AddMetadata_2 = a.asm.ma).apply(null, arguments);
        }, Jb = a._emscripten_bind_MeshBuilder_SetMetadataForAttribute_3 = function() {
          return (Jb = a._emscripten_bind_MeshBuilder_SetMetadataForAttribute_3 = a.asm.na).apply(null, arguments);
        }, Kb = a._emscripten_bind_MeshBuilder_SetNormalizedFlagForAttribute_3 = function() {
          return (Kb = a._emscripten_bind_MeshBuilder_SetNormalizedFlagForAttribute_3 = a.asm.oa).apply(null, arguments);
        }, Lb = a._emscripten_bind_MeshBuilder___destroy___0 = function() {
          return (Lb = a._emscripten_bind_MeshBuilder___destroy___0 = a.asm.pa).apply(null, arguments);
        }, Da = a._emscripten_bind_Encoder_Encoder_0 = function() {
          return (Da = a._emscripten_bind_Encoder_Encoder_0 = a.asm.qa).apply(null, arguments);
        }, Mb = a._emscripten_bind_Encoder_SetEncodingMethod_1 = function() {
          return (Mb = a._emscripten_bind_Encoder_SetEncodingMethod_1 = a.asm.ra).apply(null, arguments);
        }, Nb = a._emscripten_bind_Encoder_SetAttributeQuantization_2 = function() {
          return (Nb = a._emscripten_bind_Encoder_SetAttributeQuantization_2 = a.asm.sa).apply(null, arguments);
        }, Ob = a._emscripten_bind_Encoder_SetAttributeExplicitQuantization_5 = function() {
          return (Ob = a._emscripten_bind_Encoder_SetAttributeExplicitQuantization_5 = a.asm.ta).apply(null, arguments);
        }, Pb = a._emscripten_bind_Encoder_SetSpeedOptions_2 = function() {
          return (Pb = a._emscripten_bind_Encoder_SetSpeedOptions_2 = a.asm.ua).apply(null, arguments);
        }, Qb = a._emscripten_bind_Encoder_SetTrackEncodedProperties_1 = function() {
          return (Qb = a._emscripten_bind_Encoder_SetTrackEncodedProperties_1 = a.asm.va).apply(null, arguments);
        }, Rb = a._emscripten_bind_Encoder_EncodeMeshToDracoBuffer_2 = function() {
          return (Rb = a._emscripten_bind_Encoder_EncodeMeshToDracoBuffer_2 = a.asm.wa).apply(null, arguments);
        }, Sb = a._emscripten_bind_Encoder_EncodePointCloudToDracoBuffer_3 = function() {
          return (Sb = a._emscripten_bind_Encoder_EncodePointCloudToDracoBuffer_3 = a.asm.xa).apply(null, arguments);
        }, Tb = a._emscripten_bind_Encoder_GetNumberOfEncodedPoints_0 = function() {
          return (Tb = a._emscripten_bind_Encoder_GetNumberOfEncodedPoints_0 = a.asm.ya).apply(null, arguments);
        }, Ub = a._emscripten_bind_Encoder_GetNumberOfEncodedFaces_0 = function() {
          return (Ub = a._emscripten_bind_Encoder_GetNumberOfEncodedFaces_0 = a.asm.za).apply(null, arguments);
        }, Vb = a._emscripten_bind_Encoder___destroy___0 = function() {
          return (Vb = a._emscripten_bind_Encoder___destroy___0 = a.asm.Aa).apply(null, arguments);
        }, Ea = a._emscripten_bind_ExpertEncoder_ExpertEncoder_1 = function() {
          return (Ea = a._emscripten_bind_ExpertEncoder_ExpertEncoder_1 = a.asm.Ba).apply(null, arguments);
        }, Wb = a._emscripten_bind_ExpertEncoder_SetEncodingMethod_1 = function() {
          return (Wb = a._emscripten_bind_ExpertEncoder_SetEncodingMethod_1 = a.asm.Ca).apply(null, arguments);
        }, Xb = a._emscripten_bind_ExpertEncoder_SetAttributeQuantization_2 = function() {
          return (Xb = a._emscripten_bind_ExpertEncoder_SetAttributeQuantization_2 = a.asm.Da).apply(null, arguments);
        }, Yb = a._emscripten_bind_ExpertEncoder_SetAttributeExplicitQuantization_5 = function() {
          return (Yb = a._emscripten_bind_ExpertEncoder_SetAttributeExplicitQuantization_5 = a.asm.Ea).apply(null, arguments);
        }, Zb = a._emscripten_bind_ExpertEncoder_SetSpeedOptions_2 = function() {
          return (Zb = a._emscripten_bind_ExpertEncoder_SetSpeedOptions_2 = a.asm.Fa).apply(null, arguments);
        }, $b = a._emscripten_bind_ExpertEncoder_SetTrackEncodedProperties_1 = function() {
          return ($b = a._emscripten_bind_ExpertEncoder_SetTrackEncodedProperties_1 = a.asm.Ga).apply(null, arguments);
        }, ac = a._emscripten_bind_ExpertEncoder_EncodeToDracoBuffer_2 = function() {
          return (ac = a._emscripten_bind_ExpertEncoder_EncodeToDracoBuffer_2 = a.asm.Ha).apply(null, arguments);
        }, bc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedPoints_0 = function() {
          return (bc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedPoints_0 = a.asm.Ia).apply(null, arguments);
        }, cc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedFaces_0 = function() {
          return (cc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedFaces_0 = a.asm.Ja).apply(null, arguments);
        }, dc = a._emscripten_bind_ExpertEncoder___destroy___0 = function() {
          return (dc = a._emscripten_bind_ExpertEncoder___destroy___0 = a.asm.Ka).apply(null, arguments);
        }, ec = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
          return (ec = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = a.asm.La).apply(
            null,
            arguments
          );
        }, fc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function() {
          return (fc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = a.asm.Ma).apply(null, arguments);
        }, gc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
          return (gc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = a.asm.Na).apply(null, arguments);
        }, hc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
          return (hc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = a.asm.Oa).apply(
            null,
            arguments
          );
        }, ic = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
          return (ic = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = a.asm.Pa).apply(null, arguments);
        }, jc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
          return (jc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = a.asm.Qa).apply(null, arguments);
        }, kc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
          return (kc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = a.asm.Ra).apply(null, arguments);
        }, lc = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
          return (lc = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = a.asm.Sa).apply(null, arguments);
        }, mc = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
          return (mc = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = a.asm.Ta).apply(null, arguments);
        }, nc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_SEQUENTIAL_ENCODING = function() {
          return (nc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_SEQUENTIAL_ENCODING = a.asm.Ua).apply(null, arguments);
        }, oc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_EDGEBREAKER_ENCODING = function() {
          return (oc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_EDGEBREAKER_ENCODING = a.asm.Va).apply(null, arguments);
        };
        a._malloc = function() {
          return (a._malloc = a.asm.Wa).apply(null, arguments);
        };
        a._free = function() {
          return (a._free = a.asm.Xa).apply(null, arguments);
        };
        var pa = function() {
          return (pa = a.asm.Ya).apply(null, arguments);
        };
        a.___start_em_js = 19116;
        a.___stop_em_js = 19214;
        var da;
        aa = function b() {
          da || B();
          da || (aa = b);
        };
        if (a.preInit) for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length; ) a.preInit.pop()();
        B();
        v.prototype = Object.create(v.prototype);
        v.prototype.constructor = v;
        v.prototype.__class__ = v;
        v.__cache__ = {};
        a.WrapperObject = v;
        a.getCache = D;
        a.wrapPointer = I;
        a.castObject = function(b, c) {
          return I(b.ptr, c);
        };
        a.NULL = I(0);
        a.destroy = function(b) {
          if (!b.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
          b.__destroy__();
          delete D(b.__class__)[b.ptr];
        };
        a.compare = function(b, c) {
          return b.ptr === c.ptr;
        };
        a.getPointer = function(b) {
          return b.ptr;
        };
        a.getClass = function(b) {
          return b.__class__;
        };
        var n = { buffer: 0, size: 0, pos: 0, temps: [], needed: 0, prepare: function() {
          if (n.needed) {
            for (var b = 0; b < n.temps.length; b++) a._free(n.temps[b]);
            n.temps.length = 0;
            a._free(n.buffer);
            n.buffer = 0;
            n.size += n.needed;
            n.needed = 0;
          }
          n.buffer || (n.size += 128, n.buffer = a._malloc(n.size), n.buffer || k(void 0));
          n.pos = 0;
        }, alloc: function(b, c) {
          n.buffer || k(void 0);
          b = b.length * c.BYTES_PER_ELEMENT;
          b = b + 7 & -8;
          n.pos + b >= n.size ? (0 < b || k(void 0), n.needed += b, c = a._malloc(b), n.temps.push(c)) : (c = n.buffer + n.pos, n.pos += b);
          return c;
        }, copy: function(b, c, d) {
          d >>>= 0;
          switch (c.BYTES_PER_ELEMENT) {
            case 2:
              d >>>= 1;
              break;
            case 4:
              d >>>= 2;
              break;
            case 8:
              d >>>= 3;
          }
          for (var e = 0; e < b.length; e++) c[d + e] = b[e];
        } };
        P.prototype = Object.create(v.prototype);
        P.prototype.constructor = P;
        P.prototype.__class__ = P;
        P.__cache__ = {};
        a.VoidPtr = P;
        P.prototype.__destroy__ = P.prototype.__destroy__ = function() {
          La(this.ptr);
        };
        M.prototype = Object.create(v.prototype);
        M.prototype.constructor = M;
        M.prototype.__class__ = M;
        M.__cache__ = {};
        a.GeometryAttribute = M;
        M.prototype.__destroy__ = M.prototype.__destroy__ = function() {
          Ma(this.ptr);
        };
        z.prototype = Object.create(v.prototype);
        z.prototype.constructor = z;
        z.prototype.__class__ = z;
        z.__cache__ = {};
        a.PointAttribute = z;
        z.prototype.size = z.prototype.size = function() {
          return Na(this.ptr);
        };
        z.prototype.attribute_type = z.prototype.attribute_type = function() {
          return Oa(this.ptr);
        };
        z.prototype.data_type = z.prototype.data_type = function() {
          return Pa(this.ptr);
        };
        z.prototype.num_components = z.prototype.num_components = function() {
          return Qa(this.ptr);
        };
        z.prototype.normalized = z.prototype.normalized = function() {
          return !!Ra(this.ptr);
        };
        z.prototype.byte_stride = z.prototype.byte_stride = function() {
          return Sa(this.ptr);
        };
        z.prototype.byte_offset = z.prototype.byte_offset = function() {
          return Ta(this.ptr);
        };
        z.prototype.unique_id = z.prototype.unique_id = function() {
          return Ua(this.ptr);
        };
        z.prototype.__destroy__ = z.prototype.__destroy__ = function() {
          Va(this.ptr);
        };
        G.prototype = Object.create(v.prototype);
        G.prototype.constructor = G;
        G.prototype.__class__ = G;
        G.__cache__ = {};
        a.PointCloud = G;
        G.prototype.num_attributes = G.prototype.num_attributes = function() {
          return Wa(this.ptr);
        };
        G.prototype.num_points = G.prototype.num_points = function() {
          return Xa(this.ptr);
        };
        G.prototype.__destroy__ = G.prototype.__destroy__ = function() {
          Ya(this.ptr);
        };
        E.prototype = Object.create(v.prototype);
        E.prototype.constructor = E;
        E.prototype.__class__ = E;
        E.__cache__ = {};
        a.Mesh = E;
        E.prototype.num_faces = E.prototype.num_faces = function() {
          return Za(this.ptr);
        };
        E.prototype.num_attributes = E.prototype.num_attributes = function() {
          return $a(this.ptr);
        };
        E.prototype.num_points = E.prototype.num_points = function() {
          return ab(this.ptr);
        };
        E.prototype.set_num_points = E.prototype.set_num_points = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          bb(c, b);
        };
        E.prototype.__destroy__ = E.prototype.__destroy__ = function() {
          cb(this.ptr);
        };
        N.prototype = Object.create(v.prototype);
        N.prototype.constructor = N;
        N.prototype.__class__ = N;
        N.__cache__ = {};
        a.Metadata = N;
        N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
          db(this.ptr);
        };
        H.prototype = Object.create(v.prototype);
        H.prototype.constructor = H;
        H.prototype.__class__ = H;
        H.__cache__ = {};
        a.DracoInt8Array = H;
        H.prototype.GetValue = H.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return eb(c, b);
        };
        H.prototype.size = H.prototype.size = function() {
          return fb(this.ptr);
        };
        H.prototype.__destroy__ = H.prototype.__destroy__ = function() {
          gb(this.ptr);
        };
        F.prototype = Object.create(v.prototype);
        F.prototype.constructor = F;
        F.prototype.__class__ = F;
        F.__cache__ = {};
        a.MetadataBuilder = F;
        F.prototype.AddStringEntry = F.prototype.AddStringEntry = function(b, c, d) {
          var e = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : J(c);
          d = d && "object" === typeof d ? d.ptr : J(d);
          return !!hb(e, b, c, d);
        };
        F.prototype.AddIntEntry = F.prototype.AddIntEntry = function(b, c, d) {
          var e = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : J(c);
          d && "object" === typeof d && (d = d.ptr);
          return !!ib(e, b, c, d);
        };
        F.prototype.AddIntEntryArray = F.prototype.AddIntEntryArray = function(b, c, d, e) {
          var g = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : J(c);
          "object" == typeof d && (d = V(d));
          e && "object" === typeof e && (e = e.ptr);
          return !!jb(g, b, c, d, e);
        };
        F.prototype.AddDoubleEntry = F.prototype.AddDoubleEntry = function(b, c, d) {
          var e = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : J(c);
          d && "object" === typeof d && (d = d.ptr);
          return !!kb(e, b, c, d);
        };
        F.prototype.__destroy__ = F.prototype.__destroy__ = function() {
          lb(this.ptr);
        };
        x.prototype = Object.create(v.prototype);
        x.prototype.constructor = x;
        x.prototype.__class__ = x;
        x.__cache__ = {};
        a.PointCloudBuilder = x;
        x.prototype.AddFloatAttribute = x.prototype.AddFloatAttribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Z(g));
          return mb(t, b, c, d, e, g);
        };
        x.prototype.AddInt8Attribute = x.prototype.AddInt8Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Q(g));
          return nb(t, b, c, d, e, g);
        };
        x.prototype.AddUInt8Attribute = x.prototype.AddUInt8Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Q(g));
          return ob(t, b, c, d, e, g);
        };
        x.prototype.AddInt16Attribute = x.prototype.AddInt16Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = R(g));
          return pb(t, b, c, d, e, g);
        };
        x.prototype.AddUInt16Attribute = x.prototype.AddUInt16Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = R(g));
          return qb(t, b, c, d, e, g);
        };
        x.prototype.AddInt32Attribute = x.prototype.AddInt32Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return rb(t, b, c, d, e, g);
        };
        x.prototype.AddUInt32Attribute = x.prototype.AddUInt32Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return sb(t, b, c, d, e, g);
        };
        x.prototype.AddMetadata = x.prototype.AddMetadata = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return !!tb(d, b, c);
        };
        x.prototype.SetMetadataForAttribute = x.prototype.SetMetadataForAttribute = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!ub(e, b, c, d);
        };
        x.prototype.SetNormalizedFlagForAttribute = x.prototype.SetNormalizedFlagForAttribute = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!vb(e, b, c, d);
        };
        x.prototype.__destroy__ = x.prototype.__destroy__ = function() {
          wb(this.ptr);
        };
        u.prototype = Object.create(v.prototype);
        u.prototype.constructor = u;
        u.prototype.__class__ = u;
        u.__cache__ = {};
        a.MeshBuilder = u;
        u.prototype.AddFacesToMesh = u.prototype.AddFacesToMesh = function(b, c, d) {
          var e = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          "object" == typeof d && (d = V(d));
          return !!xb(e, b, c, d);
        };
        u.prototype.AddFloatAttributeToMesh = u.prototype.AddFloatAttributeToMesh = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Z(g));
          return yb(t, b, c, d, e, g);
        };
        u.prototype.AddInt32AttributeToMesh = u.prototype.AddInt32AttributeToMesh = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return zb(t, b, c, d, e, g);
        };
        u.prototype.AddMetadataToMesh = u.prototype.AddMetadataToMesh = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return !!Ab(d, b, c);
        };
        u.prototype.AddFloatAttribute = u.prototype.AddFloatAttribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Z(g));
          return Bb(t, b, c, d, e, g);
        };
        u.prototype.AddInt8Attribute = u.prototype.AddInt8Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Q(g));
          return Cb(t, b, c, d, e, g);
        };
        u.prototype.AddUInt8Attribute = u.prototype.AddUInt8Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Q(g));
          return Db(t, b, c, d, e, g);
        };
        u.prototype.AddInt16Attribute = u.prototype.AddInt16Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = R(g));
          return Eb(t, b, c, d, e, g);
        };
        u.prototype.AddUInt16Attribute = u.prototype.AddUInt16Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = R(g));
          return Fb(t, b, c, d, e, g);
        };
        u.prototype.AddInt32Attribute = u.prototype.AddInt32Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return Gb(t, b, c, d, e, g);
        };
        u.prototype.AddUInt32Attribute = u.prototype.AddUInt32Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return Hb(t, b, c, d, e, g);
        };
        u.prototype.AddMetadata = u.prototype.AddMetadata = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return !!Ib(d, b, c);
        };
        u.prototype.SetMetadataForAttribute = u.prototype.SetMetadataForAttribute = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Jb(e, b, c, d);
        };
        u.prototype.SetNormalizedFlagForAttribute = u.prototype.SetNormalizedFlagForAttribute = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Kb(e, b, c, d);
        };
        u.prototype.__destroy__ = u.prototype.__destroy__ = function() {
          Lb(this.ptr);
        };
        y.prototype = Object.create(v.prototype);
        y.prototype.constructor = y;
        y.prototype.__class__ = y;
        y.__cache__ = {};
        a.Encoder = y;
        y.prototype.SetEncodingMethod = y.prototype.SetEncodingMethod = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          Mb(c, b);
        };
        y.prototype.SetAttributeQuantization = y.prototype.SetAttributeQuantization = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          Nb(d, b, c);
        };
        y.prototype.SetAttributeExplicitQuantization = y.prototype.SetAttributeExplicitQuantization = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          "object" == typeof e && (e = Z(e));
          g && "object" === typeof g && (g = g.ptr);
          Ob(t, b, c, d, e, g);
        };
        y.prototype.SetSpeedOptions = y.prototype.SetSpeedOptions = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          Pb(d, b, c);
        };
        y.prototype.SetTrackEncodedProperties = y.prototype.SetTrackEncodedProperties = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          Qb(c, b);
        };
        y.prototype.EncodeMeshToDracoBuffer = y.prototype.EncodeMeshToDracoBuffer = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return Rb(d, b, c);
        };
        y.prototype.EncodePointCloudToDracoBuffer = y.prototype.EncodePointCloudToDracoBuffer = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return Sb(e, b, c, d);
        };
        y.prototype.GetNumberOfEncodedPoints = y.prototype.GetNumberOfEncodedPoints = function() {
          return Tb(this.ptr);
        };
        y.prototype.GetNumberOfEncodedFaces = y.prototype.GetNumberOfEncodedFaces = function() {
          return Ub(this.ptr);
        };
        y.prototype.__destroy__ = y.prototype.__destroy__ = function() {
          Vb(this.ptr);
        };
        A.prototype = Object.create(v.prototype);
        A.prototype.constructor = A;
        A.prototype.__class__ = A;
        A.__cache__ = {};
        a.ExpertEncoder = A;
        A.prototype.SetEncodingMethod = A.prototype.SetEncodingMethod = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          Wb(c, b);
        };
        A.prototype.SetAttributeQuantization = A.prototype.SetAttributeQuantization = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          Xb(d, b, c);
        };
        A.prototype.SetAttributeExplicitQuantization = A.prototype.SetAttributeExplicitQuantization = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          "object" == typeof e && (e = Z(e));
          g && "object" === typeof g && (g = g.ptr);
          Yb(t, b, c, d, e, g);
        };
        A.prototype.SetSpeedOptions = A.prototype.SetSpeedOptions = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          Zb(d, b, c);
        };
        A.prototype.SetTrackEncodedProperties = A.prototype.SetTrackEncodedProperties = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          $b(c, b);
        };
        A.prototype.EncodeToDracoBuffer = A.prototype.EncodeToDracoBuffer = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return ac(d, b, c);
        };
        A.prototype.GetNumberOfEncodedPoints = A.prototype.GetNumberOfEncodedPoints = function() {
          return bc(this.ptr);
        };
        A.prototype.GetNumberOfEncodedFaces = A.prototype.GetNumberOfEncodedFaces = function() {
          return cc(this.ptr);
        };
        A.prototype.__destroy__ = A.prototype.__destroy__ = function() {
          dc(this.ptr);
        };
        (function() {
          function b() {
            a.INVALID = ec();
            a.POSITION = fc();
            a.NORMAL = gc();
            a.COLOR = hc();
            a.TEX_COORD = ic();
            a.GENERIC = jc();
            a.INVALID_GEOMETRY_TYPE = kc();
            a.POINT_CLOUD = lc();
            a.TRIANGULAR_MESH = mc();
            a.MESH_SEQUENTIAL_ENCODING = nc();
            a.MESH_EDGEBREAKER_ENCODING = oc();
          }
          qa ? b() : ka.unshift(b);
        })();
        if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
        return p.ready;
      };
    })();
    "object" === typeof exports2 && "object" === typeof module2 ? module2.exports = DracoEncoderModule : "function" === typeof define && define.amd ? define([], function() {
      return DracoEncoderModule;
    }) : "object" === typeof exports2 && (exports2.DracoEncoderModule = DracoEncoderModule);
  }
});

// node_modules/draco3d/draco_decoder_nodejs.js
var require_draco_decoder_nodejs = __commonJS({
  "node_modules/draco3d/draco_decoder_nodejs.js"(exports2, module2) {
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.arrayIteratorImpl = function(k) {
      var n = 0;
      return function() {
        return n < k.length ? { done: false, value: k[n++] } : { done: true };
      };
    };
    $jscomp.arrayIterator = function(k) {
      return { next: $jscomp.arrayIteratorImpl(k) };
    };
    $jscomp.makeIterator = function(k) {
      var n = "undefined" != typeof Symbol && Symbol.iterator && k[Symbol.iterator];
      return n ? n.call(k) : $jscomp.arrayIterator(k);
    };
    $jscomp.ASSUME_ES5 = false;
    $jscomp.ASSUME_NO_NATIVE_MAP = false;
    $jscomp.ASSUME_NO_NATIVE_SET = false;
    $jscomp.SIMPLE_FROUND_POLYFILL = false;
    $jscomp.ISOLATE_POLYFILLS = false;
    $jscomp.FORCE_POLYFILL_PROMISE = false;
    $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = false;
    $jscomp.getGlobal = function(k) {
      k = ["object" == typeof globalThis && globalThis, k, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
      for (var n = 0; n < k.length; ++n) {
        var l = k[n];
        if (l && l.Math == Math) return l;
      }
      throw Error("Cannot find global object");
    };
    $jscomp.global = $jscomp.getGlobal(exports2);
    $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(k, n, l) {
      if (k == Array.prototype || k == Object.prototype) return k;
      k[n] = l.value;
      return k;
    };
    $jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof /* @__PURE__ */ Symbol("x");
    $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
    $jscomp.polyfills = {};
    $jscomp.propertyToPolyfillSymbol = {};
    $jscomp.POLYFILL_PREFIX = "$jscp$";
    $jscomp.polyfill = function(k, n, l, p) {
      n && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(k, n, l, p) : $jscomp.polyfillUnisolated(k, n, l, p));
    };
    $jscomp.polyfillUnisolated = function(k, n, l, p) {
      l = $jscomp.global;
      k = k.split(".");
      for (p = 0; p < k.length - 1; p++) {
        var h = k[p];
        if (!(h in l)) return;
        l = l[h];
      }
      k = k[k.length - 1];
      p = l[k];
      n = n(p);
      n != p && null != n && $jscomp.defineProperty(l, k, { configurable: true, writable: true, value: n });
    };
    $jscomp.polyfillIsolated = function(k, n, l, p) {
      var h = k.split(".");
      k = 1 === h.length;
      p = h[0];
      p = !k && p in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
      for (var A = 0; A < h.length - 1; A++) {
        var f = h[A];
        if (!(f in p)) return;
        p = p[f];
      }
      h = h[h.length - 1];
      l = $jscomp.IS_SYMBOL_NATIVE && "es6" === l ? p[h] : null;
      n = n(l);
      null != n && (k ? $jscomp.defineProperty($jscomp.polyfills, h, { configurable: true, writable: true, value: n }) : n !== l && (void 0 === $jscomp.propertyToPolyfillSymbol[h] && (l = 1e9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[h] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(h) : $jscomp.POLYFILL_PREFIX + l + "$" + h), $jscomp.defineProperty(p, $jscomp.propertyToPolyfillSymbol[h], { configurable: true, writable: true, value: n })));
    };
    $jscomp.polyfill("Promise", function(k) {
      function n() {
        this.batch_ = null;
      }
      function l(f) {
        return f instanceof h ? f : new h(function(q, v) {
          q(f);
        });
      }
      if (k && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return k;
      n.prototype.asyncExecute = function(f) {
        if (null == this.batch_) {
          this.batch_ = [];
          var q = this;
          this.asyncExecuteFunction(function() {
            q.executeBatch_();
          });
        }
        this.batch_.push(f);
      };
      var p = $jscomp.global.setTimeout;
      n.prototype.asyncExecuteFunction = function(f) {
        p(f, 0);
      };
      n.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length; ) {
          var f = this.batch_;
          this.batch_ = [];
          for (var q = 0; q < f.length; ++q) {
            var v = f[q];
            f[q] = null;
            try {
              v();
            } catch (z) {
              this.asyncThrow_(z);
            }
          }
        }
        this.batch_ = null;
      };
      n.prototype.asyncThrow_ = function(f) {
        this.asyncExecuteFunction(function() {
          throw f;
        });
      };
      var h = function(f) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        this.isRejectionHandled_ = false;
        var q = this.createResolveAndReject_();
        try {
          f(q.resolve, q.reject);
        } catch (v) {
          q.reject(v);
        }
      };
      h.prototype.createResolveAndReject_ = function() {
        function f(z) {
          return function(O) {
            v || (v = true, z.call(q, O));
          };
        }
        var q = this, v = false;
        return { resolve: f(this.resolveTo_), reject: f(this.reject_) };
      };
      h.prototype.resolveTo_ = function(f) {
        if (f === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (f instanceof h) this.settleSameAsPromise_(f);
        else {
          a: switch (typeof f) {
            case "object":
              var q = null != f;
              break a;
            case "function":
              q = true;
              break a;
            default:
              q = false;
          }
          q ? this.resolveToNonPromiseObj_(f) : this.fulfill_(f);
        }
      };
      h.prototype.resolveToNonPromiseObj_ = function(f) {
        var q = void 0;
        try {
          q = f.then;
        } catch (v) {
          this.reject_(v);
          return;
        }
        "function" == typeof q ? this.settleSameAsThenable_(q, f) : this.fulfill_(f);
      };
      h.prototype.reject_ = function(f) {
        this.settle_(2, f);
      };
      h.prototype.fulfill_ = function(f) {
        this.settle_(1, f);
      };
      h.prototype.settle_ = function(f, q) {
        if (0 != this.state_) throw Error("Cannot settle(" + f + ", " + q + "): Promise already settled in state" + this.state_);
        this.state_ = f;
        this.result_ = q;
        2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
        this.executeOnSettledCallbacks_();
      };
      h.prototype.scheduleUnhandledRejectionCheck_ = function() {
        var f = this;
        p(function() {
          if (f.notifyUnhandledRejection_()) {
            var q = $jscomp.global.console;
            "undefined" !== typeof q && q.error(f.result_);
          }
        }, 1);
      };
      h.prototype.notifyUnhandledRejection_ = function() {
        if (this.isRejectionHandled_) return false;
        var f = $jscomp.global.CustomEvent, q = $jscomp.global.Event, v = $jscomp.global.dispatchEvent;
        if ("undefined" === typeof v) return true;
        "function" === typeof f ? f = new f("unhandledrejection", { cancelable: true }) : "function" === typeof q ? f = new q("unhandledrejection", { cancelable: true }) : (f = $jscomp.global.document.createEvent("CustomEvent"), f.initCustomEvent("unhandledrejection", false, true, f));
        f.promise = this;
        f.reason = this.result_;
        return v(f);
      };
      h.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
          for (var f = 0; f < this.onSettledCallbacks_.length; ++f) A.asyncExecute(this.onSettledCallbacks_[f]);
          this.onSettledCallbacks_ = null;
        }
      };
      var A = new n();
      h.prototype.settleSameAsPromise_ = function(f) {
        var q = this.createResolveAndReject_();
        f.callWhenSettled_(q.resolve, q.reject);
      };
      h.prototype.settleSameAsThenable_ = function(f, q) {
        var v = this.createResolveAndReject_();
        try {
          f.call(q, v.resolve, v.reject);
        } catch (z) {
          v.reject(z);
        }
      };
      h.prototype.then = function(f, q) {
        function v(t, x) {
          return "function" == typeof t ? function(D) {
            try {
              z(t(D));
            } catch (R) {
              O(R);
            }
          } : x;
        }
        var z, O, ba = new h(function(t, x) {
          z = t;
          O = x;
        });
        this.callWhenSettled_(v(f, z), v(q, O));
        return ba;
      };
      h.prototype.catch = function(f) {
        return this.then(void 0, f);
      };
      h.prototype.callWhenSettled_ = function(f, q) {
        function v() {
          switch (z.state_) {
            case 1:
              f(z.result_);
              break;
            case 2:
              q(z.result_);
              break;
            default:
              throw Error("Unexpected state: " + z.state_);
          }
        }
        var z = this;
        null == this.onSettledCallbacks_ ? A.asyncExecute(v) : this.onSettledCallbacks_.push(v);
        this.isRejectionHandled_ = true;
      };
      h.resolve = l;
      h.reject = function(f) {
        return new h(function(q, v) {
          v(f);
        });
      };
      h.race = function(f) {
        return new h(function(q, v) {
          for (var z = $jscomp.makeIterator(f), O = z.next(); !O.done; O = z.next()) l(O.value).callWhenSettled_(q, v);
        });
      };
      h.all = function(f) {
        var q = $jscomp.makeIterator(f), v = q.next();
        return v.done ? l([]) : new h(function(z, O) {
          function ba(D) {
            return function(R) {
              t[D] = R;
              x--;
              0 == x && z(t);
            };
          }
          var t = [], x = 0;
          do
            t.push(void 0), x++, l(v.value).callWhenSettled_(ba(t.length - 1), O), v = q.next();
          while (!v.done);
        });
      };
      return h;
    }, "es6", "es3");
    $jscomp.owns = function(k, n) {
      return Object.prototype.hasOwnProperty.call(k, n);
    };
    $jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(k, n) {
      for (var l = 1; l < arguments.length; l++) {
        var p = arguments[l];
        if (p) for (var h in p) $jscomp.owns(p, h) && (k[h] = p[h]);
      }
      return k;
    };
    $jscomp.polyfill("Object.assign", function(k) {
      return k || $jscomp.assign;
    }, "es6", "es3");
    $jscomp.checkStringArgs = function(k, n, l) {
      if (null == k) throw new TypeError("The 'this' value for String.prototype." + l + " must not be null or undefined");
      if (n instanceof RegExp) throw new TypeError("First argument to String.prototype." + l + " must not be a regular expression");
      return k + "";
    };
    $jscomp.polyfill("String.prototype.startsWith", function(k) {
      return k ? k : function(n, l) {
        var p = $jscomp.checkStringArgs(this, n, "startsWith");
        n += "";
        var h = p.length, A = n.length;
        l = Math.max(0, Math.min(l | 0, p.length));
        for (var f = 0; f < A && l < h; ) if (p[l++] != n[f++]) return false;
        return f >= A;
      };
    }, "es6", "es3");
    $jscomp.polyfill("Array.prototype.copyWithin", function(k) {
      function n(l) {
        l = Number(l);
        return Infinity === l || -Infinity === l ? l : l | 0;
      }
      return k ? k : function(l, p, h) {
        var A = this.length;
        l = n(l);
        p = n(p);
        h = void 0 === h ? A : n(h);
        l = 0 > l ? Math.max(A + l, 0) : Math.min(l, A);
        p = 0 > p ? Math.max(A + p, 0) : Math.min(p, A);
        h = 0 > h ? Math.max(A + h, 0) : Math.min(h, A);
        if (l < p) for (; p < h; ) p in this ? this[l++] = this[p++] : (delete this[l++], p++);
        else for (h = Math.min(h, A + p - l), l += h - p; h > p; ) --h in this ? this[--l] = this[h] : delete this[--l];
        return this;
      };
    }, "es6", "es3");
    $jscomp.typedArrayCopyWithin = function(k) {
      return k ? k : Array.prototype.copyWithin;
    };
    $jscomp.polyfill("Int8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint8ClampedArray.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Int16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Int32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Float32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Float64Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    var DracoDecoderModule = (function() {
      var k = "undefined" !== typeof document && document.currentScript ? document.currentScript.src : void 0;
      "undefined" !== typeof __filename && (k = k || __filename);
      return function(n) {
        function l(e) {
          return a.locateFile ? a.locateFile(e, U) : U + e;
        }
        function p(e, b, c) {
          var d = b + c;
          for (c = b; e[c] && !(c >= d); ) ++c;
          if (16 < c - b && e.buffer && va) return va.decode(e.subarray(b, c));
          for (d = ""; b < c; ) {
            var g = e[b++];
            if (g & 128) {
              var u = e[b++] & 63;
              if (192 == (g & 224)) d += String.fromCharCode((g & 31) << 6 | u);
              else {
                var X = e[b++] & 63;
                g = 224 == (g & 240) ? (g & 15) << 12 | u << 6 | X : (g & 7) << 18 | u << 12 | X << 6 | e[b++] & 63;
                65536 > g ? d += String.fromCharCode(g) : (g -= 65536, d += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023));
              }
            } else d += String.fromCharCode(g);
          }
          return d;
        }
        function h(e, b) {
          return e ? p(ea, e, b) : "";
        }
        function A() {
          var e = ja.buffer;
          a.HEAP8 = Y = new Int8Array(e);
          a.HEAP16 = new Int16Array(e);
          a.HEAP32 = ca = new Int32Array(e);
          a.HEAPU8 = ea = new Uint8Array(e);
          a.HEAPU16 = new Uint16Array(e);
          a.HEAPU32 = V = new Uint32Array(e);
          a.HEAPF32 = new Float32Array(e);
          a.HEAPF64 = new Float64Array(e);
        }
        function f(e) {
          if (a.onAbort) a.onAbort(e);
          e = "Aborted(" + e + ")";
          da(e);
          wa = true;
          e = new WebAssembly.RuntimeError(e + ". Build with -sASSERTIONS for more info.");
          ka(e);
          throw e;
        }
        function q(e) {
          try {
            if (e == P && fa) return new Uint8Array(fa);
            if (ma) return ma(e);
            throw "both async and sync fetching of the wasm failed";
          } catch (b) {
            f(b);
          }
        }
        function v() {
          if (!fa && (xa || ha)) {
            if ("function" == typeof fetch && !P.startsWith("file://")) return fetch(P, { credentials: "same-origin" }).then(function(e) {
              if (!e.ok) throw "failed to load wasm binary file at '" + P + "'";
              return e.arrayBuffer();
            }).catch(function() {
              return q(P);
            });
            if (na) return new Promise(function(e, b) {
              na(P, function(c) {
                e(new Uint8Array(c));
              }, b);
            });
          }
          return Promise.resolve().then(function() {
            return q(P);
          });
        }
        function z(e) {
          for (; 0 < e.length; ) e.shift()(a);
        }
        function O(e) {
          this.excPtr = e;
          this.ptr = e - 24;
          this.set_type = function(b) {
            V[this.ptr + 4 >> 2] = b;
          };
          this.get_type = function() {
            return V[this.ptr + 4 >> 2];
          };
          this.set_destructor = function(b) {
            V[this.ptr + 8 >> 2] = b;
          };
          this.get_destructor = function() {
            return V[this.ptr + 8 >> 2];
          };
          this.set_refcount = function(b) {
            ca[this.ptr >> 2] = b;
          };
          this.set_caught = function(b) {
            Y[this.ptr + 12 >> 0] = b ? 1 : 0;
          };
          this.get_caught = function() {
            return 0 != Y[this.ptr + 12 >> 0];
          };
          this.set_rethrown = function(b) {
            Y[this.ptr + 13 >> 0] = b ? 1 : 0;
          };
          this.get_rethrown = function() {
            return 0 != Y[this.ptr + 13 >> 0];
          };
          this.init = function(b, c) {
            this.set_adjusted_ptr(0);
            this.set_type(b);
            this.set_destructor(c);
            this.set_refcount(0);
            this.set_caught(false);
            this.set_rethrown(false);
          };
          this.add_ref = function() {
            ca[this.ptr >> 2] += 1;
          };
          this.release_ref = function() {
            var b = ca[this.ptr >> 2];
            ca[this.ptr >> 2] = b - 1;
            return 1 === b;
          };
          this.set_adjusted_ptr = function(b) {
            V[this.ptr + 16 >> 2] = b;
          };
          this.get_adjusted_ptr = function() {
            return V[this.ptr + 16 >> 2];
          };
          this.get_exception_ptr = function() {
            if (ya(this.get_type())) return V[this.excPtr >> 2];
            var b = this.get_adjusted_ptr();
            return 0 !== b ? b : this.excPtr;
          };
        }
        function ba() {
          function e() {
            if (!la && (la = true, a.calledRun = true, !wa)) {
              za = true;
              z(oa);
              Aa(a);
              if (a.onRuntimeInitialized) a.onRuntimeInitialized();
              if (a.postRun) for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length; ) Ba.unshift(a.postRun.shift());
              z(Ba);
            }
          }
          if (!(0 < aa)) {
            if (a.preRun) for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length; ) Ca.unshift(a.preRun.shift());
            z(Ca);
            0 < aa || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
              setTimeout(function() {
                a.setStatus("");
              }, 1);
              e();
            }, 1)) : e());
          }
        }
        function t() {
        }
        function x(e) {
          return (e || t).__cache__;
        }
        function D(e, b) {
          var c = x(b), d = c[e];
          if (d) return d;
          d = Object.create((b || t).prototype);
          d.ptr = e;
          return c[e] = d;
        }
        function R(e) {
          if ("string" === typeof e) {
            for (var b = 0, c = 0; c < e.length; ++c) {
              var d = e.charCodeAt(c);
              127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
            }
            b = Array(b + 1);
            c = 0;
            d = b.length;
            if (0 < d) {
              d = c + d - 1;
              for (var g = 0; g < e.length; ++g) {
                var u = e.charCodeAt(g);
                if (55296 <= u && 57343 >= u) {
                  var X = e.charCodeAt(++g);
                  u = 65536 + ((u & 1023) << 10) | X & 1023;
                }
                if (127 >= u) {
                  if (c >= d) break;
                  b[c++] = u;
                } else {
                  if (2047 >= u) {
                    if (c + 1 >= d) break;
                    b[c++] = 192 | u >> 6;
                  } else {
                    if (65535 >= u) {
                      if (c + 2 >= d) break;
                      b[c++] = 224 | u >> 12;
                    } else {
                      if (c + 3 >= d) break;
                      b[c++] = 240 | u >> 18;
                      b[c++] = 128 | u >> 12 & 63;
                    }
                    b[c++] = 128 | u >> 6 & 63;
                  }
                  b[c++] = 128 | u & 63;
                }
              }
              b[c] = 0;
            }
            e = r.alloc(b, Y);
            r.copy(b, Y, e);
            return e;
          }
          return e;
        }
        function pa(e) {
          if ("object" === typeof e) {
            var b = r.alloc(e, Y);
            r.copy(e, Y, b);
            return b;
          }
          return e;
        }
        function Z() {
          throw "cannot construct a VoidPtr, no constructor in IDL";
        }
        function S() {
          this.ptr = Da();
          x(S)[this.ptr] = this;
        }
        function Q() {
          this.ptr = Ea();
          x(Q)[this.ptr] = this;
        }
        function W() {
          this.ptr = Fa();
          x(W)[this.ptr] = this;
        }
        function w() {
          this.ptr = Ga();
          x(w)[this.ptr] = this;
        }
        function C() {
          this.ptr = Ha();
          x(C)[this.ptr] = this;
        }
        function F() {
          this.ptr = Ia();
          x(F)[this.ptr] = this;
        }
        function G() {
          this.ptr = Ja();
          x(G)[this.ptr] = this;
        }
        function E() {
          this.ptr = Ka();
          x(E)[this.ptr] = this;
        }
        function T() {
          this.ptr = La();
          x(T)[this.ptr] = this;
        }
        function B() {
          throw "cannot construct a Status, no constructor in IDL";
        }
        function H() {
          this.ptr = Ma();
          x(H)[this.ptr] = this;
        }
        function I() {
          this.ptr = Na();
          x(I)[this.ptr] = this;
        }
        function J() {
          this.ptr = Oa();
          x(J)[this.ptr] = this;
        }
        function K() {
          this.ptr = Pa();
          x(K)[this.ptr] = this;
        }
        function L() {
          this.ptr = Qa();
          x(L)[this.ptr] = this;
        }
        function M() {
          this.ptr = Ra();
          x(M)[this.ptr] = this;
        }
        function N() {
          this.ptr = Sa();
          x(N)[this.ptr] = this;
        }
        function y() {
          this.ptr = Ta();
          x(y)[this.ptr] = this;
        }
        function m() {
          this.ptr = Ua();
          x(m)[this.ptr] = this;
        }
        n = void 0 === n ? {} : n;
        var a = "undefined" != typeof n ? n : {}, Aa, ka;
        a.ready = new Promise(function(e, b) {
          Aa = e;
          ka = b;
        });
        var Va = false, Wa = false;
        a.onRuntimeInitialized = function() {
          Va = true;
          if (Wa && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
        };
        a.onModuleParsed = function() {
          Wa = true;
          if (Va && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
        };
        a.isVersionSupported = function(e) {
          if ("string" !== typeof e) return false;
          e = e.split(".");
          return 2 > e.length || 3 < e.length ? false : 1 == e[0] && 0 <= e[1] && 5 >= e[1] ? true : 0 != e[0] || 10 < e[1] ? false : true;
        };
        var Xa = Object.assign({}, a), xa = "object" == typeof window, ha = "function" == typeof importScripts, Ya = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, U = "";
        if (Ya) {
          var Za = require("fs"), qa = require("path");
          U = ha ? qa.dirname(U) + "/" : __dirname + "/";
          var $a = function(e, b) {
            e = e.startsWith("file://") ? new URL(e) : qa.normalize(e);
            return Za.readFileSync(e, b ? void 0 : "utf8");
          };
          var ma = function(e) {
            e = $a(e, true);
            e.buffer || (e = new Uint8Array(e));
            return e;
          };
          var na = function(e, b, c) {
            e = e.startsWith("file://") ? new URL(e) : qa.normalize(e);
            Za.readFile(e, function(d, g) {
              d ? c(d) : b(g.buffer);
            });
          };
          1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
          process.argv.slice(2);
          a.inspect = function() {
            return "[Emscripten Module object]";
          };
        } else if (xa || ha) ha ? U = self.location.href : "undefined" != typeof document && document.currentScript && (U = document.currentScript.src), k && (U = k), U = 0 !== U.indexOf("blob:") ? U.substr(0, U.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", $a = function(e) {
          var b = new XMLHttpRequest();
          b.open("GET", e, false);
          b.send(null);
          return b.responseText;
        }, ha && (ma = function(e) {
          var b = new XMLHttpRequest();
          b.open("GET", e, false);
          b.responseType = "arraybuffer";
          b.send(null);
          return new Uint8Array(b.response);
        }), na = function(e, b, c) {
          var d = new XMLHttpRequest();
          d.open("GET", e, true);
          d.responseType = "arraybuffer";
          d.onload = function() {
            200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
          };
          d.onerror = c;
          d.send(null);
        };
        var ud = a.print || console.log.bind(console), da = a.printErr || console.warn.bind(console);
        Object.assign(a, Xa);
        Xa = null;
        var fa;
        a.wasmBinary && (fa = a.wasmBinary);
        "object" != typeof WebAssembly && f("no native wasm support detected");
        var ja, wa = false, va = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, Y, ea, ca, V, Ca = [], oa = [], Ba = [], za = false, aa = 0, ra = null, ia = null;
        var P = "draco_decoder.wasm";
        P.startsWith("data:application/octet-stream;base64,") || (P = l(P));
        var vd = 0, wd = [null, [], []], xd = { b: function(e, b, c) {
          new O(e).init(b, c);
          vd++;
          throw e;
        }, a: function() {
          f("");
        }, g: function(e, b, c) {
          ea.copyWithin(e, b, b + c);
        }, e: function(e) {
          var b = ea.length;
          e >>>= 0;
          if (2147483648 < e) return false;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, e + 100663296);
            var g = Math;
            d = Math.max(e, d);
            g = g.min.call(g, 2147483648, d + (65536 - d % 65536) % 65536);
            a: {
              d = ja.buffer;
              try {
                ja.grow(g - d.byteLength + 65535 >>> 16);
                A();
                var u = 1;
                break a;
              } catch (X) {
              }
              u = void 0;
            }
            if (u) return true;
          }
          return false;
        }, f: function(e) {
          return 52;
        }, d: function(e, b, c, d, g) {
          return 70;
        }, c: function(e, b, c, d) {
          for (var g = 0, u = 0; u < c; u++) {
            var X = V[b >> 2], ab = V[b + 4 >> 2];
            b += 8;
            for (var sa = 0; sa < ab; sa++) {
              var ta = ea[X + sa], ua = wd[e];
              0 === ta || 10 === ta ? ((1 === e ? ud : da)(p(ua, 0)), ua.length = 0) : ua.push(ta);
            }
            g += ab;
          }
          V[d >> 2] = g;
          return 0;
        } };
        (function() {
          function e(g, u) {
            a.asm = g.exports;
            ja = a.asm.h;
            A();
            oa.unshift(a.asm.i);
            aa--;
            a.monitorRunDependencies && a.monitorRunDependencies(aa);
            0 == aa && (null !== ra && (clearInterval(ra), ra = null), ia && (g = ia, ia = null, g()));
          }
          function b(g) {
            e(g.instance);
          }
          function c(g) {
            return v().then(function(u) {
              return WebAssembly.instantiate(u, d);
            }).then(function(u) {
              return u;
            }).then(g, function(u) {
              da("failed to asynchronously prepare wasm: " + u);
              f(u);
            });
          }
          var d = { a: xd };
          aa++;
          a.monitorRunDependencies && a.monitorRunDependencies(aa);
          if (a.instantiateWasm) try {
            return a.instantiateWasm(d, e);
          } catch (g) {
            da("Module.instantiateWasm callback failed with error: " + g), ka(g);
          }
          (function() {
            return fa || "function" != typeof WebAssembly.instantiateStreaming || P.startsWith("data:application/octet-stream;base64,") || P.startsWith("file://") || Ya || "function" != typeof fetch ? c(b) : fetch(P, { credentials: "same-origin" }).then(function(g) {
              return WebAssembly.instantiateStreaming(g, d).then(b, function(u) {
                da("wasm streaming compile failed: " + u);
                da("falling back to ArrayBuffer instantiation");
                return c(b);
              });
            });
          })().catch(ka);
          return {};
        })();
        var bb = a._emscripten_bind_VoidPtr___destroy___0 = function() {
          return (bb = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.k).apply(null, arguments);
        }, Da = a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = function() {
          return (Da = a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = a.asm.l).apply(null, arguments);
        }, cb = a._emscripten_bind_DecoderBuffer_Init_2 = function() {
          return (cb = a._emscripten_bind_DecoderBuffer_Init_2 = a.asm.m).apply(null, arguments);
        }, db = a._emscripten_bind_DecoderBuffer___destroy___0 = function() {
          return (db = a._emscripten_bind_DecoderBuffer___destroy___0 = a.asm.n).apply(null, arguments);
        }, Ea = a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = function() {
          return (Ea = a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = a.asm.o).apply(null, arguments);
        }, eb = a._emscripten_bind_AttributeTransformData_transform_type_0 = function() {
          return (eb = a._emscripten_bind_AttributeTransformData_transform_type_0 = a.asm.p).apply(null, arguments);
        }, fb = a._emscripten_bind_AttributeTransformData___destroy___0 = function() {
          return (fb = a._emscripten_bind_AttributeTransformData___destroy___0 = a.asm.q).apply(null, arguments);
        }, Fa = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
          return (Fa = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = a.asm.r).apply(null, arguments);
        }, gb = a._emscripten_bind_GeometryAttribute___destroy___0 = function() {
          return (gb = a._emscripten_bind_GeometryAttribute___destroy___0 = a.asm.s).apply(null, arguments);
        }, Ga = a._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
          return (Ga = a._emscripten_bind_PointAttribute_PointAttribute_0 = a.asm.t).apply(null, arguments);
        }, hb = a._emscripten_bind_PointAttribute_size_0 = function() {
          return (hb = a._emscripten_bind_PointAttribute_size_0 = a.asm.u).apply(null, arguments);
        }, ib = a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = function() {
          return (ib = a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = a.asm.v).apply(null, arguments);
        }, jb = a._emscripten_bind_PointAttribute_attribute_type_0 = function() {
          return (jb = a._emscripten_bind_PointAttribute_attribute_type_0 = a.asm.w).apply(null, arguments);
        }, kb = a._emscripten_bind_PointAttribute_data_type_0 = function() {
          return (kb = a._emscripten_bind_PointAttribute_data_type_0 = a.asm.x).apply(null, arguments);
        }, lb = a._emscripten_bind_PointAttribute_num_components_0 = function() {
          return (lb = a._emscripten_bind_PointAttribute_num_components_0 = a.asm.y).apply(null, arguments);
        }, mb = a._emscripten_bind_PointAttribute_normalized_0 = function() {
          return (mb = a._emscripten_bind_PointAttribute_normalized_0 = a.asm.z).apply(null, arguments);
        }, nb = a._emscripten_bind_PointAttribute_byte_stride_0 = function() {
          return (nb = a._emscripten_bind_PointAttribute_byte_stride_0 = a.asm.A).apply(null, arguments);
        }, ob = a._emscripten_bind_PointAttribute_byte_offset_0 = function() {
          return (ob = a._emscripten_bind_PointAttribute_byte_offset_0 = a.asm.B).apply(null, arguments);
        }, pb = a._emscripten_bind_PointAttribute_unique_id_0 = function() {
          return (pb = a._emscripten_bind_PointAttribute_unique_id_0 = a.asm.C).apply(null, arguments);
        }, qb = a._emscripten_bind_PointAttribute___destroy___0 = function() {
          return (qb = a._emscripten_bind_PointAttribute___destroy___0 = a.asm.D).apply(null, arguments);
        }, Ha = a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = function() {
          return (Ha = a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = a.asm.E).apply(null, arguments);
        }, rb = a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = function() {
          return (rb = a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = a.asm.F).apply(null, arguments);
        }, sb = a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = function() {
          return (sb = a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = a.asm.G).apply(null, arguments);
        }, tb = a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = function() {
          return (tb = a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = a.asm.H).apply(null, arguments);
        }, ub = a._emscripten_bind_AttributeQuantizationTransform_range_0 = function() {
          return (ub = a._emscripten_bind_AttributeQuantizationTransform_range_0 = a.asm.I).apply(null, arguments);
        }, vb = a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = function() {
          return (vb = a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = a.asm.J).apply(null, arguments);
        }, Ia = a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = function() {
          return (Ia = a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = a.asm.K).apply(null, arguments);
        }, wb = a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = function() {
          return (wb = a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = a.asm.L).apply(
            null,
            arguments
          );
        }, xb = a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = function() {
          return (xb = a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = a.asm.M).apply(null, arguments);
        }, yb = a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = function() {
          return (yb = a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = a.asm.N).apply(null, arguments);
        }, Ja = a._emscripten_bind_PointCloud_PointCloud_0 = function() {
          return (Ja = a._emscripten_bind_PointCloud_PointCloud_0 = a.asm.O).apply(
            null,
            arguments
          );
        }, zb = a._emscripten_bind_PointCloud_num_attributes_0 = function() {
          return (zb = a._emscripten_bind_PointCloud_num_attributes_0 = a.asm.P).apply(null, arguments);
        }, Ab = a._emscripten_bind_PointCloud_num_points_0 = function() {
          return (Ab = a._emscripten_bind_PointCloud_num_points_0 = a.asm.Q).apply(null, arguments);
        }, Bb = a._emscripten_bind_PointCloud___destroy___0 = function() {
          return (Bb = a._emscripten_bind_PointCloud___destroy___0 = a.asm.R).apply(null, arguments);
        }, Ka = a._emscripten_bind_Mesh_Mesh_0 = function() {
          return (Ka = a._emscripten_bind_Mesh_Mesh_0 = a.asm.S).apply(null, arguments);
        }, Cb = a._emscripten_bind_Mesh_num_faces_0 = function() {
          return (Cb = a._emscripten_bind_Mesh_num_faces_0 = a.asm.T).apply(null, arguments);
        }, Db = a._emscripten_bind_Mesh_num_attributes_0 = function() {
          return (Db = a._emscripten_bind_Mesh_num_attributes_0 = a.asm.U).apply(null, arguments);
        }, Eb = a._emscripten_bind_Mesh_num_points_0 = function() {
          return (Eb = a._emscripten_bind_Mesh_num_points_0 = a.asm.V).apply(null, arguments);
        }, Fb = a._emscripten_bind_Mesh___destroy___0 = function() {
          return (Fb = a._emscripten_bind_Mesh___destroy___0 = a.asm.W).apply(null, arguments);
        }, La = a._emscripten_bind_Metadata_Metadata_0 = function() {
          return (La = a._emscripten_bind_Metadata_Metadata_0 = a.asm.X).apply(null, arguments);
        }, Gb = a._emscripten_bind_Metadata___destroy___0 = function() {
          return (Gb = a._emscripten_bind_Metadata___destroy___0 = a.asm.Y).apply(null, arguments);
        }, Hb = a._emscripten_bind_Status_code_0 = function() {
          return (Hb = a._emscripten_bind_Status_code_0 = a.asm.Z).apply(null, arguments);
        }, Ib = a._emscripten_bind_Status_ok_0 = function() {
          return (Ib = a._emscripten_bind_Status_ok_0 = a.asm._).apply(null, arguments);
        }, Jb = a._emscripten_bind_Status_error_msg_0 = function() {
          return (Jb = a._emscripten_bind_Status_error_msg_0 = a.asm.$).apply(null, arguments);
        }, Kb = a._emscripten_bind_Status___destroy___0 = function() {
          return (Kb = a._emscripten_bind_Status___destroy___0 = a.asm.aa).apply(null, arguments);
        }, Ma = a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = function() {
          return (Ma = a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = a.asm.ba).apply(null, arguments);
        }, Lb = a._emscripten_bind_DracoFloat32Array_GetValue_1 = function() {
          return (Lb = a._emscripten_bind_DracoFloat32Array_GetValue_1 = a.asm.ca).apply(null, arguments);
        }, Mb = a._emscripten_bind_DracoFloat32Array_size_0 = function() {
          return (Mb = a._emscripten_bind_DracoFloat32Array_size_0 = a.asm.da).apply(null, arguments);
        }, Nb = a._emscripten_bind_DracoFloat32Array___destroy___0 = function() {
          return (Nb = a._emscripten_bind_DracoFloat32Array___destroy___0 = a.asm.ea).apply(null, arguments);
        }, Na = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
          return (Na = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = a.asm.fa).apply(null, arguments);
        }, Ob = a._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
          return (Ob = a._emscripten_bind_DracoInt8Array_GetValue_1 = a.asm.ga).apply(null, arguments);
        }, Pb = a._emscripten_bind_DracoInt8Array_size_0 = function() {
          return (Pb = a._emscripten_bind_DracoInt8Array_size_0 = a.asm.ha).apply(null, arguments);
        }, Qb = a._emscripten_bind_DracoInt8Array___destroy___0 = function() {
          return (Qb = a._emscripten_bind_DracoInt8Array___destroy___0 = a.asm.ia).apply(null, arguments);
        }, Oa = a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = function() {
          return (Oa = a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = a.asm.ja).apply(null, arguments);
        }, Rb = a._emscripten_bind_DracoUInt8Array_GetValue_1 = function() {
          return (Rb = a._emscripten_bind_DracoUInt8Array_GetValue_1 = a.asm.ka).apply(null, arguments);
        }, Sb = a._emscripten_bind_DracoUInt8Array_size_0 = function() {
          return (Sb = a._emscripten_bind_DracoUInt8Array_size_0 = a.asm.la).apply(null, arguments);
        }, Tb = a._emscripten_bind_DracoUInt8Array___destroy___0 = function() {
          return (Tb = a._emscripten_bind_DracoUInt8Array___destroy___0 = a.asm.ma).apply(null, arguments);
        }, Pa = a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = function() {
          return (Pa = a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = a.asm.na).apply(null, arguments);
        }, Ub = a._emscripten_bind_DracoInt16Array_GetValue_1 = function() {
          return (Ub = a._emscripten_bind_DracoInt16Array_GetValue_1 = a.asm.oa).apply(null, arguments);
        }, Vb = a._emscripten_bind_DracoInt16Array_size_0 = function() {
          return (Vb = a._emscripten_bind_DracoInt16Array_size_0 = a.asm.pa).apply(null, arguments);
        }, Wb = a._emscripten_bind_DracoInt16Array___destroy___0 = function() {
          return (Wb = a._emscripten_bind_DracoInt16Array___destroy___0 = a.asm.qa).apply(null, arguments);
        }, Qa = a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = function() {
          return (Qa = a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = a.asm.ra).apply(null, arguments);
        }, Xb = a._emscripten_bind_DracoUInt16Array_GetValue_1 = function() {
          return (Xb = a._emscripten_bind_DracoUInt16Array_GetValue_1 = a.asm.sa).apply(null, arguments);
        }, Yb = a._emscripten_bind_DracoUInt16Array_size_0 = function() {
          return (Yb = a._emscripten_bind_DracoUInt16Array_size_0 = a.asm.ta).apply(null, arguments);
        }, Zb = a._emscripten_bind_DracoUInt16Array___destroy___0 = function() {
          return (Zb = a._emscripten_bind_DracoUInt16Array___destroy___0 = a.asm.ua).apply(null, arguments);
        }, Ra = a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = function() {
          return (Ra = a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = a.asm.va).apply(null, arguments);
        }, $b = a._emscripten_bind_DracoInt32Array_GetValue_1 = function() {
          return ($b = a._emscripten_bind_DracoInt32Array_GetValue_1 = a.asm.wa).apply(null, arguments);
        }, ac = a._emscripten_bind_DracoInt32Array_size_0 = function() {
          return (ac = a._emscripten_bind_DracoInt32Array_size_0 = a.asm.xa).apply(null, arguments);
        }, bc = a._emscripten_bind_DracoInt32Array___destroy___0 = function() {
          return (bc = a._emscripten_bind_DracoInt32Array___destroy___0 = a.asm.ya).apply(null, arguments);
        }, Sa = a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = function() {
          return (Sa = a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = a.asm.za).apply(null, arguments);
        }, cc = a._emscripten_bind_DracoUInt32Array_GetValue_1 = function() {
          return (cc = a._emscripten_bind_DracoUInt32Array_GetValue_1 = a.asm.Aa).apply(null, arguments);
        }, dc = a._emscripten_bind_DracoUInt32Array_size_0 = function() {
          return (dc = a._emscripten_bind_DracoUInt32Array_size_0 = a.asm.Ba).apply(null, arguments);
        }, ec = a._emscripten_bind_DracoUInt32Array___destroy___0 = function() {
          return (ec = a._emscripten_bind_DracoUInt32Array___destroy___0 = a.asm.Ca).apply(null, arguments);
        }, Ta = a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = function() {
          return (Ta = a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = a.asm.Da).apply(null, arguments);
        }, fc = a._emscripten_bind_MetadataQuerier_HasEntry_2 = function() {
          return (fc = a._emscripten_bind_MetadataQuerier_HasEntry_2 = a.asm.Ea).apply(null, arguments);
        }, gc = a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = function() {
          return (gc = a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = a.asm.Fa).apply(null, arguments);
        }, hc = a._emscripten_bind_MetadataQuerier_GetIntEntryArray_3 = function() {
          return (hc = a._emscripten_bind_MetadataQuerier_GetIntEntryArray_3 = a.asm.Ga).apply(null, arguments);
        }, ic = a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = function() {
          return (ic = a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = a.asm.Ha).apply(null, arguments);
        }, jc = a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = function() {
          return (jc = a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = a.asm.Ia).apply(null, arguments);
        }, kc = a._emscripten_bind_MetadataQuerier_NumEntries_1 = function() {
          return (kc = a._emscripten_bind_MetadataQuerier_NumEntries_1 = a.asm.Ja).apply(null, arguments);
        }, lc = a._emscripten_bind_MetadataQuerier_GetEntryName_2 = function() {
          return (lc = a._emscripten_bind_MetadataQuerier_GetEntryName_2 = a.asm.Ka).apply(null, arguments);
        }, mc = a._emscripten_bind_MetadataQuerier___destroy___0 = function() {
          return (mc = a._emscripten_bind_MetadataQuerier___destroy___0 = a.asm.La).apply(null, arguments);
        }, Ua = a._emscripten_bind_Decoder_Decoder_0 = function() {
          return (Ua = a._emscripten_bind_Decoder_Decoder_0 = a.asm.Ma).apply(null, arguments);
        }, nc = a._emscripten_bind_Decoder_DecodeArrayToPointCloud_3 = function() {
          return (nc = a._emscripten_bind_Decoder_DecodeArrayToPointCloud_3 = a.asm.Na).apply(null, arguments);
        }, oc = a._emscripten_bind_Decoder_DecodeArrayToMesh_3 = function() {
          return (oc = a._emscripten_bind_Decoder_DecodeArrayToMesh_3 = a.asm.Oa).apply(null, arguments);
        }, pc = a._emscripten_bind_Decoder_GetAttributeId_2 = function() {
          return (pc = a._emscripten_bind_Decoder_GetAttributeId_2 = a.asm.Pa).apply(null, arguments);
        }, qc = a._emscripten_bind_Decoder_GetAttributeIdByName_2 = function() {
          return (qc = a._emscripten_bind_Decoder_GetAttributeIdByName_2 = a.asm.Qa).apply(null, arguments);
        }, rc = a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = function() {
          return (rc = a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = a.asm.Ra).apply(null, arguments);
        }, sc = a._emscripten_bind_Decoder_GetAttribute_2 = function() {
          return (sc = a._emscripten_bind_Decoder_GetAttribute_2 = a.asm.Sa).apply(null, arguments);
        }, tc = a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = function() {
          return (tc = a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = a.asm.Ta).apply(null, arguments);
        }, uc = a._emscripten_bind_Decoder_GetMetadata_1 = function() {
          return (uc = a._emscripten_bind_Decoder_GetMetadata_1 = a.asm.Ua).apply(null, arguments);
        }, vc = a._emscripten_bind_Decoder_GetAttributeMetadata_2 = function() {
          return (vc = a._emscripten_bind_Decoder_GetAttributeMetadata_2 = a.asm.Va).apply(null, arguments);
        }, wc = a._emscripten_bind_Decoder_GetFaceFromMesh_3 = function() {
          return (wc = a._emscripten_bind_Decoder_GetFaceFromMesh_3 = a.asm.Wa).apply(null, arguments);
        }, xc = a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = function() {
          return (xc = a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = a.asm.Xa).apply(null, arguments);
        }, yc = a._emscripten_bind_Decoder_GetTrianglesUInt16Array_3 = function() {
          return (yc = a._emscripten_bind_Decoder_GetTrianglesUInt16Array_3 = a.asm.Ya).apply(null, arguments);
        }, zc = a._emscripten_bind_Decoder_GetTrianglesUInt32Array_3 = function() {
          return (zc = a._emscripten_bind_Decoder_GetTrianglesUInt32Array_3 = a.asm.Za).apply(null, arguments);
        }, Ac = a._emscripten_bind_Decoder_GetAttributeFloat_3 = function() {
          return (Ac = a._emscripten_bind_Decoder_GetAttributeFloat_3 = a.asm._a).apply(null, arguments);
        }, Bc = a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = function() {
          return (Bc = a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = a.asm.$a).apply(null, arguments);
        }, Cc = a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = function() {
          return (Cc = a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = a.asm.ab).apply(null, arguments);
        }, Dc = a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = function() {
          return (Dc = a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = a.asm.bb).apply(null, arguments);
        }, Ec = a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = function() {
          return (Ec = a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = a.asm.cb).apply(null, arguments);
        }, Fc = a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = function() {
          return (Fc = a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = a.asm.db).apply(null, arguments);
        }, Gc = a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = function() {
          return (Gc = a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = a.asm.eb).apply(null, arguments);
        }, Hc = a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = function() {
          return (Hc = a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = a.asm.fb).apply(null, arguments);
        }, Ic = a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = function() {
          return (Ic = a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = a.asm.gb).apply(null, arguments);
        }, Jc = a._emscripten_bind_Decoder_GetAttributeDataArrayForAllPoints_5 = function() {
          return (Jc = a._emscripten_bind_Decoder_GetAttributeDataArrayForAllPoints_5 = a.asm.hb).apply(null, arguments);
        }, Kc = a._emscripten_bind_Decoder_SkipAttributeTransform_1 = function() {
          return (Kc = a._emscripten_bind_Decoder_SkipAttributeTransform_1 = a.asm.ib).apply(null, arguments);
        }, Lc = a._emscripten_bind_Decoder_GetEncodedGeometryType_Deprecated_1 = function() {
          return (Lc = a._emscripten_bind_Decoder_GetEncodedGeometryType_Deprecated_1 = a.asm.jb).apply(null, arguments);
        }, Mc = a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = function() {
          return (Mc = a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = a.asm.kb).apply(null, arguments);
        }, Nc = a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = function() {
          return (Nc = a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = a.asm.lb).apply(null, arguments);
        }, Oc = a._emscripten_bind_Decoder___destroy___0 = function() {
          return (Oc = a._emscripten_bind_Decoder___destroy___0 = a.asm.mb).apply(null, arguments);
        }, Pc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = function() {
          return (Pc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = a.asm.nb).apply(null, arguments);
        }, Qc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = function() {
          return (Qc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = a.asm.ob).apply(null, arguments);
        }, Rc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = function() {
          return (Rc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = a.asm.pb).apply(null, arguments);
        }, Sc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = function() {
          return (Sc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = a.asm.qb).apply(null, arguments);
        }, Tc = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
          return (Tc = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = a.asm.rb).apply(null, arguments);
        }, Uc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function() {
          return (Uc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = a.asm.sb).apply(null, arguments);
        }, Vc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
          return (Vc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = a.asm.tb).apply(null, arguments);
        }, Wc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
          return (Wc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = a.asm.ub).apply(null, arguments);
        }, Xc = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
          return (Xc = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = a.asm.vb).apply(null, arguments);
        }, Yc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
          return (Yc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = a.asm.wb).apply(null, arguments);
        }, Zc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
          return (Zc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = a.asm.xb).apply(null, arguments);
        }, $c = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
          return ($c = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = a.asm.yb).apply(null, arguments);
        }, ad = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
          return (ad = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = a.asm.zb).apply(null, arguments);
        }, bd = a._emscripten_enum_draco_DataType_DT_INVALID = function() {
          return (bd = a._emscripten_enum_draco_DataType_DT_INVALID = a.asm.Ab).apply(null, arguments);
        }, cd = a._emscripten_enum_draco_DataType_DT_INT8 = function() {
          return (cd = a._emscripten_enum_draco_DataType_DT_INT8 = a.asm.Bb).apply(null, arguments);
        }, dd = a._emscripten_enum_draco_DataType_DT_UINT8 = function() {
          return (dd = a._emscripten_enum_draco_DataType_DT_UINT8 = a.asm.Cb).apply(null, arguments);
        }, ed = a._emscripten_enum_draco_DataType_DT_INT16 = function() {
          return (ed = a._emscripten_enum_draco_DataType_DT_INT16 = a.asm.Db).apply(null, arguments);
        }, fd = a._emscripten_enum_draco_DataType_DT_UINT16 = function() {
          return (fd = a._emscripten_enum_draco_DataType_DT_UINT16 = a.asm.Eb).apply(null, arguments);
        }, gd = a._emscripten_enum_draco_DataType_DT_INT32 = function() {
          return (gd = a._emscripten_enum_draco_DataType_DT_INT32 = a.asm.Fb).apply(null, arguments);
        }, hd = a._emscripten_enum_draco_DataType_DT_UINT32 = function() {
          return (hd = a._emscripten_enum_draco_DataType_DT_UINT32 = a.asm.Gb).apply(null, arguments);
        }, id = a._emscripten_enum_draco_DataType_DT_INT64 = function() {
          return (id = a._emscripten_enum_draco_DataType_DT_INT64 = a.asm.Hb).apply(null, arguments);
        }, jd = a._emscripten_enum_draco_DataType_DT_UINT64 = function() {
          return (jd = a._emscripten_enum_draco_DataType_DT_UINT64 = a.asm.Ib).apply(null, arguments);
        }, kd = a._emscripten_enum_draco_DataType_DT_FLOAT32 = function() {
          return (kd = a._emscripten_enum_draco_DataType_DT_FLOAT32 = a.asm.Jb).apply(
            null,
            arguments
          );
        }, ld = a._emscripten_enum_draco_DataType_DT_FLOAT64 = function() {
          return (ld = a._emscripten_enum_draco_DataType_DT_FLOAT64 = a.asm.Kb).apply(null, arguments);
        }, md = a._emscripten_enum_draco_DataType_DT_BOOL = function() {
          return (md = a._emscripten_enum_draco_DataType_DT_BOOL = a.asm.Lb).apply(null, arguments);
        }, nd = a._emscripten_enum_draco_DataType_DT_TYPES_COUNT = function() {
          return (nd = a._emscripten_enum_draco_DataType_DT_TYPES_COUNT = a.asm.Mb).apply(null, arguments);
        }, od = a._emscripten_enum_draco_StatusCode_OK = function() {
          return (od = a._emscripten_enum_draco_StatusCode_OK = a.asm.Nb).apply(null, arguments);
        }, pd = a._emscripten_enum_draco_StatusCode_DRACO_ERROR = function() {
          return (pd = a._emscripten_enum_draco_StatusCode_DRACO_ERROR = a.asm.Ob).apply(null, arguments);
        }, qd = a._emscripten_enum_draco_StatusCode_IO_ERROR = function() {
          return (qd = a._emscripten_enum_draco_StatusCode_IO_ERROR = a.asm.Pb).apply(null, arguments);
        }, rd = a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = function() {
          return (rd = a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = a.asm.Qb).apply(null, arguments);
        }, sd = a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = function() {
          return (sd = a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = a.asm.Rb).apply(null, arguments);
        }, td = a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = function() {
          return (td = a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = a.asm.Sb).apply(null, arguments);
        };
        a._malloc = function() {
          return (a._malloc = a.asm.Tb).apply(null, arguments);
        };
        a._free = function() {
          return (a._free = a.asm.Ub).apply(null, arguments);
        };
        var ya = function() {
          return (ya = a.asm.Vb).apply(null, arguments);
        };
        a.___start_em_js = 15856;
        a.___stop_em_js = 15954;
        var la;
        ia = function b() {
          la || ba();
          la || (ia = b);
        };
        if (a.preInit) for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length; ) a.preInit.pop()();
        ba();
        t.prototype = Object.create(t.prototype);
        t.prototype.constructor = t;
        t.prototype.__class__ = t;
        t.__cache__ = {};
        a.WrapperObject = t;
        a.getCache = x;
        a.wrapPointer = D;
        a.castObject = function(b, c) {
          return D(b.ptr, c);
        };
        a.NULL = D(0);
        a.destroy = function(b) {
          if (!b.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
          b.__destroy__();
          delete x(b.__class__)[b.ptr];
        };
        a.compare = function(b, c) {
          return b.ptr === c.ptr;
        };
        a.getPointer = function(b) {
          return b.ptr;
        };
        a.getClass = function(b) {
          return b.__class__;
        };
        var r = { buffer: 0, size: 0, pos: 0, temps: [], needed: 0, prepare: function() {
          if (r.needed) {
            for (var b = 0; b < r.temps.length; b++) a._free(r.temps[b]);
            r.temps.length = 0;
            a._free(r.buffer);
            r.buffer = 0;
            r.size += r.needed;
            r.needed = 0;
          }
          r.buffer || (r.size += 128, r.buffer = a._malloc(r.size), r.buffer || f(void 0));
          r.pos = 0;
        }, alloc: function(b, c) {
          r.buffer || f(void 0);
          b = b.length * c.BYTES_PER_ELEMENT;
          b = b + 7 & -8;
          r.pos + b >= r.size ? (0 < b || f(void 0), r.needed += b, c = a._malloc(b), r.temps.push(c)) : (c = r.buffer + r.pos, r.pos += b);
          return c;
        }, copy: function(b, c, d) {
          d >>>= 0;
          switch (c.BYTES_PER_ELEMENT) {
            case 2:
              d >>>= 1;
              break;
            case 4:
              d >>>= 2;
              break;
            case 8:
              d >>>= 3;
          }
          for (var g = 0; g < b.length; g++) c[d + g] = b[g];
        } };
        Z.prototype = Object.create(t.prototype);
        Z.prototype.constructor = Z;
        Z.prototype.__class__ = Z;
        Z.__cache__ = {};
        a.VoidPtr = Z;
        Z.prototype.__destroy__ = Z.prototype.__destroy__ = function() {
          bb(this.ptr);
        };
        S.prototype = Object.create(t.prototype);
        S.prototype.constructor = S;
        S.prototype.__class__ = S;
        S.__cache__ = {};
        a.DecoderBuffer = S;
        S.prototype.Init = S.prototype.Init = function(b, c) {
          var d = this.ptr;
          r.prepare();
          "object" == typeof b && (b = pa(b));
          c && "object" === typeof c && (c = c.ptr);
          cb(d, b, c);
        };
        S.prototype.__destroy__ = S.prototype.__destroy__ = function() {
          db(this.ptr);
        };
        Q.prototype = Object.create(t.prototype);
        Q.prototype.constructor = Q;
        Q.prototype.__class__ = Q;
        Q.__cache__ = {};
        a.AttributeTransformData = Q;
        Q.prototype.transform_type = Q.prototype.transform_type = function() {
          return eb(this.ptr);
        };
        Q.prototype.__destroy__ = Q.prototype.__destroy__ = function() {
          fb(this.ptr);
        };
        W.prototype = Object.create(t.prototype);
        W.prototype.constructor = W;
        W.prototype.__class__ = W;
        W.__cache__ = {};
        a.GeometryAttribute = W;
        W.prototype.__destroy__ = W.prototype.__destroy__ = function() {
          gb(this.ptr);
        };
        w.prototype = Object.create(t.prototype);
        w.prototype.constructor = w;
        w.prototype.__class__ = w;
        w.__cache__ = {};
        a.PointAttribute = w;
        w.prototype.size = w.prototype.size = function() {
          return hb(this.ptr);
        };
        w.prototype.GetAttributeTransformData = w.prototype.GetAttributeTransformData = function() {
          return D(ib(this.ptr), Q);
        };
        w.prototype.attribute_type = w.prototype.attribute_type = function() {
          return jb(this.ptr);
        };
        w.prototype.data_type = w.prototype.data_type = function() {
          return kb(this.ptr);
        };
        w.prototype.num_components = w.prototype.num_components = function() {
          return lb(this.ptr);
        };
        w.prototype.normalized = w.prototype.normalized = function() {
          return !!mb(this.ptr);
        };
        w.prototype.byte_stride = w.prototype.byte_stride = function() {
          return nb(this.ptr);
        };
        w.prototype.byte_offset = w.prototype.byte_offset = function() {
          return ob(this.ptr);
        };
        w.prototype.unique_id = w.prototype.unique_id = function() {
          return pb(this.ptr);
        };
        w.prototype.__destroy__ = w.prototype.__destroy__ = function() {
          qb(this.ptr);
        };
        C.prototype = Object.create(t.prototype);
        C.prototype.constructor = C;
        C.prototype.__class__ = C;
        C.__cache__ = {};
        a.AttributeQuantizationTransform = C;
        C.prototype.InitFromAttribute = C.prototype.InitFromAttribute = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return !!rb(c, b);
        };
        C.prototype.quantization_bits = C.prototype.quantization_bits = function() {
          return sb(this.ptr);
        };
        C.prototype.min_value = C.prototype.min_value = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return tb(c, b);
        };
        C.prototype.range = C.prototype.range = function() {
          return ub(this.ptr);
        };
        C.prototype.__destroy__ = C.prototype.__destroy__ = function() {
          vb(this.ptr);
        };
        F.prototype = Object.create(t.prototype);
        F.prototype.constructor = F;
        F.prototype.__class__ = F;
        F.__cache__ = {};
        a.AttributeOctahedronTransform = F;
        F.prototype.InitFromAttribute = F.prototype.InitFromAttribute = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return !!wb(c, b);
        };
        F.prototype.quantization_bits = F.prototype.quantization_bits = function() {
          return xb(this.ptr);
        };
        F.prototype.__destroy__ = F.prototype.__destroy__ = function() {
          yb(this.ptr);
        };
        G.prototype = Object.create(t.prototype);
        G.prototype.constructor = G;
        G.prototype.__class__ = G;
        G.__cache__ = {};
        a.PointCloud = G;
        G.prototype.num_attributes = G.prototype.num_attributes = function() {
          return zb(this.ptr);
        };
        G.prototype.num_points = G.prototype.num_points = function() {
          return Ab(this.ptr);
        };
        G.prototype.__destroy__ = G.prototype.__destroy__ = function() {
          Bb(this.ptr);
        };
        E.prototype = Object.create(t.prototype);
        E.prototype.constructor = E;
        E.prototype.__class__ = E;
        E.__cache__ = {};
        a.Mesh = E;
        E.prototype.num_faces = E.prototype.num_faces = function() {
          return Cb(this.ptr);
        };
        E.prototype.num_attributes = E.prototype.num_attributes = function() {
          return Db(this.ptr);
        };
        E.prototype.num_points = E.prototype.num_points = function() {
          return Eb(this.ptr);
        };
        E.prototype.__destroy__ = E.prototype.__destroy__ = function() {
          Fb(this.ptr);
        };
        T.prototype = Object.create(t.prototype);
        T.prototype.constructor = T;
        T.prototype.__class__ = T;
        T.__cache__ = {};
        a.Metadata = T;
        T.prototype.__destroy__ = T.prototype.__destroy__ = function() {
          Gb(this.ptr);
        };
        B.prototype = Object.create(t.prototype);
        B.prototype.constructor = B;
        B.prototype.__class__ = B;
        B.__cache__ = {};
        a.Status = B;
        B.prototype.code = B.prototype.code = function() {
          return Hb(this.ptr);
        };
        B.prototype.ok = B.prototype.ok = function() {
          return !!Ib(this.ptr);
        };
        B.prototype.error_msg = B.prototype.error_msg = function() {
          return h(Jb(this.ptr));
        };
        B.prototype.__destroy__ = B.prototype.__destroy__ = function() {
          Kb(this.ptr);
        };
        H.prototype = Object.create(t.prototype);
        H.prototype.constructor = H;
        H.prototype.__class__ = H;
        H.__cache__ = {};
        a.DracoFloat32Array = H;
        H.prototype.GetValue = H.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Lb(c, b);
        };
        H.prototype.size = H.prototype.size = function() {
          return Mb(this.ptr);
        };
        H.prototype.__destroy__ = H.prototype.__destroy__ = function() {
          Nb(this.ptr);
        };
        I.prototype = Object.create(t.prototype);
        I.prototype.constructor = I;
        I.prototype.__class__ = I;
        I.__cache__ = {};
        a.DracoInt8Array = I;
        I.prototype.GetValue = I.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Ob(c, b);
        };
        I.prototype.size = I.prototype.size = function() {
          return Pb(this.ptr);
        };
        I.prototype.__destroy__ = I.prototype.__destroy__ = function() {
          Qb(this.ptr);
        };
        J.prototype = Object.create(t.prototype);
        J.prototype.constructor = J;
        J.prototype.__class__ = J;
        J.__cache__ = {};
        a.DracoUInt8Array = J;
        J.prototype.GetValue = J.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Rb(c, b);
        };
        J.prototype.size = J.prototype.size = function() {
          return Sb(this.ptr);
        };
        J.prototype.__destroy__ = J.prototype.__destroy__ = function() {
          Tb(this.ptr);
        };
        K.prototype = Object.create(t.prototype);
        K.prototype.constructor = K;
        K.prototype.__class__ = K;
        K.__cache__ = {};
        a.DracoInt16Array = K;
        K.prototype.GetValue = K.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Ub(c, b);
        };
        K.prototype.size = K.prototype.size = function() {
          return Vb(this.ptr);
        };
        K.prototype.__destroy__ = K.prototype.__destroy__ = function() {
          Wb(this.ptr);
        };
        L.prototype = Object.create(t.prototype);
        L.prototype.constructor = L;
        L.prototype.__class__ = L;
        L.__cache__ = {};
        a.DracoUInt16Array = L;
        L.prototype.GetValue = L.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Xb(c, b);
        };
        L.prototype.size = L.prototype.size = function() {
          return Yb(this.ptr);
        };
        L.prototype.__destroy__ = L.prototype.__destroy__ = function() {
          Zb(this.ptr);
        };
        M.prototype = Object.create(t.prototype);
        M.prototype.constructor = M;
        M.prototype.__class__ = M;
        M.__cache__ = {};
        a.DracoInt32Array = M;
        M.prototype.GetValue = M.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return $b(c, b);
        };
        M.prototype.size = M.prototype.size = function() {
          return ac(this.ptr);
        };
        M.prototype.__destroy__ = M.prototype.__destroy__ = function() {
          bc(this.ptr);
        };
        N.prototype = Object.create(t.prototype);
        N.prototype.constructor = N;
        N.prototype.__class__ = N;
        N.__cache__ = {};
        a.DracoUInt32Array = N;
        N.prototype.GetValue = N.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return cc(c, b);
        };
        N.prototype.size = N.prototype.size = function() {
          return dc(this.ptr);
        };
        N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
          ec(this.ptr);
        };
        y.prototype = Object.create(t.prototype);
        y.prototype.constructor = y;
        y.prototype.__class__ = y;
        y.__cache__ = {};
        a.MetadataQuerier = y;
        y.prototype.HasEntry = y.prototype.HasEntry = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return !!fc(d, b, c);
        };
        y.prototype.GetIntEntry = y.prototype.GetIntEntry = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return gc(d, b, c);
        };
        y.prototype.GetIntEntryArray = y.prototype.GetIntEntryArray = function(b, c, d) {
          var g = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          d && "object" === typeof d && (d = d.ptr);
          hc(g, b, c, d);
        };
        y.prototype.GetDoubleEntry = y.prototype.GetDoubleEntry = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return ic(d, b, c);
        };
        y.prototype.GetStringEntry = y.prototype.GetStringEntry = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return h(jc(d, b, c));
        };
        y.prototype.NumEntries = y.prototype.NumEntries = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return kc(c, b);
        };
        y.prototype.GetEntryName = y.prototype.GetEntryName = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return h(lc(d, b, c));
        };
        y.prototype.__destroy__ = y.prototype.__destroy__ = function() {
          mc(this.ptr);
        };
        m.prototype = Object.create(t.prototype);
        m.prototype.constructor = m;
        m.prototype.__class__ = m;
        m.__cache__ = {};
        a.Decoder = m;
        m.prototype.DecodeArrayToPointCloud = m.prototype.DecodeArrayToPointCloud = function(b, c, d) {
          var g = this.ptr;
          r.prepare();
          "object" == typeof b && (b = pa(b));
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return D(nc(g, b, c, d), B);
        };
        m.prototype.DecodeArrayToMesh = m.prototype.DecodeArrayToMesh = function(b, c, d) {
          var g = this.ptr;
          r.prepare();
          "object" == typeof b && (b = pa(b));
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return D(oc(g, b, c, d), B);
        };
        m.prototype.GetAttributeId = m.prototype.GetAttributeId = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return pc(d, b, c);
        };
        m.prototype.GetAttributeIdByName = m.prototype.GetAttributeIdByName = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return qc(d, b, c);
        };
        m.prototype.GetAttributeIdByMetadataEntry = m.prototype.GetAttributeIdByMetadataEntry = function(b, c, d) {
          var g = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          d = d && "object" === typeof d ? d.ptr : R(d);
          return rc(g, b, c, d);
        };
        m.prototype.GetAttribute = m.prototype.GetAttribute = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(sc(d, b, c), w);
        };
        m.prototype.GetAttributeByUniqueId = m.prototype.GetAttributeByUniqueId = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(tc(d, b, c), w);
        };
        m.prototype.GetMetadata = m.prototype.GetMetadata = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return D(uc(c, b), T);
        };
        m.prototype.GetAttributeMetadata = m.prototype.GetAttributeMetadata = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(vc(d, b, c), T);
        };
        m.prototype.GetFaceFromMesh = m.prototype.GetFaceFromMesh = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!wc(g, b, c, d);
        };
        m.prototype.GetTriangleStripsFromMesh = m.prototype.GetTriangleStripsFromMesh = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return xc(d, b, c);
        };
        m.prototype.GetTrianglesUInt16Array = m.prototype.GetTrianglesUInt16Array = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!yc(g, b, c, d);
        };
        m.prototype.GetTrianglesUInt32Array = m.prototype.GetTrianglesUInt32Array = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!zc(g, b, c, d);
        };
        m.prototype.GetAttributeFloat = m.prototype.GetAttributeFloat = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Ac(g, b, c, d);
        };
        m.prototype.GetAttributeFloatForAllPoints = m.prototype.GetAttributeFloatForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Bc(g, b, c, d);
        };
        m.prototype.GetAttributeIntForAllPoints = m.prototype.GetAttributeIntForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Cc(g, b, c, d);
        };
        m.prototype.GetAttributeInt8ForAllPoints = m.prototype.GetAttributeInt8ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Dc(g, b, c, d);
        };
        m.prototype.GetAttributeUInt8ForAllPoints = m.prototype.GetAttributeUInt8ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Ec(g, b, c, d);
        };
        m.prototype.GetAttributeInt16ForAllPoints = m.prototype.GetAttributeInt16ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Fc(g, b, c, d);
        };
        m.prototype.GetAttributeUInt16ForAllPoints = m.prototype.GetAttributeUInt16ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Gc(g, b, c, d);
        };
        m.prototype.GetAttributeInt32ForAllPoints = m.prototype.GetAttributeInt32ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Hc(g, b, c, d);
        };
        m.prototype.GetAttributeUInt32ForAllPoints = m.prototype.GetAttributeUInt32ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Ic(g, b, c, d);
        };
        m.prototype.GetAttributeDataArrayForAllPoints = m.prototype.GetAttributeDataArrayForAllPoints = function(b, c, d, g, u) {
          var X = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          g && "object" === typeof g && (g = g.ptr);
          u && "object" === typeof u && (u = u.ptr);
          return !!Jc(X, b, c, d, g, u);
        };
        m.prototype.SkipAttributeTransform = m.prototype.SkipAttributeTransform = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          Kc(c, b);
        };
        m.prototype.GetEncodedGeometryType_Deprecated = m.prototype.GetEncodedGeometryType_Deprecated = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Lc(c, b);
        };
        m.prototype.DecodeBufferToPointCloud = m.prototype.DecodeBufferToPointCloud = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(Mc(d, b, c), B);
        };
        m.prototype.DecodeBufferToMesh = m.prototype.DecodeBufferToMesh = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(Nc(d, b, c), B);
        };
        m.prototype.__destroy__ = m.prototype.__destroy__ = function() {
          Oc(this.ptr);
        };
        (function() {
          function b() {
            a.ATTRIBUTE_INVALID_TRANSFORM = Pc();
            a.ATTRIBUTE_NO_TRANSFORM = Qc();
            a.ATTRIBUTE_QUANTIZATION_TRANSFORM = Rc();
            a.ATTRIBUTE_OCTAHEDRON_TRANSFORM = Sc();
            a.INVALID = Tc();
            a.POSITION = Uc();
            a.NORMAL = Vc();
            a.COLOR = Wc();
            a.TEX_COORD = Xc();
            a.GENERIC = Yc();
            a.INVALID_GEOMETRY_TYPE = Zc();
            a.POINT_CLOUD = $c();
            a.TRIANGULAR_MESH = ad();
            a.DT_INVALID = bd();
            a.DT_INT8 = cd();
            a.DT_UINT8 = dd();
            a.DT_INT16 = ed();
            a.DT_UINT16 = fd();
            a.DT_INT32 = gd();
            a.DT_UINT32 = hd();
            a.DT_INT64 = id();
            a.DT_UINT64 = jd();
            a.DT_FLOAT32 = kd();
            a.DT_FLOAT64 = ld();
            a.DT_BOOL = md();
            a.DT_TYPES_COUNT = nd();
            a.OK = od();
            a.DRACO_ERROR = pd();
            a.IO_ERROR = qd();
            a.INVALID_PARAMETER = rd();
            a.UNSUPPORTED_VERSION = sd();
            a.UNKNOWN_VERSION = td();
          }
          za ? b() : oa.unshift(b);
        })();
        if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
        a.Decoder.prototype.GetEncodedGeometryType = function(b) {
          if (b.__class__ && b.__class__ === a.DecoderBuffer) return a.Decoder.prototype.GetEncodedGeometryType_Deprecated(b);
          if (8 > b.byteLength) return a.INVALID_GEOMETRY_TYPE;
          switch (b[7]) {
            case 0:
              return a.POINT_CLOUD;
            case 1:
              return a.TRIANGULAR_MESH;
            default:
              return a.INVALID_GEOMETRY_TYPE;
          }
        };
        return n.ready;
      };
    })();
    "object" === typeof exports2 && "object" === typeof module2 ? module2.exports = DracoDecoderModule : "function" === typeof define && define.amd ? define([], function() {
      return DracoDecoderModule;
    }) : "object" === typeof exports2 && (exports2.DracoDecoderModule = DracoDecoderModule);
  }
});

// node_modules/draco3d/draco3d.js
var require_draco3d = __commonJS({
  "node_modules/draco3d/draco3d.js"(exports2, module2) {
    var createEncoderModule = require_draco_encoder_nodejs();
    var createDecoderModule = require_draco_decoder_nodejs();
    module2.exports = {
      createEncoderModule,
      createDecoderModule
    };
  }
});

// src/redcube.node.ts
var redcube_node_exports = {};
__export(redcube_node_exports, {
  RedCube: () => RedCube
});
module.exports = __toCommonJS(redcube_node_exports);

// src/matrix.ts
var Matrix4 = class _Matrix4 {
  elements;
  animated;
  constructor(opt_src) {
    let i;
    let s;
    let d;
    if (opt_src && typeof opt_src === "object" && opt_src.hasOwnProperty("elements")) {
      s = opt_src.elements;
      d = new Float32Array(16);
      for (i = 0; i < 16; ++i) {
        d[i] = s[i];
      }
      this.elements = d;
    } else {
      this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
  }
  /**
   * Copy matrix.
   * @param src source matrix
   * @return this
   */
  set(src) {
    let i;
    let s;
    let d;
    s = src;
    d = this.elements;
    if (s === d) {
      return;
    }
    for (i = 0; i < 16; ++i) {
      d[i] = s[i];
    }
    return this;
  }
  multiply(matrix) {
    this.concat(matrix);
    return this;
  }
  /**
   * Multiply the matrix from the right.
   * @param other The multiply matrix
   * @return this
   */
  concat({ elements }) {
    let i;
    let e;
    let a;
    let b;
    let ai0;
    let ai1;
    let ai2;
    let ai3;
    e = this.elements;
    a = this.elements;
    b = elements;
    if (e === b) {
      b = new Float32Array(16);
      for (i = 0; i < 16; ++i) {
        b[i] = e[i];
      }
    }
    for (i = 0; i < 4; i++) {
      ai0 = a[i];
      ai1 = a[i + 4];
      ai2 = a[i + 8];
      ai3 = a[i + 12];
      e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
      e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
      e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
      e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
    return this;
  }
  /**
   * Calculate the inverse matrix of specified matrix, and set to this.
   * @param other The source matrix
   * @return this
   */
  setInverseOf({ elements }) {
    let i;
    let s;
    let d;
    let inv;
    let det;
    s = elements;
    d = this.elements;
    inv = new Float32Array(16);
    inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
    inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
    inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
    inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
    inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
    inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
    inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
    inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
    inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
    inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
    inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
    inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
    inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
    inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
    inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
    inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
    det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
    if (det === 0) {
      return this;
    }
    det = 1 / det;
    for (i = 0; i < 16; i++) {
      d[i] = inv[i] * det;
    }
    return this;
  }
  /**
   * Calculate the inverse matrix of this, and set to this.
   * @return this
   */
  invert() {
    return this.setInverseOf(this);
  }
  makeOrthographic(left, right, top, bottom, near, far) {
    var te = this.elements;
    var w = 1 / (right - left);
    var h = 1 / (top - bottom);
    var p = 1 / (far - near);
    var x = (right + left) * w;
    var y = (top + bottom) * h;
    var z = (far + near) * p;
    te[0] = 2 * w;
    te[4] = 0;
    te[8] = 0;
    te[12] = -x;
    te[1] = 0;
    te[5] = 2 * h;
    te[9] = 0;
    te[13] = -y;
    te[2] = 0;
    te[6] = 0;
    te[10] = -2 * p;
    te[14] = -z;
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[15] = 1;
    return this;
  }
  /**
   * Set the orthographic projection matrix.
   * @param left The coordinate of the left of clipping plane.
   * @param right The coordinate of the right of clipping plane.
   * @param bottom The coordinate of the bottom of clipping plane.
   * @param top The coordinate of the top top clipping plane.
   * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @return this
   */
  setOrtho(r, t, near, far) {
    let e;
    let rw;
    let rh;
    let rd;
    rw = 1 / r;
    rh = 1 / t;
    rd = 2 / (near - far);
    e = this.elements;
    e[0] = rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;
    e[4] = 0;
    e[5] = rh;
    e[6] = 0;
    e[7] = 0;
    e[8] = 0;
    e[9] = 0;
    e[10] = rd;
    e[11] = (far + near) / (near - far);
    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;
    return this;
  }
  /**
   * Set the perspective projection matrix by fovy and aspect.
   * @param fovy The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  setPerspective(fovy, aspect, near, far) {
    let e;
    let rd;
    let s;
    let ct;
    if (near === far || aspect === 0) {
      throw "null frustum";
    }
    if (near <= 0) {
      throw "near <= 0";
    }
    if (far <= 0) {
      throw "far <= 0";
    }
    fovy /= 2;
    s = Math.sin(fovy);
    if (s === 0) {
      throw "null frustum";
    }
    rd = 1 / (far - near);
    ct = Math.cos(fovy) / s;
    e = this.elements;
    e[0] = ct / aspect;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;
    e[4] = 0;
    e[5] = ct;
    e[6] = 0;
    e[7] = 0;
    e[8] = 0;
    e[9] = 0;
    e[10] = -(far + near) * rd;
    e[11] = -1;
    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;
    return this;
  }
  /**
   * Multiply the perspective projection matrix from the right.
   * @param fovy The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  perspective(fovy, aspect, near, far) {
    return this.concat(new _Matrix4().setPerspective(fovy, aspect, near, far));
  }
  /**
   * Multiply the four-dimensional vector.
   * @param pos  The multiply vector
   * @return The result of multiplication(Float32Array)
   */
  multiplyVector4({ elements }) {
    const e = this.elements;
    const p = elements;
    const v = new Vector4();
    const result = v.elements;
    result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
    result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
    result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
    result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
    return v;
  }
  getScaling() {
    let e = this.elements;
    let m11 = e[0];
    let m12 = e[1];
    let m13 = e[2];
    let m21 = e[4];
    let m22 = e[5];
    let m23 = e[6];
    let m31 = e[8];
    let m32 = e[9];
    let m33 = e[10];
    let out = new Vector3([
      Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13),
      Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23),
      Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33)
    ]);
    return out;
  }
  scale(vec3) {
    const x = vec3.elements[0];
    const y = vec3.elements[1];
    const z = vec3.elements[2];
    const e = this.elements;
    e[0] *= x;
    e[4] *= y;
    e[8] *= z;
    e[1] *= x;
    e[5] *= y;
    e[9] *= z;
    e[2] *= x;
    e[6] *= y;
    e[10] *= z;
    e[3] *= x;
    e[7] *= y;
    e[11] *= z;
    return this;
  }
  restoreScale(vec3) {
    const x = vec3.elements[0];
    const y = vec3.elements[1];
    const z = vec3.elements[2];
    const e = this.elements;
    e[0] /= x;
    e[4] /= y;
    e[8] /= z;
    e[1] /= x;
    e[5] /= y;
    e[9] /= z;
    e[2] /= x;
    e[6] /= y;
    e[10] /= z;
    e[3] /= x;
    e[7] /= y;
    e[11] /= z;
    return this;
  }
  setTranslate(vec3) {
    const e = this.elements;
    const x = vec3.elements[0];
    const y = vec3.elements[1];
    const z = vec3.elements[2];
    e[12] = x;
    e[13] = y;
    e[14] = z;
    e[15] = 1;
    return this;
  }
  /**
   * Multiply the matrix for translation from the right.
   * @param x The X value of a translation.
   * @param y The Y value of a translation.
   * @param z The Z value of a translation.
   * @return this
   */
  translate(x, y, z) {
    const e = this.elements;
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
  }
  getMaxScaleOnAxis() {
    const te = this.elements;
    const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
    const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
    const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  }
  rotate(axis, rad) {
    let x = axis.elements[0], y = axis.elements[1], z = axis.elements[2];
    let len = Math.hypot(x, y, z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;
    if (len < Number.EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    let a = this.elements;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    a[0] = a00 * b00 + a10 * b01 + a20 * b02;
    a[1] = a01 * b00 + a11 * b01 + a21 * b02;
    a[2] = a02 * b00 + a12 * b01 + a22 * b02;
    a[3] = a03 * b00 + a13 * b01 + a23 * b02;
    a[4] = a00 * b10 + a10 * b11 + a20 * b12;
    a[5] = a01 * b10 + a11 * b11 + a21 * b12;
    a[6] = a02 * b10 + a12 * b11 + a22 * b12;
    a[7] = a03 * b10 + a13 * b11 + a23 * b12;
    a[8] = a00 * b20 + a10 * b21 + a20 * b22;
    a[9] = a01 * b20 + a11 * b21 + a21 * b22;
    a[10] = a02 * b20 + a12 * b21 + a22 * b22;
    a[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return this;
  }
  makeRotationAxis(axis, angle) {
    const te = this.elements;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const x = axis.elements[0], y = axis.elements[1], z = axis.elements[2];
    const tx = t * x, ty = t * y;
    te[0] = tx * x + c;
    te[1] = tx * y - s * z;
    te[2] = tx * z + s * y;
    te[3] = 0;
    te[4] = tx * y + s * z;
    te[5] = ty * y + c;
    te[6] = ty * z - s * x;
    te[7] = 0;
    te[8] = tx * z - s * y;
    te[9] = ty * z + s * x;
    te[10] = t * z * z + c;
    te[11] = 0;
    te[15] = 1;
    return this;
  }
  makeRotationFromQuaternion(q) {
    const te = this.elements;
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    te[0] = 1 - (yy + zz);
    te[4] = xy - wz;
    te[8] = xz + wy;
    te[1] = xy + wz;
    te[5] = 1 - (xx + zz);
    te[9] = yz - wx;
    te[2] = xz - wy;
    te[6] = yz + wx;
    te[10] = 1 - (xx + yy);
    return this;
  }
  transpose() {
    let e;
    let t;
    e = this.elements;
    t = e[1];
    e[1] = e[4];
    e[4] = t;
    t = e[2];
    e[2] = e[8];
    e[8] = t;
    t = e[3];
    e[3] = e[12];
    e[12] = t;
    t = e[6];
    e[6] = e[9];
    e[9] = t;
    t = e[7];
    e[7] = e[13];
    e[13] = t;
    t = e[11];
    e[11] = e[14];
    e[14] = t;
    return this;
  }
};
var Vector3 = class _Vector3 {
  elements;
  get x() {
    return this.elements[0];
  }
  get y() {
    return this.elements[1];
  }
  get z() {
    return this.elements[2];
  }
  set x(v) {
    this.elements[0] = v;
  }
  set y(v) {
    this.elements[1] = v;
  }
  set z(v) {
    this.elements[2] = v;
  }
  static FromArrayToRef(array, offset, result) {
    result.x = array[offset];
    result.y = array[offset + 1];
    result.z = array[offset + 2];
  }
  constructor(opt_src) {
    const v = new Float32Array(3);
    if (opt_src && typeof opt_src === "object") {
      v[0] = opt_src[0];
      v[1] = opt_src[1];
      v[2] = opt_src[2];
    }
    this.elements = v;
  }
  projectOnVector(vector) {
    const scalar = _Vector3.dot(vector, this) / vector.lengthSq();
    return new _Vector3(vector.elements).scale(scalar);
  }
  applyQuaternion({ elements }) {
    const x = this.elements[0];
    const y = this.elements[1];
    const z = this.elements[2];
    const qx = elements[0];
    const qy = elements[1];
    const qz = elements[2];
    const qw = elements[3];
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    this.elements[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.elements[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.elements[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  }
  /**
   * Normalize.
   * @return this
   */
  normalize() {
    const v = this.elements;
    const c = v[0];
    const d = v[1];
    const e = v[2];
    let g = Math.sqrt(c * c + d * d + e * e);
    if (g) {
      if (g == 1) {
        return this;
      }
    } else {
      v[0] = 0;
      v[1] = 0;
      v[2] = 0;
      return this;
    }
    g = 1 / g;
    v[0] = c * g;
    v[1] = d * g;
    v[2] = e * g;
    return this;
  }
  /**
   * Scales a vec3 by a scalar number
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec3} out
   */
  add(vector) {
    const a = this.elements;
    const b = vector.elements;
    a[0] = a[0] + b[0];
    a[1] = a[1] + b[1];
    a[2] = a[2] + b[2];
    return this;
  }
  addS(b) {
    const a = this.elements;
    a[0] = a[0] + b;
    a[1] = a[1] + b;
    a[2] = a[2] + b;
    return this;
  }
  scale(b) {
    const a = this.elements;
    a[0] = a[0] * b;
    a[1] = a[1] * b;
    a[2] = a[2] * b;
    return this;
  }
  scale2(scale) {
    return new _Vector3([this.x * scale, this.y * scale, this.z * scale]);
  }
  subtract2(otherVector) {
    return new _Vector3([this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z]);
  }
  add2(otherVector) {
    return new _Vector3([this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z]);
  }
  distanceToSquared(x, y, z) {
    const dx = this.elements[0] - x;
    const dy = this.elements[1] - y;
    const dz = this.elements[2] - z;
    return dx * dx + dy * dy + dz * dz;
  }
  subtract(vector) {
    const out = this.elements;
    const b = vector.elements;
    out[0] = out[0] - b[0];
    out[1] = out[1] - b[1];
    out[2] = out[2] - b[2];
    return this;
  }
  divideScalar(scalar) {
    return this.scale(1 / scalar);
  }
  applyMatrix4({ elements }) {
    const x = this.elements[0];
    const y = this.elements[1];
    const z = this.elements[2];
    const e = elements;
    this.elements[0] = e[0] * x + e[4] * y + e[8] * z + e[12];
    this.elements[1] = e[1] * x + e[5] * y + e[9] * z + e[13];
    this.elements[2] = e[2] * x + e[6] * y + e[10] * z + e[14];
    const w = e[3] * x + e[7] * y + e[11] * z + e[15];
    return this.divideScalar(w);
  }
  lerp(a, b, t) {
    const out = this.elements;
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return this;
  }
  lengthSq() {
    return this.elements[0] * this.elements[0] + this.elements[1] * this.elements[1] + this.elements[2] * this.elements[2];
  }
  multiply({ elements }) {
    this.elements[0] *= elements[0];
    this.elements[1] *= elements[1];
    this.elements[2] *= elements[2];
    return this;
  }
  static angle(a, b) {
    const tempA = new _Vector3(a.elements);
    const tempB = new _Vector3(b.elements);
    tempA.normalize();
    tempB.normalize();
    const cosine = _Vector3.dot(tempA, tempB);
    if (cosine > 1) {
      return 0;
    } else {
      return Math.acos(cosine);
    }
  }
  static cross(vecA, vecB) {
    const a = vecA.elements;
    const b = vecB.elements;
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const out = new _Vector3();
    out.elements[0] = ay * bz - az * by;
    out.elements[1] = az * bx - ax * bz;
    out.elements[2] = ax * by - ay * bx;
    return out;
  }
  static dot(vecA, vecB) {
    const a = vecA.elements;
    const b = vecB.elements;
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);
    return this;
  }
  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
};
var Box = class {
  min = new Vector3([Infinity, Infinity, Infinity]);
  max = new Vector3([-Infinity, -Infinity, -Infinity]);
  expand(box) {
    this.min.min(box.min);
    this.max.max(box.max);
  }
  getSize() {
    const size = new Vector3();
    size.subVectors(this.max, this.min);
    return size.length();
  }
};
var Vector4 = class {
  elements;
  constructor(opt_src) {
    const v = new Float32Array(4);
    if (opt_src && typeof opt_src === "object") {
      v[0] = opt_src[0];
      v[1] = opt_src[1];
      v[2] = opt_src[2];
      v[3] = opt_src[3];
    }
    this.elements = v;
  }
  set(e) {
    const a = this.elements;
    a[0] = e[0];
    a[1] = e[1];
    a[2] = e[2];
    a[3] = e[3];
    return this;
  }
  add(vector) {
    const a = this.elements;
    const b = vector.elements;
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = a[3] + b[3];
    return this;
  }
  normalize() {
    const x = this.elements[0];
    const y = this.elements[1];
    const z = this.elements[2];
    const w = this.elements[3];
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      this.elements[0] = x * len;
      this.elements[1] = y * len;
      this.elements[2] = z * len;
      this.elements[3] = w * len;
    }
    return this;
  }
  setFromRotationMatrix({ elements }) {
    const te = elements;
    const m11 = te[0];
    const m12 = te[4];
    const m13 = te[8];
    const m21 = te[1];
    const m22 = te[5];
    const m23 = te[9];
    const m31 = te[2];
    const m32 = te[6];
    const m33 = te[10];
    const trace = m11 + m22 + m33;
    let s;
    if (trace > 0) {
      s = 0.5 / Math.sqrt(trace + 1);
      this.elements[3] = 0.25 / s;
      this.elements[0] = (m32 - m23) * s;
      this.elements[1] = (m13 - m31) * s;
      this.elements[2] = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      this.elements[3] = (m32 - m23) / s;
      this.elements[0] = 0.25 * s;
      this.elements[1] = (m12 + m21) / s;
      this.elements[2] = (m13 + m31) / s;
    } else if (m22 > m33) {
      s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      this.elements[3] = (m13 - m31) / s;
      this.elements[0] = (m12 + m21) / s;
      this.elements[1] = 0.25 * s;
      this.elements[2] = (m23 + m32) / s;
    } else {
      s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      this.elements[3] = (m21 - m12) / s;
      this.elements[0] = (m13 + m31) / s;
      this.elements[1] = (m23 + m32) / s;
      this.elements[2] = 0.25 * s;
    }
    return this;
  }
  lerp(a, b, t) {
    const out = this.elements;
    if (t === 0) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return this;
    }
    if (t === 1) {
      out[0] = b[0];
      out[1] = b[1];
      out[2] = b[2];
      out[3] = b[3];
      return this;
    }
    const x = a[0], y = a[1], z = a[2], w = a[3];
    let cosHalfTheta = w * b[3] + x * b[0] + y * b[1] + z * b[2];
    if (cosHalfTheta < 0) {
      out[3] = -b[3];
      out[0] = -b[0];
      out[1] = -b[1];
      out[2] = -b[2];
      cosHalfTheta = -cosHalfTheta;
    } else {
      out[0] = b[0];
      out[1] = b[1];
      out[2] = b[2];
      out[3] = b[3];
    }
    if (cosHalfTheta >= 1) {
      out[3] = w;
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return this;
    }
    const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
    if (sqrSinHalfTheta <= Number.EPSILON) {
      var s = 1 - t;
      out[3] = s * w + t * out[3];
      out[0] = s * x + t * out[0];
      out[1] = s * y + t * out[1];
      out[2] = s * z + t * out[2];
      return this.normalize();
    }
    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    out[3] = w * ratioA + out[3] * ratioB;
    out[0] = x * ratioA + out[0] * ratioB;
    out[1] = y * ratioA + out[1] * ratioB;
    out[2] = z * ratioA + out[2] * ratioB;
    return this;
  }
  inverse() {
    this.elements[0] = -this.elements[0];
    this.elements[1] = -this.elements[1];
    this.elements[2] = -this.elements[2];
    return this;
  }
};
var Vector2 = class {
  elements;
  get x() {
    return this.elements[0];
  }
  get y() {
    return this.elements[1];
  }
  set x(v) {
    this.elements[0] = v;
  }
  set y(v) {
    this.elements[1] = v;
  }
  constructor(opt_src) {
    const v = new Float32Array(2);
    if (opt_src && typeof opt_src === "object") {
      v[0] = opt_src[0];
      v[1] = opt_src[1];
    }
    this.elements = v;
  }
  subtract(vector) {
    const out = this.elements;
    const b = vector.elements;
    out[0] = out[0] - b[0];
    out[1] = out[1] - b[1];
    return this;
  }
  lerp(a, b, t) {
    const out = this.elements;
    const ax = a[0];
    const ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return this;
  }
};

// src/objects/scene.ts
var Scene = class {
  children;
  bin;
  matrixWorld;
  matrix;
  transparentChildren;
  opaqueChildren;
  meshes;
  tracks;
  cameras;
  lights;
  variants;
  visible = true;
  constructor() {
    this.opaqueChildren = [];
    this.transparentChildren = [];
    this.meshes = [];
    this.children = [];
    this.bin = [];
    this.matrixWorld = new Matrix4();
    this.matrix = new Matrix4();
    this.variants = [];
  }
};

// src/objects/object3d.ts
var Object3D = class {
  uuid;
  name;
  id;
  children;
  matrix;
  matrixWorld;
  parent;
  reflow;
  repaint;
  visible = true;
  instances = 1;
  matrices = [];
  constructor(name, parent) {
    this.uuid = Math.floor(Date.now() * Math.random());
    this.name = name;
    this.children = [];
    this.matrix = new Matrix4();
    this.matrixWorld = new Matrix4();
    this.parent = parent;
  }
  getPosition() {
    return new Float32Array([this.matrixWorld.elements[12], this.matrixWorld.elements[13], this.matrixWorld.elements[14]]);
  }
  setPosition(translation, rotation, scale) {
    if (rotation) {
      this.matrix.makeRotationFromQuaternion(rotation);
    }
    if (scale) {
      this.matrix.scale(new Vector3(scale));
    }
    if (translation) {
      this.matrix.setTranslate(new Vector3(translation));
    }
  }
  setMatrix(matrix) {
    this.matrix.set(matrix);
  }
  setMatrixWorld(matrix) {
    this.matrixWorld.set(matrix);
  }
  updateMatrix() {
    const m = new Matrix4();
    m.multiply(this.parent.matrixWorld);
    m.multiply(this.matrix);
    this.setMatrixWorld(m.elements);
    if (this.matrices.length) {
      for (const matrix of this.matrices) {
        const m2 = new Matrix4();
        m2.multiply(this.parent.matrixWorld);
        m2.multiply(matrix);
        matrix.set(m2.elements);
      }
    }
  }
};

// src/glEnum.ts
var glEnum_default = {
  "0": "NONE",
  "1": "ONE",
  "2": "LINE_LOOP",
  "3": "LINE_STRIP",
  "4": "TRIANGLES",
  "5": "TRIANGLE_STRIP",
  "6": "TRIANGLE_FAN",
  "256": "DEPTH_BUFFER_BIT",
  "512": "NEVER",
  "513": "LESS",
  "514": "EQUAL",
  "515": "LEQUAL",
  "516": "GREATER",
  "517": "NOTEQUAL",
  "518": "GEQUAL",
  "519": "ALWAYS",
  "768": "SRC_COLOR",
  "769": "ONE_MINUS_SRC_COLOR",
  "770": "SRC_ALPHA",
  "771": "ONE_MINUS_SRC_ALPHA",
  "772": "DST_ALPHA",
  "773": "ONE_MINUS_DST_ALPHA",
  "774": "DST_COLOR",
  "775": "ONE_MINUS_DST_COLOR",
  "776": "SRC_ALPHA_SATURATE",
  "1024": "STENCIL_BUFFER_BIT",
  "1028": "FRONT",
  "1029": "BACK",
  "1032": "FRONT_AND_BACK",
  "1280": "INVALID_ENUM",
  "1281": "INVALID_VALUE",
  "1282": "INVALID_OPERATION",
  "1285": "OUT_OF_MEMORY",
  "1286": "INVALID_FRAMEBUFFER_OPERATION",
  "1798": "drawingBufferHeight",
  "2304": "CW",
  "2305": "CCW",
  "2712": "drawingBufferWidth",
  "2849": "LINE_WIDTH",
  "2884": "CULL_FACE",
  "2885": "CULL_FACE_MODE",
  "2886": "FRONT_FACE",
  "2928": "DEPTH_RANGE",
  "2929": "DEPTH_TEST",
  "2930": "DEPTH_WRITEMASK",
  "2931": "DEPTH_CLEAR_VALUE",
  "2932": "DEPTH_FUNC",
  "2960": "STENCIL_TEST",
  "2961": "STENCIL_CLEAR_VALUE",
  "2962": "STENCIL_FUNC",
  "2963": "STENCIL_VALUE_MASK",
  "2964": "STENCIL_FAIL",
  "2965": "STENCIL_PASS_DEPTH_FAIL",
  "2966": "STENCIL_PASS_DEPTH_PASS",
  "2967": "STENCIL_REF",
  "2968": "STENCIL_WRITEMASK",
  "2978": "VIEWPORT",
  "3024": "DITHER",
  "3042": "BLEND",
  "3074": "READ_BUFFER",
  "3088": "SCISSOR_BOX",
  "3089": "SCISSOR_TEST",
  "3106": "COLOR_CLEAR_VALUE",
  "3107": "COLOR_WRITEMASK",
  "3314": "UNPACK_ROW_LENGTH",
  "3315": "UNPACK_SKIP_ROWS",
  "3316": "UNPACK_SKIP_PIXELS",
  "3317": "UNPACK_ALIGNMENT",
  "3330": "PACK_ROW_LENGTH",
  "3331": "PACK_SKIP_ROWS",
  "3332": "PACK_SKIP_PIXELS",
  "3333": "PACK_ALIGNMENT",
  "3379": "MAX_TEXTURE_SIZE",
  "3386": "MAX_VIEWPORT_DIMS",
  "3408": "SUBPIXEL_BITS",
  "3410": "RED_BITS",
  "3411": "GREEN_BITS",
  "3412": "BLUE_BITS",
  "3413": "ALPHA_BITS",
  "3414": "DEPTH_BITS",
  "3415": "STENCIL_BITS",
  "3553": "TEXTURE_2D",
  "4352": "DONT_CARE",
  "4353": "FASTEST",
  "4354": "NICEST",
  "5120": "BYTE",
  "5121": "UNSIGNED_BYTE",
  "5122": "SHORT",
  "5123": "UNSIGNED_SHORT",
  "5124": "INT",
  "5125": "UNSIGNED_INT",
  "5126": "FLOAT",
  "5131": "HALF_FLOAT",
  "5386": "INVERT",
  "5890": "TEXTURE",
  "6144": "COLOR",
  "6145": "DEPTH",
  "6146": "STENCIL",
  "6402": "DEPTH_COMPONENT",
  "6403": "RED",
  "6406": "ALPHA",
  "6407": "RGB",
  "6408": "RGBA",
  "6409": "LUMINANCE",
  "6410": "LUMINANCE_ALPHA",
  "7680": "KEEP",
  "7681": "REPLACE",
  "7682": "INCR",
  "7683": "DECR",
  "7936": "VENDOR",
  "7937": "RENDERER",
  "7938": "VERSION",
  "9728": "NEAREST",
  "9729": "LINEAR",
  "9984": "NEAREST_MIPMAP_NEAREST",
  "9985": "LINEAR_MIPMAP_NEAREST",
  "9986": "NEAREST_MIPMAP_LINEAR",
  "9987": "LINEAR_MIPMAP_LINEAR",
  "10240": "TEXTURE_MAG_FILTER",
  "10241": "TEXTURE_MIN_FILTER",
  "10242": "TEXTURE_WRAP_S",
  "10243": "TEXTURE_WRAP_T",
  "10497": "REPEAT",
  "10752": "POLYGON_OFFSET_UNITS",
  "16384": "COLOR_BUFFER_BIT",
  "32769": "CONSTANT_COLOR",
  "32770": "ONE_MINUS_CONSTANT_COLOR",
  "32771": "CONSTANT_ALPHA",
  "32772": "ONE_MINUS_CONSTANT_ALPHA",
  "32773": "BLEND_COLOR",
  "32774": "FUNC_ADD",
  "32775": "MIN",
  "32776": "MAX",
  "32777": "BLEND_EQUATION_RGB",
  "32778": "FUNC_SUBTRACT",
  "32779": "FUNC_REVERSE_SUBTRACT",
  "32819": "UNSIGNED_SHORT_4_4_4_4",
  "32820": "UNSIGNED_SHORT_5_5_5_1",
  "32823": "POLYGON_OFFSET_FILL",
  "32824": "POLYGON_OFFSET_FACTOR",
  "32849": "RGB8",
  "32854": "RGBA4",
  "32855": "RGB5_A1",
  "32856": "RGBA8",
  "32857": "RGB10_A2",
  "32873": "TEXTURE_BINDING_2D",
  "32874": "TEXTURE_BINDING_3D",
  "32877": "UNPACK_SKIP_IMAGES",
  "32878": "UNPACK_IMAGE_HEIGHT",
  "32879": "TEXTURE_3D",
  "32882": "TEXTURE_WRAP_R",
  "32883": "MAX_3D_TEXTURE_SIZE",
  "32926": "SAMPLE_ALPHA_TO_COVERAGE",
  "32928": "SAMPLE_COVERAGE",
  "32936": "SAMPLE_BUFFERS",
  "32937": "SAMPLES",
  "32938": "SAMPLE_COVERAGE_VALUE",
  "32939": "SAMPLE_COVERAGE_INVERT",
  "32968": "BLEND_DST_RGB",
  "32969": "BLEND_SRC_RGB",
  "32970": "BLEND_DST_ALPHA",
  "32971": "BLEND_SRC_ALPHA",
  "33000": "MAX_ELEMENTS_VERTICES",
  "33001": "MAX_ELEMENTS_INDICES",
  "33071": "CLAMP_TO_EDGE",
  "33082": "TEXTURE_MIN_LOD",
  "33083": "TEXTURE_MAX_LOD",
  "33084": "TEXTURE_BASE_LEVEL",
  "33085": "TEXTURE_MAX_LEVEL",
  "33170": "GENERATE_MIPMAP_HINT",
  "33189": "DEPTH_COMPONENT16",
  "33190": "DEPTH_COMPONENT24",
  "33296": "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING",
  "33297": "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE",
  "33298": "FRAMEBUFFER_ATTACHMENT_RED_SIZE",
  "33299": "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE",
  "33300": "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE",
  "33301": "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE",
  "33302": "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE",
  "33303": "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE",
  "33304": "FRAMEBUFFER_DEFAULT",
  "33306": "DEPTH_STENCIL_ATTACHMENT",
  "33319": "RG",
  "33320": "RG_INTEGER",
  "33321": "R8",
  "33323": "RG8",
  "33325": "R16F",
  "33326": "R32F",
  "33327": "RG16F",
  "33328": "RG32F",
  "33329": "R8I",
  "33330": "R8UI",
  "33331": "R16I",
  "33332": "R16UI",
  "33333": "R32I",
  "33334": "R32UI",
  "33335": "RG8I",
  "33336": "RG8UI",
  "33337": "RG16I",
  "33338": "RG16UI",
  "33339": "RG32I",
  "33340": "RG32UI",
  "33503": "TEXTURE_IMMUTABLE_LEVELS",
  "33635": "UNSIGNED_SHORT_5_6_5",
  "33640": "UNSIGNED_INT_2_10_10_10_REV",
  "33648": "MIRRORED_REPEAT",
  "33901": "ALIASED_POINT_SIZE_RANGE",
  "33902": "ALIASED_LINE_WIDTH_RANGE",
  "33984": "TEXTURE0",
  "33985": "TEXTURE1",
  "33986": "TEXTURE2",
  "33987": "TEXTURE3",
  "33988": "TEXTURE4",
  "33989": "TEXTURE5",
  "33990": "TEXTURE6",
  "33991": "TEXTURE7",
  "33992": "TEXTURE8",
  "33993": "TEXTURE9",
  "33994": "TEXTURE10",
  "33995": "TEXTURE11",
  "33996": "TEXTURE12",
  "33997": "TEXTURE13",
  "33998": "TEXTURE14",
  "33999": "TEXTURE15",
  "34000": "TEXTURE16",
  "34001": "TEXTURE17",
  "34002": "TEXTURE18",
  "34003": "TEXTURE19",
  "34004": "TEXTURE20",
  "34005": "TEXTURE21",
  "34006": "TEXTURE22",
  "34007": "TEXTURE23",
  "34008": "TEXTURE24",
  "34009": "TEXTURE25",
  "34010": "TEXTURE26",
  "34011": "TEXTURE27",
  "34012": "TEXTURE28",
  "34013": "TEXTURE29",
  "34014": "TEXTURE30",
  "34015": "TEXTURE31",
  "34016": "ACTIVE_TEXTURE",
  "34024": "MAX_RENDERBUFFER_SIZE",
  "34041": "DEPTH_STENCIL",
  "34042": "UNSIGNED_INT_24_8",
  "34045": "MAX_TEXTURE_LOD_BIAS",
  "34055": "INCR_WRAP",
  "34056": "DECR_WRAP",
  "34067": "TEXTURE_CUBE_MAP",
  "34068": "TEXTURE_BINDING_CUBE_MAP",
  "34069": "TEXTURE_CUBE_MAP_POSITIVE_X",
  "34070": "TEXTURE_CUBE_MAP_NEGATIVE_X",
  "34071": "TEXTURE_CUBE_MAP_POSITIVE_Y",
  "34072": "TEXTURE_CUBE_MAP_NEGATIVE_Y",
  "34073": "TEXTURE_CUBE_MAP_POSITIVE_Z",
  "34074": "TEXTURE_CUBE_MAP_NEGATIVE_Z",
  "34076": "MAX_CUBE_MAP_TEXTURE_SIZE",
  "34229": "VERTEX_ARRAY_BINDING",
  "34338": "VERTEX_ATTRIB_ARRAY_ENABLED",
  "34339": "VERTEX_ATTRIB_ARRAY_SIZE",
  "34340": "VERTEX_ATTRIB_ARRAY_STRIDE",
  "34341": "VERTEX_ATTRIB_ARRAY_TYPE",
  "34342": "CURRENT_VERTEX_ATTRIB",
  "34373": "VERTEX_ATTRIB_ARRAY_POINTER",
  "34467": "COMPRESSED_TEXTURE_FORMATS",
  "34660": "BUFFER_SIZE",
  "34661": "BUFFER_USAGE",
  "34816": "STENCIL_BACK_FUNC",
  "34817": "STENCIL_BACK_FAIL",
  "34818": "STENCIL_BACK_PASS_DEPTH_FAIL",
  "34819": "STENCIL_BACK_PASS_DEPTH_PASS",
  "34836": "RGBA32F",
  "34837": "RGB32F",
  "34842": "RGBA16F",
  "34843": "RGB16F",
  "34852": "MAX_DRAW_BUFFERS",
  "34853": "DRAW_BUFFER0",
  "34854": "DRAW_BUFFER1",
  "34855": "DRAW_BUFFER2",
  "34856": "DRAW_BUFFER3",
  "34857": "DRAW_BUFFER4",
  "34858": "DRAW_BUFFER5",
  "34859": "DRAW_BUFFER6",
  "34860": "DRAW_BUFFER7",
  "34861": "DRAW_BUFFER8",
  "34862": "DRAW_BUFFER9",
  "34863": "DRAW_BUFFER10",
  "34864": "DRAW_BUFFER11",
  "34865": "DRAW_BUFFER12",
  "34866": "DRAW_BUFFER13",
  "34867": "DRAW_BUFFER14",
  "34868": "DRAW_BUFFER15",
  "34877": "BLEND_EQUATION_ALPHA",
  "34892": "TEXTURE_COMPARE_MODE",
  "34893": "TEXTURE_COMPARE_FUNC",
  "34894": "COMPARE_REF_TO_TEXTURE",
  "34917": "CURRENT_QUERY",
  "34918": "QUERY_RESULT",
  "34919": "QUERY_RESULT_AVAILABLE",
  "34921": "MAX_VERTEX_ATTRIBS",
  "34922": "VERTEX_ATTRIB_ARRAY_NORMALIZED",
  "34930": "MAX_TEXTURE_IMAGE_UNITS",
  "34962": "ARRAY_BUFFER",
  "34963": "ELEMENT_ARRAY_BUFFER",
  "34964": "ARRAY_BUFFER_BINDING",
  "34965": "ELEMENT_ARRAY_BUFFER_BINDING",
  "34975": "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING",
  "35040": "STREAM_DRAW",
  "35041": "STREAM_READ",
  "35042": "STREAM_COPY",
  "35044": "STATIC_DRAW",
  "35045": "STATIC_READ",
  "35046": "STATIC_COPY",
  "35048": "DYNAMIC_DRAW",
  "35049": "DYNAMIC_READ",
  "35050": "DYNAMIC_COPY",
  "35051": "PIXEL_PACK_BUFFER",
  "35052": "PIXEL_UNPACK_BUFFER",
  "35053": "PIXEL_PACK_BUFFER_BINDING",
  "35055": "PIXEL_UNPACK_BUFFER_BINDING",
  "35056": "DEPTH24_STENCIL8",
  "35069": "VERTEX_ATTRIB_ARRAY_INTEGER",
  "35070": "VERTEX_ATTRIB_ARRAY_DIVISOR",
  "35071": "MAX_ARRAY_TEXTURE_LAYERS",
  "35076": "MIN_PROGRAM_TEXEL_OFFSET",
  "35077": "MAX_PROGRAM_TEXEL_OFFSET",
  "35097": "SAMPLER_BINDING",
  "35345": "UNIFORM_BUFFER",
  "35368": "UNIFORM_BUFFER_BINDING",
  "35369": "UNIFORM_BUFFER_START",
  "35370": "UNIFORM_BUFFER_SIZE",
  "35371": "MAX_VERTEX_UNIFORM_BLOCKS",
  "35373": "MAX_FRAGMENT_UNIFORM_BLOCKS",
  "35374": "MAX_COMBINED_UNIFORM_BLOCKS",
  "35375": "MAX_UNIFORM_BUFFER_BINDINGS",
  "35376": "MAX_UNIFORM_BLOCK_SIZE",
  "35377": "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",
  "35379": "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",
  "35380": "UNIFORM_BUFFER_OFFSET_ALIGNMENT",
  "35382": "ACTIVE_UNIFORM_BLOCKS",
  "35383": "UNIFORM_TYPE",
  "35384": "UNIFORM_SIZE",
  "35386": "UNIFORM_BLOCK_INDEX",
  "35387": "UNIFORM_OFFSET",
  "35388": "UNIFORM_ARRAY_STRIDE",
  "35389": "UNIFORM_MATRIX_STRIDE",
  "35390": "UNIFORM_IS_ROW_MAJOR",
  "35391": "UNIFORM_BLOCK_BINDING",
  "35392": "UNIFORM_BLOCK_DATA_SIZE",
  "35394": "UNIFORM_BLOCK_ACTIVE_UNIFORMS",
  "35395": "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES",
  "35396": "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER",
  "35398": "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER",
  "35632": "FRAGMENT_SHADER",
  "35633": "VERTEX_SHADER",
  "35657": "MAX_FRAGMENT_UNIFORM_COMPONENTS",
  "35658": "MAX_VERTEX_UNIFORM_COMPONENTS",
  "35659": "MAX_VARYING_COMPONENTS",
  "35660": "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
  "35661": "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
  "35663": "SHADER_TYPE",
  "35664": "FLOAT_VEC2",
  "35665": "FLOAT_VEC3",
  "35666": "FLOAT_VEC4",
  "35667": "INT_VEC2",
  "35668": "INT_VEC3",
  "35669": "INT_VEC4",
  "35670": "BOOL",
  "35671": "BOOL_VEC2",
  "35672": "BOOL_VEC3",
  "35673": "BOOL_VEC4",
  "35674": "FLOAT_MAT2",
  "35675": "FLOAT_MAT3",
  "35676": "FLOAT_MAT4",
  "35678": "SAMPLER_2D",
  "35679": "SAMPLER_3D",
  "35680": "SAMPLER_CUBE",
  "35682": "SAMPLER_2D_SHADOW",
  "35685": "FLOAT_MAT2x3",
  "35686": "FLOAT_MAT2x4",
  "35687": "FLOAT_MAT3x2",
  "35688": "FLOAT_MAT3x4",
  "35689": "FLOAT_MAT4x2",
  "35690": "FLOAT_MAT4x3",
  "35712": "DELETE_STATUS",
  "35713": "COMPILE_STATUS",
  "35714": "LINK_STATUS",
  "35715": "VALIDATE_STATUS",
  "35717": "ATTACHED_SHADERS",
  "35718": "ACTIVE_UNIFORMS",
  "35721": "ACTIVE_ATTRIBUTES",
  "35723": "FRAGMENT_SHADER_DERIVATIVE_HINT",
  "35724": "SHADING_LANGUAGE_VERSION",
  "35725": "CURRENT_PROGRAM",
  "35738": "IMPLEMENTATION_COLOR_READ_TYPE",
  "35739": "IMPLEMENTATION_COLOR_READ_FORMAT",
  "35863": "UNSIGNED_NORMALIZED",
  "35866": "TEXTURE_2D_ARRAY",
  "35869": "TEXTURE_BINDING_2D_ARRAY",
  "35887": "ANY_SAMPLES_PASSED",
  "35898": "R11F_G11F_B10F",
  "35899": "UNSIGNED_INT_10F_11F_11F_REV",
  "35901": "RGB9_E5",
  "35902": "UNSIGNED_INT_5_9_9_9_REV",
  "35904": "SRGB",
  "35905": "SRGB8",
  "35907": "SRGB8_ALPHA8",
  "35967": "TRANSFORM_FEEDBACK_BUFFER_MODE",
  "35968": "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",
  "35971": "TRANSFORM_FEEDBACK_VARYINGS",
  "35972": "TRANSFORM_FEEDBACK_BUFFER_START",
  "35973": "TRANSFORM_FEEDBACK_BUFFER_SIZE",
  "35976": "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN",
  "35977": "RASTERIZER_DISCARD",
  "35978": "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",
  "35979": "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",
  "35980": "INTERLEAVED_ATTRIBS",
  "35981": "SEPARATE_ATTRIBS",
  "35982": "TRANSFORM_FEEDBACK_BUFFER",
  "35983": "TRANSFORM_FEEDBACK_BUFFER_BINDING",
  "36003": "STENCIL_BACK_REF",
  "36004": "STENCIL_BACK_VALUE_MASK",
  "36005": "STENCIL_BACK_WRITEMASK",
  "36006": "FRAMEBUFFER_BINDING",
  "36007": "RENDERBUFFER_BINDING",
  "36008": "READ_FRAMEBUFFER",
  "36009": "DRAW_FRAMEBUFFER",
  "36010": "READ_FRAMEBUFFER_BINDING",
  "36011": "RENDERBUFFER_SAMPLES",
  "36012": "DEPTH_COMPONENT32F",
  "36013": "DEPTH32F_STENCIL8",
  "36048": "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE",
  "36049": "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME",
  "36050": "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL",
  "36051": "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",
  "36052": "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER",
  "36053": "FRAMEBUFFER_COMPLETE",
  "36054": "FRAMEBUFFER_INCOMPLETE_ATTACHMENT",
  "36055": "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT",
  "36057": "FRAMEBUFFER_INCOMPLETE_DIMENSIONS",
  "36061": "FRAMEBUFFER_UNSUPPORTED",
  "36063": "MAX_COLOR_ATTACHMENTS",
  "36064": "COLOR_ATTACHMENT0",
  "36065": "COLOR_ATTACHMENT1",
  "36066": "COLOR_ATTACHMENT2",
  "36067": "COLOR_ATTACHMENT3",
  "36068": "COLOR_ATTACHMENT4",
  "36069": "COLOR_ATTACHMENT5",
  "36070": "COLOR_ATTACHMENT6",
  "36071": "COLOR_ATTACHMENT7",
  "36072": "COLOR_ATTACHMENT8",
  "36073": "COLOR_ATTACHMENT9",
  "36074": "COLOR_ATTACHMENT10",
  "36075": "COLOR_ATTACHMENT11",
  "36076": "COLOR_ATTACHMENT12",
  "36077": "COLOR_ATTACHMENT13",
  "36078": "COLOR_ATTACHMENT14",
  "36079": "COLOR_ATTACHMENT15",
  "36096": "DEPTH_ATTACHMENT",
  "36128": "STENCIL_ATTACHMENT",
  "36160": "FRAMEBUFFER",
  "36161": "RENDERBUFFER",
  "36162": "RENDERBUFFER_WIDTH",
  "36163": "RENDERBUFFER_HEIGHT",
  "36164": "RENDERBUFFER_INTERNAL_FORMAT",
  "36168": "STENCIL_INDEX8",
  "36176": "RENDERBUFFER_RED_SIZE",
  "36177": "RENDERBUFFER_GREEN_SIZE",
  "36178": "RENDERBUFFER_BLUE_SIZE",
  "36179": "RENDERBUFFER_ALPHA_SIZE",
  "36180": "RENDERBUFFER_DEPTH_SIZE",
  "36181": "RENDERBUFFER_STENCIL_SIZE",
  "36182": "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE",
  "36183": "MAX_SAMPLES",
  "36194": "RGB565",
  "36202": "ANY_SAMPLES_PASSED_CONSERVATIVE",
  "36203": "MAX_ELEMENT_INDEX",
  "36208": "RGBA32UI",
  "36209": "RGB32UI",
  "36214": "RGBA16UI",
  "36215": "RGB16UI",
  "36220": "RGBA8UI",
  "36221": "RGB8UI",
  "36226": "RGBA32I",
  "36227": "RGB32I",
  "36232": "RGBA16I",
  "36233": "RGB16I",
  "36238": "RGBA8I",
  "36239": "RGB8I",
  "36244": "RED_INTEGER",
  "36248": "RGB_INTEGER",
  "36249": "RGBA_INTEGER",
  "36255": "INT_2_10_10_10_REV",
  "36269": "FLOAT_32_UNSIGNED_INT_24_8_REV",
  "36289": "SAMPLER_2D_ARRAY",
  "36292": "SAMPLER_2D_ARRAY_SHADOW",
  "36293": "SAMPLER_CUBE_SHADOW",
  "36294": "UNSIGNED_INT_VEC2",
  "36295": "UNSIGNED_INT_VEC3",
  "36296": "UNSIGNED_INT_VEC4",
  "36298": "INT_SAMPLER_2D",
  "36299": "INT_SAMPLER_3D",
  "36300": "INT_SAMPLER_CUBE",
  "36303": "INT_SAMPLER_2D_ARRAY",
  "36306": "UNSIGNED_INT_SAMPLER_2D",
  "36307": "UNSIGNED_INT_SAMPLER_3D",
  "36308": "UNSIGNED_INT_SAMPLER_CUBE",
  "36311": "UNSIGNED_INT_SAMPLER_2D_ARRAY",
  "36336": "LOW_FLOAT",
  "36337": "MEDIUM_FLOAT",
  "36338": "HIGH_FLOAT",
  "36339": "LOW_INT",
  "36340": "MEDIUM_INT",
  "36341": "HIGH_INT",
  "36347": "MAX_VERTEX_UNIFORM_VECTORS",
  "36348": "MAX_VARYING_VECTORS",
  "36349": "MAX_FRAGMENT_UNIFORM_VECTORS",
  "36386": "TRANSFORM_FEEDBACK",
  "36387": "TRANSFORM_FEEDBACK_PAUSED",
  "36388": "TRANSFORM_FEEDBACK_ACTIVE",
  "36389": "TRANSFORM_FEEDBACK_BINDING",
  "36662": "COPY_READ_BUFFER_BINDING",
  "36663": "COPY_WRITE_BUFFER_BINDING",
  "36756": "R8_SNORM",
  "36757": "RG8_SNORM",
  "36758": "RGB8_SNORM",
  "36759": "RGBA8_SNORM",
  "36764": "SIGNED_NORMALIZED",
  "36975": "RGB10_A2UI",
  "37137": "MAX_SERVER_WAIT_TIMEOUT",
  "37138": "OBJECT_TYPE",
  "37139": "SYNC_CONDITION",
  "37140": "SYNC_STATUS",
  "37141": "SYNC_FLAGS",
  "37142": "SYNC_FENCE",
  "37143": "SYNC_GPU_COMMANDS_COMPLETE",
  "37144": "UNSIGNALED",
  "37145": "SIGNALED",
  "37146": "ALREADY_SIGNALED",
  "37147": "TIMEOUT_EXPIRED",
  "37148": "CONDITION_SATISFIED",
  "37149": "WAIT_FAILED",
  "37154": "MAX_VERTEX_OUTPUT_COMPONENTS",
  "37157": "MAX_FRAGMENT_INPUT_COMPONENTS",
  "37167": "TEXTURE_IMMUTABLE_FORMAT",
  "37440": "UNPACK_FLIP_Y_WEBGL",
  "37441": "UNPACK_PREMULTIPLY_ALPHA_WEBGL",
  "37442": "CONTEXT_LOST_WEBGL",
  "37443": "UNPACK_COLORSPACE_CONVERSION_WEBGL",
  "37444": "BROWSER_DEFAULT_WEBGL",
  "37447": "MAX_CLIENT_WAIT_TIMEOUT_WEBGL",
  "4294967295": "INVALID_INDEX",
  "-1": "TIMEOUT_IGNORED"
};

// src/utils.ts
var textureEnum = {
  baseColorTexture: 0,
  metallicRoughnessTexture: 1,
  normalTexture: 2,
  occlusionTexture: 3,
  emissiveTexture: 4,
  irradianceTexture: 5,
  prefilterTexture: 6,
  brdfLUTTexture: 7,
  clearcoatTexture: 8,
  clearcoatRoughnessTexture: 9,
  clearcoatNormalTexture: 10,
  sheenColorTexture: 11,
  sheenRoughnessTexture: 12,
  Sheen_E: 13,
  transmissionTexture: 14,
  specularTexture: 15,
  specularColorTexture: 19,
  thicknessTexture: 16,
  iridescenceThicknessTexture: 17,
  charlieTexture: 18,
  diffuseTransmissionTexture: 20,
  diffuseTransmissionColorTexture: 21,
  anisotropyTexture: 22,
  iridescenceTexture: 23
};
function getDataType(type) {
  let count;
  switch (type) {
    case "MAT2":
      count = 4;
      break;
    case "MAT3":
      count = 9;
      break;
    case "MAT4":
      count = 16;
      break;
    case "VEC4":
      count = 4;
      break;
    case "VEC3":
      count = 3;
      break;
    case "VEC2":
      count = 2;
      break;
    case "SCALAR":
      count = 1;
      break;
  }
  return count;
}
function getCount(type) {
  let arr;
  switch (glEnum_default[type]) {
    case "BYTE":
    case "UNSIGNED_BYTE":
      arr = 1;
      break;
    case "SHORT":
    case "UNSIGNED_SHORT":
      arr = 2;
      break;
    case "UNSIGNED_INT":
    case "FLOAT":
      arr = 4;
      break;
  }
  return arr;
}
var ArrayBufferMap = /* @__PURE__ */ new Map();
ArrayBufferMap.set(Int8Array, "BYTE");
ArrayBufferMap.set(Uint8Array, "UNSIGNED_BYTE");
ArrayBufferMap.set(Int16Array, "SHORT");
ArrayBufferMap.set(Uint16Array, "UNSIGNED_SHORT");
ArrayBufferMap.set(Uint32Array, "UNSIGNED_INT");
ArrayBufferMap.set(Float32Array, "FLOAT");
function buildArrayWithStride(arrayBuffer, accessor, bufferView) {
  const sizeofComponent = getCount(accessor.componentType);
  const typeofComponent = getDataType(accessor.type);
  const offset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
  const stride = bufferView.byteStride;
  const lengthByStride = stride * accessor.count / sizeofComponent;
  const requiredLength = accessor.count * typeofComponent;
  let length = lengthByStride || requiredLength;
  if (arrayBuffer.byteLength < length * sizeofComponent + offset) {
    length -= accessor.byteOffset;
  }
  let arr;
  switch (glEnum_default[accessor.componentType]) {
    case "BYTE":
      arr = new Int8Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_BYTE":
      arr = new Uint8Array(arrayBuffer, offset, length);
      break;
    case "SHORT":
      arr = new Int16Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_SHORT":
      arr = new Uint16Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_INT":
      arr = new Uint32Array(arrayBuffer, offset, length);
      break;
    case "FLOAT":
      arr = new Float32Array(arrayBuffer, offset, length);
      break;
  }
  if (length !== requiredLength) {
    const ArrCtor = arr.constructor;
    const stridedArr = new ArrCtor(requiredLength);
    let j = 0;
    for (let i = 0; i < stridedArr.length; i += typeofComponent) {
      for (let k = 0; k < typeofComponent; k++) {
        stridedArr[i + k] = arr[j + k];
      }
      j += stride / sizeofComponent;
    }
    return stridedArr;
  } else {
    return arr;
  }
}
function buildArray(arrayBuffer, type, offset, length) {
  let arr;
  switch (glEnum_default[type]) {
    case "BYTE":
      arr = new Int8Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_BYTE":
      arr = new Uint8Array(arrayBuffer, offset, length);
      break;
    case "SHORT":
      arr = new Int16Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_SHORT":
      arr = new Uint16Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_INT":
      arr = new Uint32Array(arrayBuffer, offset, length);
      break;
    case "FLOAT":
      arr = new Float32Array(arrayBuffer, offset, length);
      break;
  }
  return arr;
}
function walk(node, callback) {
  function _walk(node2) {
    callback(node2);
    if (node2.children) {
      node2.children.forEach(_walk);
    }
  }
  _walk(node);
}
function canvasToWorld(vec2, projection, width, height) {
  const [x, y] = vec2;
  const newM = new Matrix4();
  newM.setTranslate(new Vector3([0, 0, 0.05]));
  const m = new Matrix4(projection);
  m.multiply(newM);
  const mp = m.multiplyVector4(new Vector4([0, 0, 0, 1]));
  mp.elements[0] = (2 * x / width - 1) * mp.elements[3];
  mp.elements[1] = (-2 * y / height + 1) * mp.elements[3];
  const v = m.invert().multiplyVector4(mp);
  return [v.elements[0], v.elements[1]];
}
function calculateProjection(cam) {
  const { aspect, zoom } = cam;
  let proj;
  if (cam.type === "perspective" && cam.perspective) {
    const { yfov } = cam.perspective;
    const f = 1 / Math.tan(yfov / 2);
    const nf = 1 / (cam.perspective.znear - cam.perspective.zfar);
    return new Matrix4().set([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      cam.perspective.zfar * nf,
      -1,
      0,
      0,
      cam.perspective.znear * cam.perspective.zfar * nf,
      0
    ]);
  } else if (cam.type === "orthographic" && cam.orthographic) {
    proj = new Matrix4().setOrtho(
      cam.orthographic.xmag * zoom,
      cam.orthographic.ymag * zoom,
      cam.orthographic.znear,
      cam.orthographic.zfar
    );
  }
  return proj;
}
function calculateOffset(a = 0, b = 0) {
  return a + b;
}
function calculateUVs(vertex, normal) {
  const UVS = new Float32Array(vertex.length / 3 * 2);
  const Min = new Vector2([Infinity, Infinity]);
  const Max = new Vector2([-Infinity, -Infinity]);
  for (let i = 0; i < vertex.length / 3; ++i) {
    const coords = [];
    const norm = [];
    for (let c = 0; c < 3; ++c) {
      coords.push(vertex[3 * i + c]);
      norm.push(normal[3 * i + c]);
    }
    const N = new Vector3(norm);
    const components = ["x", "y", "z"];
    components.sort((a, b) => {
      return Math.abs(N[a]) - Math.abs(N[b]);
    });
    const pos = new Vector3(coords);
    const u = pos[components[0]];
    const v = pos[components[1]];
    UVS[i * 2] = u;
    UVS[i * 2 + 1] = v;
    Max.x = Math.max(Max.x, u);
    Max.y = Math.max(Max.y, v);
    Min.x = Math.min(Min.x, u);
    Min.y = Math.min(Min.y, v);
  }
  const diff = new Vector2(Max.elements).subtract(Min);
  for (let i = 0; i < vertex.length / 3; ++i) {
    const ix = i * 2;
    UVS[ix] = (UVS[ix] - Min.x) / diff.x;
    UVS[ix + 1] = (UVS[ix + 1] - Min.y) / diff.y;
  }
  return UVS;
}
function calculateNormals2(vertex) {
  const ns = new Float32Array(vertex.length);
  for (let i = 0; i < vertex.length; i += 9) {
    const faceVertices = [
      new Vector3([vertex[i], vertex[i + 1], vertex[i + 2]]),
      new Vector3([vertex[i + 3], vertex[i + 4], vertex[i + 5]]),
      new Vector3([vertex[i + 6], vertex[i + 7], vertex[i + 8]])
    ];
    const dv1 = faceVertices[1].subtract(faceVertices[0]);
    const dv2 = faceVertices[2].subtract(faceVertices[0]);
    const n = Vector3.cross(dv1.normalize(), dv2.normalize());
    const [x, y, z] = n.elements;
    ns[i] = x;
    ns[i + 1] = y;
    ns[i + 2] = z;
    ns[i + 3] = x;
    ns[i + 4] = y;
    ns[i + 5] = z;
    ns[i + 6] = x;
    ns[i + 7] = y;
    ns[i + 8] = z;
  }
  return ns;
}
function calculateNormals(index, vertex) {
  const ns = new Float32Array(vertex.length / 3 * 3);
  for (let i = 0; i < index.length; i += 3) {
    const faceIndexes = [index[i], index[i + 1], index[i + 2]];
    const faceVertices = faceIndexes.map((ix) => vectorFromArray(vertex, ix));
    const dv1 = faceVertices[1].subtract(faceVertices[0]);
    const dv2 = faceVertices[2].subtract(faceVertices[0]);
    const n = Vector3.cross(dv1.normalize(), dv2.normalize());
    const [x, y, z] = n.elements;
    for (let j = 0; j < 3; j++) {
      ns[3 * index[i + j] + 0] = ns[3 * index[i + j] + 0] + x;
      ns[3 * index[i + j] + 1] = ns[3 * index[i + j] + 1] + y;
      ns[3 * index[i + j] + 2] = ns[3 * index[i + j] + 2] + z;
    }
  }
  return ns;
  function vectorFromArray(array, index2, elements = 3) {
    index2 = index2 * elements;
    return new Vector3([array[index2], array[index2 + 1], array[index2 + 2]]);
  }
}
function calculateBinormals(index, vertex, normal, uv) {
  const tangent = new Float32Array(normal.length / 3 * 4);
  for (let i = 0; i < index.length; i += 3) {
    const faceIndexes = [index[i], index[i + 1], index[i + 2]];
    const faceVertices = faceIndexes.map((ix) => vectorFromArray3(vertex, ix));
    const faceUVs = faceIndexes.map((ix) => vectorFromArray2(uv, ix));
    const dv1 = faceVertices[1].subtract(faceVertices[0]);
    const dv2 = faceVertices[2].subtract(faceVertices[0]);
    const duv1 = faceUVs[1].subtract(faceUVs[0]);
    const duv2 = faceUVs[2].subtract(faceUVs[0]);
    let r = duv1.elements[0] * duv2.elements[1] - duv1.elements[1] * duv2.elements[0];
    const sign = r > 0 ? 1 : -1;
    r = r !== 0 ? 1 / r : 1;
    const udir = new Vector3([
      (duv2.elements[1] * dv1.elements[0] - duv1.elements[1] * dv2.elements[0]) * r,
      (duv2.elements[1] * dv1.elements[1] - duv1.elements[1] * dv2.elements[1]) * r,
      (duv2.elements[1] * dv1.elements[2] - duv1.elements[1] * dv2.elements[2]) * r
    ]);
    udir.normalize();
    faceIndexes.forEach((ix) => {
      accumulateVectorInArray(tangent, ix, udir, sign);
    });
  }
  return tangent;
  function vectorFromArray3(array, index2) {
    index2 = index2 * 3;
    return new Vector3([array[index2], array[index2 + 1], array[index2 + 2]]);
  }
  function vectorFromArray2(array, index2) {
    index2 = index2 * 2;
    return new Vector2([array[index2], array[index2 + 1]]);
  }
  function accumulateVectorInArray(array, index2, vector, sign, elements = 4, accumulator = (acc, x) => acc + x) {
    index2 = index2 * elements;
    for (let i = 0; i < elements; ++i) {
      if (i === 3) {
        array[index2 + i] = sign;
      } else {
        array[index2 + i] = accumulator(array[index2 + i], vector.elements[i]);
      }
    }
  }
}
function getGlEnum(name) {
  return glEnum_default[name];
}
function normalize(array) {
  let fn;
  switch (true) {
    case array instanceof Uint8Array:
      fn = (c) => c / 255;
      break;
    case array instanceof Int8Array:
      fn = (c) => Math.max(c / 127, -1);
      break;
    case array instanceof Uint16Array:
      fn = (c) => c / 65535;
      break;
    case array instanceof Int16Array:
      fn = (c) => Math.max(c / 32767, -1);
      break;
  }
  if (fn) {
    const normalizedArray = new Float32Array(array.length);
    for (let i = 0; i < array.length; i++) {
      normalizedArray[i] = fn(array[i]);
    }
    return normalizedArray;
  } else {
    return array;
  }
}
function fanToTriListIndices(fan) {
  if (fan.length < 3) return new Uint32Array(0);
  const out = new Uint32Array((fan.length - 2) * 3);
  const [c] = fan;
  let o = 0;
  for (let i = 1; i < fan.length - 1; i++) {
    out[o++] = c;
    out[o++] = fan[i];
    out[o++] = fan[i + 1];
  }
  return out;
}
function convertLineLoopToLineList(loopIndices) {
  const n = loopIndices.length;
  const ListCtor = loopIndices.constructor;
  const listIndices = new ListCtor(n * 2);
  for (let i = 0; i < n; i++) {
    const curr = loopIndices[i];
    const next = loopIndices[(i + 1) % n];
    listIndices[i * 2] = curr;
    listIndices[i * 2 + 1] = next;
  }
  return listIndices;
}
function toFloat32Normalized(typedArray) {
  const ctor = typedArray.constructor;
  const { length } = typedArray;
  const out = new Float32Array(length);
  let scale, clampMin = -Infinity;
  switch (ctor) {
    case Uint8Array:
      scale = 1 / 255;
      break;
    case Uint16Array:
      scale = 1 / 65535;
      break;
    case Uint32Array:
      scale = 1 / 4294967295;
      break;
    case Int8Array:
      scale = 1 / 127;
      clampMin = -1;
      break;
    case Int16Array:
      scale = 1 / 32767;
      clampMin = -1;
      break;
    case Int32Array:
      scale = 1 / 2147483647;
      clampMin = -1;
      break;
    default:
      return typedArray;
  }
  for (let i = 0; i < length; i++) {
    let v = typedArray[i] * scale;
    if (v < clampMin) {
      v = clampMin;
    }
    out[i] = v;
  }
  return out;
}

// src/objects/mesh.ts
var Mesh = class extends Object3D {
  geometry;
  material;
  program;
  defines;
  mode;
  frontFace;
  distance;
  variants;
  order;
  uniformBindGroup1;
  pipeline;
  pipeline2;
  constructor(name, parent) {
    super(name, parent);
    this.program = null;
    this.defines = null;
    this.mode = 4;
    this.variants = [];
  }
  setDefines(defines) {
    this.defines = defines;
  }
  setBlend(value) {
    this.material.blend = value;
  }
  setMaterial(material) {
    this.material = material;
  }
  drawWebGPU(WebGPU, passEncoder, i, { renderState, materialStorage, transformsStorage }) {
    const { isprerefraction } = renderState;
    if (this.defines.find((i2) => i2.name === "TRANSMISSION") && isprerefraction) {
      return;
    }
    if (this.reflow) {
      transformsStorage.store.set(this.matrixWorld.elements, i * this.geometry.uniformBuffer.store.length);
      WebGPU.device.queue.writeBuffer(
        transformsStorage.bufferWebGPU,
        0,
        transformsStorage.store.buffer,
        transformsStorage.store.byteOffset,
        transformsStorage.store.byteLength
      );
    }
    if (this.repaint) {
      materialStorage.store.set(this.material.materialUniformBuffer.store, i * this.material.materialUniformBuffer.store.length);
      WebGPU.device.queue.writeBuffer(
        materialStorage.bufferWebGPU,
        0,
        materialStorage.store.buffer,
        materialStorage.store.byteOffset,
        materialStorage.store.byteLength
      );
    }
    if (this instanceof SkinnedMesh) {
      if (this.bones.some((bone) => bone.reflow)) {
        const jointMatrix = this.getJointMatrix();
        const matrices = new Float32Array(jointMatrix.length * 16);
        let i2 = 0;
        for (const j of jointMatrix) {
          matrices.set(j.elements, 0 + 16 * i2);
          i2++;
        }
        WebGPU.device.queue.writeBuffer(this.skinBuffer, 0, matrices.buffer, matrices.byteOffset, matrices.byteLength);
      }
    }
    passEncoder.setBindGroup(0, this.uniformBindGroup1);
    passEncoder.setVertexBuffer(0, this.geometry.verticesWebGPUBuffer);
    if (this.geometry.indicesBuffer) {
      passEncoder.setIndexBuffer(this.geometry.indicesWebGPUBuffer, "uint32");
      passEncoder.drawIndexed(this.geometry.indicesBuffer.length, this.instances, 0, 0, i);
    } else {
      passEncoder.draw(this.geometry.attributes.POSITION.length / 3, this.instances, 0, i);
    }
  }
  draw(gl, { lights, camera, needUpdateProjection, preDepthTexture, colorTexture, renderState, fakeDepth, isIBL, isDefaultLight }) {
    const texUnit = (n) => gl[`TEXTURE${n}`];
    const glTypeEnum = (ctor) => gl[ArrayBufferMap.get(ctor)];
    const { isprepender, isprerefraction } = renderState;
    if (this.defines.find((i) => i.name === "TRANSMISSION") && isprerefraction) {
      return;
    }
    gl.useProgram(this.program);
    gl.bindVertexArray(this.geometry.VAO);
    if (needUpdateProjection) {
      this.geometry.uniformBuffer.update(gl, "projection", camera.projection.elements);
    }
    this.geometry.uniformBuffer.update(gl, "isShadow", isprepender ? 1 : 0);
    if (this instanceof SkinnedMesh) {
      gl.bindBufferBase(gl.UNIFORM_BUFFER, 2, this.geometry.SKIN);
      if (this.bones.some((bone) => bone.reflow)) {
        const jointMatrix = this.getJointMatrix();
        const matrices = new Float32Array(jointMatrix.length * 16);
        let i = 0;
        for (const j of jointMatrix) {
          matrices.set(j.elements, 0 + 16 * i);
          i++;
        }
        gl.bufferSubData(gl.UNIFORM_BUFFER, 0, matrices);
      }
    }
    if (this.material.matrices.length) {
      gl.bindBufferBase(gl.UNIFORM_BUFFER, 8, this.material.textureMatricesUniform);
    }
    if (this.material.sphericalHarmonics) {
      gl.bindBufferBase(gl.UNIFORM_BUFFER, 7, this.material.sphericalHarmonics);
    }
    gl.uniform1i(this.material.uniforms.depthTexture, preDepthTexture && !isprepender ? preDepthTexture.index : fakeDepth.index);
    gl.uniform1i(this.material.uniforms.colorTexture, !isprerefraction ? colorTexture.index : fakeDepth.index);
    gl.uniform1f(this.material.uniforms.isTone, isprerefraction ? 0 : 1);
    gl.uniform1f(this.material.uniforms.isIBL, isIBL ? 1 : 0);
    gl.uniform1f(this.material.uniforms.isDefaultLight, isDefaultLight || lights.some((l) => !l.isInitial) ? 1 : 0);
    if (this.material.baseColorTexture) {
      gl.activeTexture(texUnit(0));
      gl.bindTexture(gl.TEXTURE_2D, this.material.baseColorTexture);
      gl.bindSampler(0, this.material.baseColorTexture.sampler);
    }
    if (this.material.metallicRoughnessTexture) {
      gl.activeTexture(texUnit(1));
      gl.bindTexture(gl.TEXTURE_2D, this.material.metallicRoughnessTexture);
      gl.bindSampler(1, this.material.metallicRoughnessTexture.sampler);
    }
    if (this.material.normalTexture) {
      gl.activeTexture(texUnit(2));
      gl.bindTexture(gl.TEXTURE_2D, this.material.normalTexture);
      gl.bindSampler(2, this.material.normalTexture.sampler);
    }
    if (this.material.occlusionTexture) {
      gl.activeTexture(texUnit(3));
      gl.bindTexture(gl.TEXTURE_2D, this.material.occlusionTexture);
      gl.bindSampler(3, this.material.occlusionTexture.sampler);
    }
    if (this.material.emissiveTexture) {
      gl.activeTexture(texUnit(4));
      gl.bindTexture(gl.TEXTURE_2D, this.material.emissiveTexture);
      gl.bindSampler(4, this.material.emissiveTexture.sampler);
    }
    if (this.material.clearcoatTexture) {
      gl.activeTexture(texUnit(8));
      gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatTexture);
      gl.bindSampler(8, this.material.clearcoatTexture.sampler);
    }
    if (this.material.clearcoatRoughnessTexture) {
      gl.activeTexture(texUnit(9));
      gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatRoughnessTexture);
      gl.bindSampler(9, this.material.clearcoatRoughnessTexture.sampler);
    }
    if (this.material.sheenColorTexture) {
      gl.activeTexture(texUnit(11));
      gl.bindTexture(gl.TEXTURE_2D, this.material.sheenColorTexture);
      gl.bindSampler(11, this.material.sheenColorTexture.sampler);
    }
    if (this.material.sheenRoughnessTexture) {
      gl.activeTexture(texUnit(12));
      gl.bindTexture(gl.TEXTURE_2D, this.material.sheenRoughnessTexture);
      gl.bindSampler(12, this.material.sheenRoughnessTexture.sampler);
    }
    if (this.material.iridescenceThicknessTexture) {
      gl.activeTexture(texUnit(17));
      gl.bindTexture(gl.TEXTURE_2D, this.material.iridescenceThicknessTexture);
      gl.bindSampler(17, this.material.iridescenceThicknessTexture.sampler);
    }
    if (this.material.iridescenceTexture) {
      gl.activeTexture(texUnit(23));
      gl.bindTexture(gl.TEXTURE_2D, this.material.iridescenceTexture);
      gl.bindSampler(23, this.material.iridescenceTexture.sampler);
    }
    if (this.material.diffuseTransmissionTexture) {
      gl.activeTexture(texUnit(20));
      gl.bindTexture(gl.TEXTURE_2D, this.material.diffuseTransmissionTexture);
      gl.bindSampler(20, this.material.diffuseTransmissionTexture.sampler);
    }
    if (this.material.diffuseTransmissionColorTexture) {
      gl.activeTexture(texUnit(21));
      gl.bindTexture(gl.TEXTURE_2D, this.material.diffuseTransmissionColorTexture);
      gl.bindSampler(21, this.material.diffuseTransmissionColorTexture.sampler);
    }
    if (this.material.anisotropyTexture) {
      gl.activeTexture(texUnit(22));
      gl.bindTexture(gl.TEXTURE_2D, this.material.anisotropyTexture);
      gl.bindSampler(22, this.material.anisotropyTexture.sampler);
    }
    if (this.material.clearcoatNormalTexture) {
      gl.activeTexture(texUnit(10));
      gl.bindTexture(gl.TEXTURE_2D, this.material.clearcoatNormalTexture);
      gl.bindSampler(10, this.material.clearcoatNormalTexture.sampler);
    }
    if (this.material.transmissionTexture) {
      gl.activeTexture(texUnit(14));
      gl.bindTexture(gl.TEXTURE_2D, this.material.transmissionTexture);
      gl.bindSampler(14, this.material.transmissionTexture.sampler);
    }
    if (this.material.specularTexture) {
      gl.activeTexture(texUnit(15));
      gl.bindTexture(gl.TEXTURE_2D, this.material.specularTexture);
      gl.bindSampler(15, this.material.specularTexture.sampler);
    }
    if (this.material.specularColorTexture) {
      gl.activeTexture(texUnit(19));
      gl.bindTexture(gl.TEXTURE_2D, this.material.specularColorTexture);
      gl.bindSampler(19, this.material.specularColorTexture.sampler);
    }
    if (this.material.thicknessTexture) {
      gl.activeTexture(texUnit(16));
      gl.bindTexture(gl.TEXTURE_2D, this.material.thicknessTexture);
      gl.bindSampler(16, this.material.thicknessTexture.sampler);
    }
    if (this.material.doubleSided) {
      gl.disable(gl.CULL_FACE);
    }
    if (this.frontFace) {
      gl.frontFace(gl.CW);
    }
    if (this.instances > 1) {
      gl.drawElementsInstanced(
        this.mode,
        this.geometry.indicesBuffer.length,
        glTypeEnum(this.geometry.indicesBuffer.constructor),
        0,
        this.instances
      );
    } else {
      if (this.geometry.indicesBuffer) {
        gl.drawElements(
          this.mode === 2 ? gl.LINES : this.mode,
          this.geometry.indicesBuffer.length,
          glTypeEnum(this.geometry.indicesBuffer.constructor),
          0
        );
      } else {
        gl.drawArrays(this.mode, 0, this.geometry.attributes.POSITION.length / 3);
      }
    }
    if (this.material.doubleSided) {
      gl.enable(gl.CULL_FACE);
    }
    if (this.frontFace) {
      gl.frontFace(gl.CCW);
    }
  }
  setGeometry(geometry) {
    this.geometry = geometry;
  }
  setProgram(value) {
    this.program = value;
  }
  setMode(value = 4) {
    this.mode = value;
  }
  setVariants(variants) {
    this.variants = variants;
  }
  setFrontFace() {
    this.frontFace = true;
    this.material.defines.push({ name: "FRONTFACE" });
  }
  isVisible(planes) {
    const c = new Vector3(this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
    const r = this.geometry.boundingSphere.radius * this.matrixWorld.getMaxScaleOnAxis();
    let dist;
    let visible = true;
    for (const p of planes) {
      dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
      if (dist < -r) {
        visible = false;
        break;
      }
    }
    this.distance = dist + r;
    return visible;
  }
  calculateBounding() {
    this.geometry.calculateBounding(this.matrixWorld);
    if (this.matrices.length) {
      for (const m of this.matrices) {
        this.geometry.calculateBounding(m);
      }
    }
  }
};
var SkinnedMesh = class extends Mesh {
  bones;
  boneInverses;
  skin;
  skinBuffer;
  constructor(name, parent) {
    super(name, parent);
  }
  setSkinWebGPU(WebGPU, skin) {
    this.bones = skin.bones;
    this.boneInverses = skin.boneInverses;
    const jointMatrix = this.getJointMatrix();
    const matrices = new Float32Array(jointMatrix.length * 16);
    let i = 0;
    for (const j of jointMatrix) {
      matrices.set(j.elements, 0 + 16 * i);
      i++;
    }
    const matrixSize = matrices.byteLength;
    const offset = 256;
    const uniformBufferSize = offset + matrixSize;
    const { device } = WebGPU;
    const uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.skinBuffer = uniformBuffer;
    const uniformBindGroup1 = {
      binding: 22,
      resource: uniformBuffer
    };
    device.queue.writeBuffer(uniformBuffer, 0, matrices.buffer, matrices.byteOffset, matrices.byteLength);
    return uniformBindGroup1;
  }
  setSkin(gl, skin) {
    this.bones = skin.bones;
    this.boneInverses = skin.boneInverses;
    const jointMatrix = this.getJointMatrix();
    const matrices = new Float32Array(jointMatrix.length * 16);
    let i = 0;
    for (const j of jointMatrix) {
      matrices.set(j.elements, 0 + 16 * i);
      i++;
    }
    const uIndex = gl.getUniformBlockIndex(this.program, "Skin");
    gl.uniformBlockBinding(this.program, uIndex, 2);
    const UBO = gl.createBuffer();
    gl.bindBuffer(gl.UNIFORM_BUFFER, UBO);
    gl.bufferData(gl.UNIFORM_BUFFER, matrices, gl.DYNAMIC_DRAW);
    this.geometry.SKIN = UBO;
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    return this;
  }
  getJointMatrix() {
    const m = new Matrix4(this.matrixWorld).invert();
    const resArray = [];
    for (let mi = 0; mi < this.boneInverses.length; mi++) {
      const res = new Matrix4().multiply(m).multiply(this.bones[mi].matrixWorld).multiply(this.boneInverses[mi]);
      resArray.push(res);
    }
    return resArray;
  }
};
var Bone = class extends Object3D {
};

// src/objects/camera.ts
function clamp(a, b, c) {
  return a < b ? b : a > c ? c : a;
}
var Camera = class extends Object3D {
  isInitial;
  props;
  matrixWorldInvert;
  projection;
  modelSize;
  modelXSize;
  modelYSize;
  yaw;
  pitch;
  matrixInitial;
  rotation;
  constructor(props, name, parent) {
    super(name, parent);
    this.matrixWorldInvert = new Matrix4();
    this.projection = new Matrix4();
    this.props = props;
    this.yaw = 0;
    this.pitch = -Math.PI;
    this.rotation = new Matrix4();
  }
  setProjection(matrix) {
    this.projection.set(matrix.elements);
  }
  setMatrixWorld(matrix) {
    super.setMatrixWorld(matrix);
    this.matrixWorldInvert.setInverseOf(this.matrixWorld);
    if (!this.matrixInitial) {
      this.matrixInitial = new Matrix4(this.matrixWorld);
    }
  }
  setZ(z) {
    this.matrix.elements[14] = z;
    this.matrixInitial = new Matrix4(this.matrix);
    this.setMatrixWorld(this.matrix.elements);
  }
  getViewProjMatrix() {
    const m = new Matrix4();
    m.multiply(this.projection);
    m.multiply(this.matrixWorldInvert);
    return m;
  }
  pan(coordsStart, coordsMove, width, height) {
    const coordsStartWorld = canvasToWorld(coordsStart, this.projection, width, height);
    const coordsMoveWorld = canvasToWorld(coordsMove, this.projection, width, height);
    const p0 = new Vector3([...coordsStartWorld, 0]);
    const p1 = new Vector3([...coordsMoveWorld, 0]);
    if (this.props.type === "orthographic") {
      const pan = 2 * this.matrixWorld.elements[14];
      const delta = p0.subtract(p1).scale(pan);
      this.matrixInitial.translate(delta.elements[0], delta.elements[1], 0);
    } else {
      const pan = 10 * this.matrixWorld.elements[14];
      const delta = p1.subtract(p0).scale(pan);
      this.matrixInitial.translate(delta.elements[0], delta.elements[1], 0);
    }
    const res = new Matrix4(this.rotation);
    res.multiply(this.matrixInitial);
    this.setMatrixWorld(res.elements);
  }
  rotate(coordsStart, coordsMove) {
    this.yaw += (coordsStart[0] - coordsMove[0]) * 0.01;
    this.pitch += (coordsStart[1] - coordsMove[1]) * 0.01;
    this.pitch = clamp(this.pitch, -1.5 * Math.PI, -0.5 * Math.PI);
    const m = new Matrix4();
    m.rotate(new Vector3([1, 0, 0]), this.pitch);
    m.rotate(new Vector3([0, 1, 0]), -this.yaw);
    m.rotate(new Vector3([1, 0, 0]), Math.PI);
    this.rotation = m;
    const res = new Matrix4(m);
    res.multiply(this.matrixInitial);
    this.setMatrixWorld(res.elements);
  }
  zoom(value) {
    if (this.matrixInitial.elements[14] > this.modelSize * 5 && value > 0) {
      return;
    }
    this.matrixInitial.elements[14] += value * this.modelSize * 1e-3;
    const m = new Matrix4(this.rotation);
    m.multiply(this.matrixInitial);
    this.setMatrixWorld(m.elements);
    this.updateNF();
  }
  updateNF() {
    if (this.props.isInitial) {
      const scale = Math.min(...this.matrixWorld.getScaling().elements);
      const modelSize = this.modelSize / scale;
      const cameraZ = Math.abs(this.matrixWorldInvert.elements[14]);
      const cameraProps = this.props.perspective || this.props.orthographic;
      cameraProps.znear = Math.max(cameraZ - modelSize, modelSize * 0.05);
      cameraProps.zfar = cameraZ + modelSize;
    }
    this.setProjection(calculateProjection(this.props));
  }
};

// src/objects/light.ts
var Light = class extends Object3D {
  matrixWorldInvert;
  type;
  color;
  intensity;
  isInitial;
  spot;
  range;
  constructor(props, name, parent) {
    super(name, parent);
    const { type, color = [1, 1, 1], intensity, isInitial, spot = {}, range = -1 } = props;
    this.type = type;
    this.color = new Vector3(color);
    this.intensity = intensity;
    this.isInitial = isInitial;
    this.spot = spot;
    this.range = range;
    this.matrixWorldInvert = new Matrix4();
  }
  setMatrixWorld(matrix) {
    super.setMatrixWorld(matrix);
    this.matrixWorldInvert.setInverseOf(this.matrixWorld);
  }
  setZ(z) {
    this.matrix.elements[13] = z;
    this.matrix.elements[14] = z;
    this.setMatrixWorld(this.matrix.elements);
  }
  update(v) {
    if (this.isInitial || this.type === "directional") {
      const camMatrix = new Matrix4();
      camMatrix.makeRotationAxis(new Vector3([0, 1, 0]), v);
      camMatrix.multiply(this.matrix);
      this.setMatrixWorld(camMatrix.elements);
    }
  }
};

// src/objects/uniform.ts
var UniformBuffer = class {
  offset;
  map;
  tempStore;
  store;
  bufferWebGPU;
  isTexture;
  constructor(isTexture = false) {
    this.map = /* @__PURE__ */ new Map();
    this.tempStore = {};
    this.offset = 0;
    this.isTexture = isTexture;
  }
  getBuffer(v) {
    const { length } = v;
    if (length === 3) {
      return new Float32Array([v[0], v[1], v[2], 0]);
    }
    if (length === 9) {
      return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0, v[6], v[7], v[8], 0]);
    }
    if (length === 12) {
      return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0, v[6], v[7], v[8], 0, v[9], v[10], v[11], 0]);
    }
    if (length === 6) {
      return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0]);
    }
    return v;
  }
  add(name, value) {
    if (value.length === void 0) {
      value = [value];
    }
    this.map.set(name, this.offset);
    const buffer = this.getBuffer(value);
    this.tempStore[name] = buffer;
    if (this.isTexture) {
      this.offset += Math.max(buffer.length, 4);
    } else {
      this.offset += buffer.length;
    }
  }
  update(gl, name, value, skip = false) {
    if (value.length === void 0) {
      value = new Float32Array([value]);
    }
    const offset = this.map.get(name);
    if (offset === void 0) {
      return;
    }
    const buffer = this.getBuffer(value);
    this.store.set(buffer, offset);
    if (skip) {
      return;
    }
    gl.bufferSubData(gl.UNIFORM_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT, buffer);
  }
  updateWebGPU(WebGPU, name, value, skip = false) {
    const { device } = WebGPU;
    if (value.length === void 0) {
      value = new Float32Array([value]);
    }
    const offset = this.map.get(name);
    if (offset === void 0) {
      return;
    }
    const buffer = this.getBuffer(value);
    this.store.set(buffer, offset);
    if (skip) {
      return;
    }
    device.queue.writeBuffer(
      this.bufferWebGPU,
      offset * Float32Array.BYTES_PER_ELEMENT,
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
  }
  done() {
    this.store = new Float32Array(this.offset);
    for (const [name, offset] of this.map) {
      this.store.set(this.tempStore[name], offset);
    }
    this.tempStore = null;
  }
};

// GLTF.ts
var Material = class {
  "name";
  "extensions";
  "extras";
  /**
   * A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology. When not specified, all the default values of `pbrMetallicRoughness` apply.
   */
  "pbrMetallicRoughness";
  /**
   * The normal map texture.
   */
  "normalTexture";
  /**
   * The occlusion map texture.
   */
  "occlusionTexture";
  /**
   * The emissive map texture.
   */
  "emissiveTexture";
  /**
   * The emissive color of the material.
   */
  "emissiveFactor";
  /**
   * The alpha rendering mode of the material.
   */
  "alphaMode";
  /**
   * The alpha cutoff value of the material.
   */
  "alphaCutoff";
  /**
   * Specifies whether the material is double sided.
   */
  "doubleSided";
};

// src/objects/material.ts
var defaultMaterial = {
  baseColorFactor: [1, 0, 0, 1]
};
var lightEnum = {
  directional: 0,
  point: 1,
  spot: 2
};
var Material2 = class extends Material {
  blend;
  uniforms;
  alpha;
  UBO;
  defines;
  matrices;
  uniformBuffer;
  lightPosUniform;
  lightColorUniform;
  spotdirUniform;
  lightIntensityUniform;
  textureMatricesUniform;
  matricesMap = /* @__PURE__ */ new Map();
  lights = [-1, -1, -1, -1];
  uniformBindGroup1;
  constructor(m = defaultMaterial, textures, defines) {
    super();
    const material = Object.assign({}, m);
    this.defines = defines;
    this.name = material.name;
    this.matrices = [];
    this.diffuseTransmissionColorFactor = [1, 1, 1];
    if (!material.pbrMetallicRoughness && material.extensions && material.extensions.KHR_materials_pbrSpecularGlossiness) {
      material.pbrMetallicRoughness = {};
      const SG = material.extensions.KHR_materials_pbrSpecularGlossiness;
      material.pbrMetallicRoughness.baseColorTexture = SG.diffuseTexture;
      material.pbrMetallicRoughness.metallicRoughnessTexture = SG.specularGlossinessTexture;
      material.pbrMetallicRoughness.baseColorFactor = SG.diffuseFactor;
      material.pbrMetallicRoughness.specularFactor = SG.specularFactor;
      material.pbrMetallicRoughness.glossinessFactor = SG.glossinessFactor;
      defines.push({ name: "SPECULARGLOSSINESSMAP" });
    }
    if (material.extensions && material.extensions.KHR_materials_clearcoat) {
      const cl = material.extensions.KHR_materials_clearcoat;
      this.clearcoatFactor = cl.clearcoatFactor;
      this.clearcoatRoughnessFactor = cl.clearcoatRoughnessFactor;
      defines.push({ name: "CLEARCOAT" });
      if (cl.clearcoatTexture) {
        const { extensions, texCoord } = cl.clearcoatTexture;
        this.clearcoatTexture = textures[cl.clearcoatTexture.index];
        defines.push({ name: "CLEARCOATMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("clearcoatTexture", this.buildTrans(ex, defines, "CLEARCOATMAP"));
          }
        }
      }
      if (cl.clearcoatNormalTexture) {
        const { extensions, texCoord } = cl.clearcoatNormalTexture;
        this.clearcoatNormalTexture = textures[cl.clearcoatNormalTexture.index];
        defines.push({ name: "CLEARCOATNORMALMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("clearcoatNormalTexture", this.buildTrans(ex, defines, "CLEARCOATNORMALMAP"));
          }
        }
      }
      if (cl.clearcoatRoughnessTexture) {
        const { extensions, texCoord } = cl.clearcoatRoughnessTexture;
        this.clearcoatRoughnessTexture = textures[cl.clearcoatRoughnessTexture.index];
        defines.push({ name: "CLEARCOATROUGHMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("clearcoatRoughnessTexture", this.buildTrans(ex, defines, "CLEARCOATROUGHMAP"));
          }
        }
      }
    }
    if (material.extensions && material.extensions.KHR_materials_sheen) {
      const { sheenColorTexture, sheenColorFactor, sheenRoughnessFactor, sheenRoughnessTexture } = material.extensions.KHR_materials_sheen;
      this.sheenColorFactor = sheenColorFactor;
      this.sheenRoughnessFactor = sheenRoughnessFactor;
      if (sheenColorTexture) {
        const { extensions, texCoord } = sheenColorTexture;
        this.sheenColorTexture = textures[sheenColorTexture.index];
        defines.push({ name: "SHEENMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("sheenColorTexture", this.buildTrans(ex, defines, "SHEENMAP"));
          }
        }
      }
      if (sheenRoughnessTexture) {
        const { extensions, texCoord } = sheenRoughnessTexture;
        this.sheenRoughnessTexture = textures[sheenRoughnessTexture.index];
        defines.push({ name: "SHEENROUGHNESSMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("sheenRoughnessTexture", this.buildTrans(ex, defines, "SHEENROUGHNESSMAP"));
          }
        }
      }
      defines.push({ name: "SHEEN" });
    }
    if (material.extensions && material.extensions.KHR_materials_transmission) {
      const { transmissionFactor, transmissionTexture } = material.extensions.KHR_materials_transmission;
      this.transmissionFactor = transmissionFactor;
      if (transmissionTexture) {
        const { extensions, texCoord } = transmissionTexture;
        this.transmissionTexture = textures[transmissionTexture.index];
        defines.push({ name: "TRANSMISSIONMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("transmissionTexture", this.buildTrans(ex, defines, "TRANSMISSIONMAP"));
          }
        }
      }
      defines.push({ name: "TRANSMISSION" });
    }
    if (material.extensions && material.extensions.KHR_materials_volume) {
      const { attenuationColor, attenuationDistance, thicknessFactor, thicknessTexture } = material.extensions.KHR_materials_volume;
      this.attenuationColor = attenuationColor;
      this.attenuationDistance = attenuationDistance;
      this.thicknessFactor = thicknessFactor;
      this.ior = 1.5;
      if (thicknessTexture) {
        const { extensions, texCoord } = thicknessTexture;
        this.thicknessTexture = textures[thicknessTexture.index];
        defines.push({ name: "THICKNESSMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("thicknessTexture", this.buildTrans(ex, defines, "THICKNESSMAP"));
          }
        }
      }
      defines.push({ name: "VOLUME" });
    }
    if (material.extensions && material.extensions.KHR_materials_emissive_strength) {
      const { emissiveStrength } = material.extensions.KHR_materials_emissive_strength;
      this.emissiveStrength = emissiveStrength;
    }
    if (material.extensions && material.extensions.KHR_materials_anisotropy) {
      const { anisotropyStrength, anisotropyRotation, anisotropyTexture } = material.extensions.KHR_materials_anisotropy;
      this.anisotropyStrength = anisotropyStrength;
      this.anisotropyRotation = anisotropyRotation;
      if (anisotropyTexture) {
        this.anisotropyTexture = textures[anisotropyTexture.index];
        defines.push({ name: "ANISOTROPYMAP", value: anisotropyTexture.texCoord ?? 0 });
        if (anisotropyTexture.extensions) {
          const ex = anisotropyTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("anisotropyTexture", this.buildTrans(ex, defines, "ANISOTROPYMAP"));
          }
        }
      }
      defines.push({ name: "ANISOTROPY" });
    }
    if (material.extensions && material.extensions.KHR_materials_dispersion) {
      const { dispersion } = material.extensions.KHR_materials_dispersion;
      this.dispersion = dispersion;
      defines.push({ name: "DISPERSION" });
    }
    if (material.extensions && material.extensions.KHR_materials_iridescence) {
      const {
        iridescenceTexture,
        iridescenceThicknessTexture,
        iridescenceFactor,
        iridescenceIor,
        iridescenceThicknessMaximum,
        iridescenceThicknessMinimum
      } = material.extensions.KHR_materials_iridescence;
      this.iridescenceFactor = iridescenceFactor;
      this.iridescenceIOR = iridescenceIor;
      this.iridescenceThicknessMaximum = iridescenceThicknessMaximum;
      this.iridescenceThicknessMinimum = iridescenceThicknessMinimum;
      if (iridescenceTexture) {
        this.iridescenceTexture = textures[iridescenceTexture.index];
        defines.push({ name: "IRIDESCENCE_COLOR", value: iridescenceTexture.texCoord ?? 0 });
        if (iridescenceTexture.extensions) {
          const ex = iridescenceTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("iridescenceTexture", this.buildTrans(ex, defines, "IRIDESCENCE_COLOR"));
          }
        }
      }
      if (iridescenceThicknessTexture) {
        this.iridescenceThicknessTexture = textures[iridescenceThicknessTexture.index];
        defines.push({ name: "IRIDESCENCEMAP", value: iridescenceThicknessTexture.texCoord ?? 0 });
        if (iridescenceThicknessTexture.extensions) {
          const ex = iridescenceThicknessTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("iridescenceThicknessTexture", this.buildTrans(ex, defines, "IRIDESCENCEMAP"));
          }
        }
      }
      defines.push({ name: "IRIDESCENCE" });
    }
    if (material.extensions && material.extensions.KHR_materials_diffuse_transmission) {
      const {
        diffuseTransmissionFactor,
        diffuseTransmissionTexture,
        diffuseTransmissionColorFactor,
        diffuseTransmissionColorTexture
      } = material.extensions.KHR_materials_diffuse_transmission;
      this.diffuseTransmissionFactor = diffuseTransmissionFactor;
      if (diffuseTransmissionTexture) {
        this.diffuseTransmissionTexture = textures[diffuseTransmissionTexture.index];
        defines.push({ name: "DIFFUSE_TRANSMISSION_MAP", value: diffuseTransmissionTexture.texCoord ?? 0 });
        if (diffuseTransmissionTexture.extensions) {
          const ex = diffuseTransmissionTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("diffuseTransmissionTexture", this.buildTrans(ex, defines, "DIFFUSE_TRANSMISSION_MAP"));
          }
        }
      }
      this.diffuseTransmissionColorFactor = diffuseTransmissionColorFactor ?? [1, 1, 1];
      if (diffuseTransmissionColorTexture) {
        this.diffuseTransmissionColorTexture = textures[diffuseTransmissionColorTexture.index];
        defines.push({ name: "DIFFUSE_TRANSMISSION_COLOR_MAP", value: diffuseTransmissionColorTexture.texCoord ?? 0 });
        if (diffuseTransmissionColorTexture.extensions) {
          const ex = diffuseTransmissionColorTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set(
              "diffuseTransmissionColorTexture",
              this.buildTrans(ex, defines, "DIFFUSE_TRANSMISSION_COLOR_MAP")
            );
          }
        }
      }
      defines.push({ name: "DIFFUSE_TRANSMISSION" });
    }
    if (material.extensions && material.extensions.KHR_materials_ior) {
      this.ior = material.extensions.KHR_materials_ior.ior;
      defines.push({ name: "IOR" });
    }
    if (material.extensions && material.extensions.KHR_materials_specular) {
      const { specularFactor, specularTexture, specularColorFactor, specularColorTexture } = material.extensions.KHR_materials_specular;
      this.specularFactor = [specularFactor ?? 1, 0, 0];
      this.specularColorFactor = specularColorFactor;
      if (specularTexture) {
        this.specularTexture = textures[specularTexture.index];
        defines.push({ name: "SPECULARMAP" });
        if (specularTexture.extensions) {
          const ex = specularTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("specularTexture", this.buildTrans(ex, defines, "SPECULARMAP"));
          }
        }
      }
      if (specularColorTexture) {
        this.specularColorTexture = textures[specularColorTexture.index];
        defines.push({ name: "SPECULARCOLORMAP" });
        if (specularColorTexture.extensions) {
          const ex = specularColorTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("specularColorTexture", this.buildTrans(ex, defines, "SPECULARCOLORMAP"));
          }
        }
      }
      defines.push({ name: "SPECULAR" });
    }
    this.uniforms = {
      baseColorTexture: null,
      metallicRoughnessTexture: null,
      normalTexture: null,
      occlusionTexture: null,
      clearcoatTexture: null,
      clearcoatRoughnessTexture: null,
      sheenRoughnessTexture: null,
      iridescenceThicknessTexture: null,
      iridescenceTexture: null,
      sheenColorTexture: null,
      clearcoatNormalTexture: null,
      emissiveTexture: null,
      prefilterMap: null,
      charlieMap: null,
      brdfLUT: null,
      irradianceMap: null,
      transmissionTexture: null,
      specularTexture: null,
      specularColorTexture: null,
      thicknessTexture: null,
      colorTexture: null,
      Sheen_E: null,
      depthTexture: null,
      diffuseTransmissionTexture: null,
      diffuseTransmissionColorTexture: null,
      anisotropyTexture: null,
      isTone: null,
      isIBL: null,
      isDefaultLight: null
    };
    const { pbrMetallicRoughness } = material;
    if (pbrMetallicRoughness) {
      this.baseColorFactor = pbrMetallicRoughness.baseColorFactor;
      this.roughnessFactor = pbrMetallicRoughness.roughnessFactor;
      this.metallicFactor = pbrMetallicRoughness.metallicFactor;
      if (pbrMetallicRoughness.specularFactor) {
        this.specularFactor = pbrMetallicRoughness.specularFactor;
      }
      if (pbrMetallicRoughness.glossinessFactor) {
        this.glossinessFactor = pbrMetallicRoughness.glossinessFactor;
      }
    }
    this.alpha = material.alphaMode === "BLEND";
    this.doubleSided = material.doubleSided;
    this.emissiveFactor = material.emissiveFactor;
    this.extras = material.extras;
    if (pbrMetallicRoughness && pbrMetallicRoughness.metallicRoughnessTexture) {
      const { extensions, texCoord } = pbrMetallicRoughness.metallicRoughnessTexture;
      this.metallicRoughnessTexture = textures[pbrMetallicRoughness.metallicRoughnessTexture.index];
      defines.push({ name: "METALROUGHNESSMAP", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.matricesMap.set("metallicRoughnessTexture", this.buildTrans(ex, defines, "METALROUGHNESSMAP"));
        }
      }
    }
    if (material.normalTexture) {
      const { extensions, texCoord, scale } = material.normalTexture;
      this.normalTexture = textures[material.normalTexture.index];
      this.normalTextureScale = scale;
      defines.push({ name: "NORMALMAP", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.normalTextureScale = void 0;
          this.matricesMap.set("normalTexture", this.buildTrans(ex, defines, "NORMALMAP"));
        }
      }
    }
    if (material.occlusionTexture) {
      const { extensions, texCoord } = material.occlusionTexture;
      this.occlusionTexture = textures[material.occlusionTexture.index];
      defines.push({ name: "OCCLUSIONMAP", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.matricesMap.set("occlusionTexture", this.buildTrans(ex, defines, "OCCLUSIONMAP"));
        }
      }
    }
    if (pbrMetallicRoughness && pbrMetallicRoughness.baseColorTexture) {
      const { extensions, texCoord } = pbrMetallicRoughness.baseColorTexture;
      this.baseColorTexture = textures[pbrMetallicRoughness.baseColorTexture.index];
      defines.push({ name: "BASECOLORTEXTURE", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.matricesMap.set("baseColorTexture", this.buildTrans(ex, defines, "BASECOLORTEXTURE"));
        }
      }
    }
    if (material.emissiveTexture) {
      const { extensions, texCoord } = material.emissiveTexture;
      this.emissiveTexture = textures[material.emissiveTexture.index];
      defines.push({ name: "EMISSIVEMAP", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.matricesMap.set("emissiveTexture", this.buildTrans(ex, defines, "EMISSIVEMAP"));
        }
      }
    }
    if (material.alphaMode === "MASK") {
      defines.push({
        name: "ALPHATEST",
        value: material.alphaCutoff ?? 0.5
      });
    } else if (material.alphaMode === "BLEND") {
      defines.push({ name: "ALPHATEST", value: 0.01 });
    }
    if (this.doubleSided) {
      defines.push({ name: "DOUBLESIDED" });
    }
    if (material.extensions && material.extensions.KHR_materials_unlit) {
      defines.push({ name: "NOLIGHT" });
    }
    if (this.matrices.length) {
      defines.push({ name: "MATRICES", value: this.matrices.length });
    }
  }
  buildTrans(ex, defines, name = "") {
    if (ex.offset !== void 0 || ex.scale !== void 0 || ex.rotation !== void 0) {
      const offset = ex.offset || [0, 0];
      const scale = ex.scale || [1, 1];
      const rotation = ex.rotation || 0;
      const i = this.matrices.push(new Matrix4().set([...offset, 0, 0, ...scale, 0, 0, rotation, 0, 0, 0, 0, 0, 0, 0])) - 1;
      defines.push({ name: `${name}_TEXTURE_TRANSFORM`, value: i });
      return i;
    }
  }
  setHarmonics(sphericalHarmonics) {
    this.sphericalHarmonics = sphericalHarmonics;
  }
  updateUniformsWebgl(gl, program) {
    gl.useProgram(program);
    this.uniforms.isTone = gl.getUniformLocation(program, "isTone");
    this.uniforms.isIBL = gl.getUniformLocation(program, "isIBL");
    this.uniforms.isDefaultLight = gl.getUniformLocation(program, "isDefaultLight");
    if (this.baseColorTexture) {
      this.uniforms.baseColorTexture = gl.getUniformLocation(program, "baseColorTexture");
      gl.uniform1i(this.uniforms.baseColorTexture, textureEnum.baseColorTexture);
    }
    if (this.metallicRoughnessTexture) {
      this.uniforms.metallicRoughnessTexture = gl.getUniformLocation(program, "metallicRoughnessTexture");
      gl.uniform1i(this.uniforms.metallicRoughnessTexture, textureEnum.metallicRoughnessTexture);
    }
    if (this.normalTexture) {
      this.uniforms.normalTexture = gl.getUniformLocation(program, "normalTexture");
      gl.uniform1i(this.uniforms.normalTexture, textureEnum.normalTexture);
    }
    if (this.occlusionTexture) {
      this.uniforms.occlusionTexture = gl.getUniformLocation(program, "occlusionTexture");
      gl.uniform1i(this.uniforms.occlusionTexture, textureEnum.occlusionTexture);
    }
    if (this.emissiveTexture) {
      this.uniforms.emissiveTexture = gl.getUniformLocation(program, "emissiveTexture");
      gl.uniform1i(this.uniforms.emissiveTexture, textureEnum.emissiveTexture);
    }
    if (this.clearcoatTexture) {
      this.uniforms.clearcoatTexture = gl.getUniformLocation(program, "clearcoatTexture");
      gl.uniform1i(this.uniforms.clearcoatTexture, textureEnum.clearcoatTexture);
    }
    if (this.clearcoatRoughnessTexture) {
      this.uniforms.clearcoatRoughnessTexture = gl.getUniformLocation(program, "clearcoatRoughnessTexture");
      gl.uniform1i(this.uniforms.clearcoatRoughnessTexture, textureEnum.clearcoatRoughnessTexture);
    }
    if (this.clearcoatNormalTexture) {
      this.uniforms.clearcoatNormalTexture = gl.getUniformLocation(program, "clearcoatNormalTexture");
      gl.uniform1i(this.uniforms.clearcoatNormalTexture, textureEnum.clearcoatNormalTexture);
    }
    if (this.sheenRoughnessTexture) {
      this.uniforms.sheenRoughnessTexture = gl.getUniformLocation(program, "sheenRoughnessTexture");
      gl.uniform1i(this.uniforms.sheenRoughnessTexture, textureEnum.sheenRoughnessTexture);
    }
    if (this.iridescenceThicknessTexture) {
      this.uniforms.iridescenceThicknessTexture = gl.getUniformLocation(program, "iridescenceThicknessTexture");
      gl.uniform1i(this.uniforms.iridescenceThicknessTexture, textureEnum.iridescenceThicknessTexture);
    }
    if (this.iridescenceTexture) {
      this.uniforms.iridescenceTexture = gl.getUniformLocation(program, "iridescenceTexture");
      gl.uniform1i(this.uniforms.iridescenceTexture, textureEnum.iridescenceTexture);
    }
    if (this.anisotropyTexture) {
      this.uniforms.anisotropyTexture = gl.getUniformLocation(program, "anisotropyTexture");
      gl.uniform1i(this.uniforms.anisotropyTexture, textureEnum.anisotropyTexture);
    }
    if (this.diffuseTransmissionColorTexture) {
      this.uniforms.diffuseTransmissionColorTexture = gl.getUniformLocation(program, "diffuseTransmissionColorTexture");
      gl.uniform1i(this.uniforms.diffuseTransmissionColorTexture, textureEnum.diffuseTransmissionColorTexture);
    }
    if (this.diffuseTransmissionTexture) {
      this.uniforms.diffuseTransmissionTexture = gl.getUniformLocation(program, "diffuseTransmissionTexture");
      gl.uniform1i(this.uniforms.diffuseTransmissionTexture, textureEnum.diffuseTransmissionTexture);
    }
    if (this.sheenColorTexture) {
      this.uniforms.sheenColorTexture = gl.getUniformLocation(program, "sheenColorTexture");
      gl.uniform1i(this.uniforms.sheenColorTexture, textureEnum.sheenColorTexture);
    }
    if (this.transmissionTexture) {
      this.uniforms.transmissionTexture = gl.getUniformLocation(program, "transmissionTexture");
      gl.uniform1i(this.uniforms.transmissionTexture, textureEnum.transmissionTexture);
    }
    if (this.specularTexture) {
      this.uniforms.specularTexture = gl.getUniformLocation(program, "specularTexture");
      gl.uniform1i(this.uniforms.specularTexture, textureEnum.specularTexture);
    }
    if (this.specularColorTexture) {
      this.uniforms.specularColorTexture = gl.getUniformLocation(program, "specularColorTexture");
      gl.uniform1i(this.uniforms.specularColorTexture, textureEnum.specularColorTexture);
    }
    if (this.thicknessTexture) {
      this.uniforms.thicknessTexture = gl.getUniformLocation(program, "thicknessTexture");
      gl.uniform1i(this.uniforms.thicknessTexture, textureEnum.thicknessTexture);
    }
    this.uniforms.prefilterMap = gl.getUniformLocation(program, "prefilterMap");
    this.uniforms.charlieMap = gl.getUniformLocation(program, "charlieMap");
    this.uniforms.brdfLUT = gl.getUniformLocation(program, "brdfLUT");
    this.uniforms.irradianceMap = gl.getUniformLocation(program, "irradianceMap");
    this.uniforms.depthTexture = gl.getUniformLocation(program, "depthTexture");
    this.uniforms.colorTexture = gl.getUniformLocation(program, "colorTexture");
    this.uniforms.Sheen_E = gl.getUniformLocation(program, "Sheen_E");
    gl.uniform1i(this.uniforms.prefilterMap, textureEnum.prefilterTexture);
    gl.uniform1i(this.uniforms.charlieMap, textureEnum.charlieTexture);
    gl.uniform1i(this.uniforms.brdfLUT, textureEnum.brdfLUTTexture);
    gl.uniform1i(this.uniforms.irradianceMap, textureEnum.irradianceTexture);
    gl.uniform1i(this.uniforms.Sheen_E, textureEnum.Sheen_E);
    {
      const mIndex = gl.getUniformBlockIndex(program, "LightColor");
      gl.uniformBlockBinding(program, mIndex, 4);
    }
    {
      const mIndex = gl.getUniformBlockIndex(program, "LightPos");
      gl.uniformBlockBinding(program, mIndex, 3);
    }
    {
      const mIndex = gl.getUniformBlockIndex(program, "Spotdir");
      gl.uniformBlockBinding(program, mIndex, 5);
    }
    {
      const mIndex = gl.getUniformBlockIndex(program, "LightIntensity");
      gl.uniformBlockBinding(program, mIndex, 6);
    }
    if (this.matrices.length) {
      const mIndex = gl.getUniformBlockIndex(program, "TextureMatrices");
      gl.uniformBlockBinding(program, mIndex, 8);
      const textureMatricesUniform = gl.createBuffer();
      gl.bindBuffer(gl.UNIFORM_BUFFER, textureMatricesUniform);
      gl.bufferData(gl.UNIFORM_BUFFER, this.textureMatricesBuffer.store, gl.STATIC_DRAW);
      this.textureMatricesUniform = textureMatricesUniform;
    }
  }
  createUniforms(isTexture, lights) {
    const spotDirs = new Float32Array(lights.length * 4);
    const lightPos = new Float32Array(lights.length * 4);
    const lightColor = new Float32Array(lights.length * 4);
    const lightProps = new Float32Array(lights.length * 4);
    const textureMatrices = new Float32Array(this.matrices.length * 16);
    lights.forEach((light, i) => {
      spotDirs.set(
        new Vector3([light.matrixWorld.elements[8], light.matrixWorld.elements[9], light.matrixWorld.elements[10]]).normalize().elements,
        i * 4
      );
      lightPos.set(light.getPosition(), i * 4);
      lightColor.set(light.color.elements, i * 4);
      lightProps.set(
        [light.intensity, light.spot.innerConeAngle ?? 0, light.spot.outerConeAngle ?? 0, lightEnum[light.type]],
        i * 4
      );
    });
    this.matrices.forEach((m, i) => {
      textureMatrices.set(m.elements, i * 16);
    });
    {
      const materialUniformBuffer = new UniformBuffer(isTexture);
      materialUniformBuffer.add("lights", [...this.lights]);
      materialUniformBuffer.add("iridescence", [
        this.iridescenceFactor ?? 0,
        this.iridescenceIOR ?? 1.3,
        this.iridescenceThicknessMaximum ?? 400,
        this.iridescenceThicknessMinimum ?? 100
      ]);
      materialUniformBuffer.add("diffuseTransmissionFactor", [
        this.diffuseTransmissionFactor ?? 0,
        ...this.diffuseTransmissionColorFactor
      ]);
      materialUniformBuffer.add("baseColorFactor", this.baseColorFactor ?? [0.8, 0.8, 0.8, 1]);
      materialUniformBuffer.add("specularColorFactor", this.specularColorFactor ?? [1, 1, 1]);
      materialUniformBuffer.add("emissiveFactor", this.emissiveFactor ?? [0, 0, 0]);
      materialUniformBuffer.add("sheenColorFactor", this.sheenColorFactor ?? [0, 0, 0]);
      materialUniformBuffer.add("attenuationColor", this.attenuationColor ?? [1, 1, 1]);
      materialUniformBuffer.add("specularFactor", this.specularFactor ?? [1, 0, 0]);
      materialUniformBuffer.add("anisotropy", [this.anisotropyStrength ?? 0, this.anisotropyRotation ?? 0]);
      materialUniformBuffer.add("glossinessFactor", this.glossinessFactor ?? 0.5);
      materialUniformBuffer.add("metallicFactor", this.metallicFactor ?? 1);
      materialUniformBuffer.add("roughnessFactor", this.roughnessFactor ?? 1);
      materialUniformBuffer.add("clearcoatFactor", this.clearcoatFactor ?? 0);
      materialUniformBuffer.add("clearcoatRoughnessFactor", this.clearcoatRoughnessFactor ?? 0);
      materialUniformBuffer.add("sheenRoughnessFactor", this.sheenRoughnessFactor ?? 0);
      materialUniformBuffer.add("transmissionFactor", this.transmissionFactor ?? 0);
      materialUniformBuffer.add("ior", this.ior ?? 1);
      materialUniformBuffer.add("normalTextureScale", this.normalTextureScale ?? 1);
      materialUniformBuffer.add("attenuationDistance", this.attenuationDistance ?? 1);
      materialUniformBuffer.add("thicknessFactor", this.thicknessFactor ?? 0);
      materialUniformBuffer.add("emissiveStrength", this.emissiveStrength ?? 1);
      materialUniformBuffer.add("dispersionFactor", [this.dispersion ?? 0]);
      materialUniformBuffer.add("bulk", 0);
      materialUniformBuffer.done();
      if (materialUniformBuffer.store.byteLength % 16 !== 0) {
        throw new Error("Material uniform buffer length must be multiple of 16");
      }
      this.materialUniformBuffer = materialUniformBuffer;
    }
    if (this.matrices.length) {
      const materialUniformBuffer = new UniformBuffer();
      materialUniformBuffer.add("textureMatrices", textureMatrices);
      materialUniformBuffer.done();
      this.textureMatricesBuffer = materialUniformBuffer;
    }
  }
  updateUniformsWebGPU(WebGPU) {
    const { device, nearestSampler, linearSampler } = WebGPU;
    let uniformBuffer6;
    if (this.textureMatricesBuffer) {
      uniformBuffer6 = device.createBuffer({
        size: 256 + this.textureMatricesBuffer.store.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      this.textureMatricesBuffer.bufferWebGPU = uniformBuffer6;
    }
    const sampler = this.baseColorTexture ? this.baseColorTexture.sampler : linearSampler;
    const uniformBindGroup1 = [
      {
        binding: 2,
        resource: sampler
      },
      {
        binding: 37,
        resource: nearestSampler
      },
      {
        binding: 24,
        resource: linearSampler
      },
      {
        binding: 3,
        resource: this.baseColorTexture?.view
      },
      {
        binding: 4,
        resource: this.metallicRoughnessTexture?.view
      },
      {
        binding: 5,
        resource: this.normalTexture?.view
      },
      {
        binding: 6,
        resource: this.emissiveTexture?.view
      },
      {
        binding: 7,
        resource: this.occlusionTexture?.view
      },
      {
        binding: 8,
        resource: this.clearcoatTexture?.view
      },
      {
        binding: 9,
        resource: this.clearcoatRoughnessTexture?.view
      },
      {
        binding: 10,
        resource: this.transmissionTexture?.view
      },
      {
        binding: 11,
        resource: this.sheenColorTexture?.view
      },
      {
        binding: 12,
        resource: this.sheenRoughnessTexture?.view
      },
      {
        binding: 13,
        resource: this.clearcoatNormalTexture?.view
      },
      {
        binding: 14,
        resource: this.specularTexture?.view
      },
      {
        binding: 29,
        resource: this.thicknessTexture?.view
      },
      {
        binding: 31,
        resource: this.anisotropyTexture?.view
      },
      {
        binding: 32,
        resource: this.iridescenceThicknessTexture?.view
      },
      {
        binding: 38,
        resource: this.iridescenceTexture?.view
      },
      {
        binding: 33,
        resource: this.specularColorTexture?.view
      },
      {
        binding: 34,
        resource: this.diffuseTransmissionTexture?.view
      },
      {
        binding: 36,
        resource: this.diffuseTransmissionColorTexture?.view
      },
      {
        binding: 23,
        resource: this.textureMatricesBuffer && uniformBuffer6
      }
    ];
    if (this.textureMatricesBuffer) {
      device.queue.writeBuffer(
        uniformBuffer6,
        0,
        this.textureMatricesBuffer.store.buffer,
        this.textureMatricesBuffer.store.byteOffset,
        this.textureMatricesBuffer.store.byteLength
      );
    }
    this.uniformBindGroup1 = uniformBindGroup1.filter((r) => r.resource);
  }
  hasNormal() {
    return Boolean(this.normalTexture) || Boolean(this.clearcoatNormalTexture);
  }
  setColor(gl, name, value) {
    this.materialUniformBuffer.update(gl, name, value.elements, true);
  }
  setTexture(gl, name, type, value) {
    gl.bindBufferBase(gl.UNIFORM_BUFFER, 8, this.textureMatricesUniform);
    const i = this.matricesMap.get(name) * 16;
    const [e0, e1] = value.elements;
    if (type === "offset") {
      this.textureMatricesBuffer.store[i] = e0;
      this.textureMatricesBuffer.store[i + 1] = e1;
    }
    if (type === "scale") {
      this.textureMatricesBuffer.store[i + 4] = e0;
      this.textureMatricesBuffer.store[i + 5] = e1;
    }
    if (type === "rotation") {
      this.textureMatricesBuffer.store[i + 8] = e0;
    }
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.textureMatricesBuffer.store);
  }
  setTextureWebGPU(WebGPU, name, type, value) {
    const i = this.matricesMap.get(name) * 16;
    const [e0, e1] = value.elements;
    if (type === "offset") {
      this.textureMatricesBuffer.store[i] = e0;
      this.textureMatricesBuffer.store[i + 1] = e1;
    }
    if (type === "scale") {
      this.textureMatricesBuffer.store[i + 4] = e0;
      this.textureMatricesBuffer.store[i + 5] = e1;
    }
    if (type === "rotation") {
      this.textureMatricesBuffer.store[i + 8] = e0;
    }
    WebGPU.device.queue.writeBuffer(
      this.textureMatricesBuffer.bufferWebGPU,
      0,
      this.textureMatricesBuffer.store.buffer,
      this.textureMatricesBuffer.store.byteOffset,
      this.textureMatricesBuffer.store.byteLength
    );
  }
  setColorWebGPU(WebGPU, name, value) {
    this.materialUniformBuffer.updateWebGPU(WebGPU, name, value.elements, true);
  }
};

// src/fetch.ts
var basisModulePromise;
function loadBasisModule() {
  if (!basisModulePromise) {
    basisModulePromise = Promise.resolve().then(() => (init_basis_transcoder(), basis_transcoder_exports)).then(async () => {
      const module2 = await globalThis.BASIS({ locateFile: (path) => path });
      module2.initializeBasis();
      return module2;
    });
  }
  return basisModulePromise;
}
function transcodeKTX2(module2, buffer, format) {
  const ktx2File = new module2.KTX2File(new Uint8Array(buffer));
  if (!ktx2File.isValid()) {
    ktx2File.close();
    ktx2File.delete();
    throw new Error("Texture is not a valid KTX2 file");
  }
  const width = ktx2File.getWidth();
  const height = ktx2File.getHeight();
  if (!ktx2File.startTranscoding()) {
    ktx2File.close();
    ktx2File.delete();
    throw new Error("KTX2 transcoding failed to start");
  }
  const targetFormat = format.transcoderFormat.value;
  const sizeBytes = ktx2File.getImageTranscodedSizeInBytes(0, 0, 0, targetFormat);
  const data = new Uint8Array(sizeBytes);
  const ok = ktx2File.transcodeImage(data, 0, 0, 0, targetFormat, 0, -1, -1);
  ktx2File.close();
  ktx2File.delete();
  if (!ok) {
    throw new Error("KTX2 image transcode failed");
  }
  return { data, width, height, format };
}
function fetchJSON(url) {
  return fetch(url).then((r) => r.json());
}
function fetchBinary(url) {
  return fetch(url).then((r) => r.arrayBuffer());
}
function fetchImage(isbitmap, s, { bufferView, mimeType, uri }, { url, name }, sampler, ktx2Format) {
  if (typeof window !== "undefined") {
    return new Promise((resolve, reject) => {
      if (mimeType === "image/ktx2") {
        Promise.all([loadBasisModule(), window.fetch(url).then((r) => r.arrayBuffer())]).then(([module2, buffer]) => {
          resolve({
            sampler,
            mimeType,
            name,
            image: transcodeKTX2(module2, buffer, ktx2Format)
          });
        }).catch(reject);
      } else {
        const image = new Image();
        image.onload = () => {
          if (isbitmap) {
            createImageBitmap(image, { premultiplyAlpha: "none", colorSpaceConversion: "none" }).then((bitmap) => {
              resolve({
                sampler,
                name,
                image: bitmap
              });
            });
          } else {
            resolve({
              sampler,
              name,
              image
            });
          }
        };
        image.onerror = () => {
          reject(new Error("Cant load texture"));
        };
        image.crossOrigin = "anonymous";
        if (bufferView !== void 0) {
          const view = s.json.bufferViews[bufferView];
          const buffer = new Uint8Array(s.arrayBuffer[view.buffer], view.byteOffset, view.byteLength);
          const blob = new Blob([buffer], { type: mimeType });
          image.src = URL.createObjectURL(blob);
        } else if (/base64/.test(uri)) {
          image.src = uri;
        } else {
          image.src = url;
        }
      }
    });
  } else {
    return fetch(url).then((r) => r.arrayBuffer()).then((b) => ({
      sampler,
      mimeType,
      name,
      image: b
    }));
  }
}

// src/parseLoader.ts
var BASE64_MARKER = ";base64,";
function getJson(input, output) {
  if (/glb/.test(input.url)) {
    return fetchBinary(input.url).then((b) => {
      const decoder = new TextDecoder("utf-8");
      const [jsonLength] = new Uint32Array(b, 12, 1);
      const jsonBuffer = new Uint8Array(b, 20, jsonLength);
      const json = JSON.parse(decoder.decode(jsonBuffer));
      const [bufferLength] = new Uint32Array(b, 20 + jsonLength, 1);
      const buffer = b.slice(28 + jsonLength, 28 + jsonLength + bufferLength);
      output.json = json;
      input.scene.bin.push(buffer);
    });
  } else {
    return fetchJSON(input.url).then((json) => {
      for (const key in json.buffers) {
        input.scene.bin.push(json.buffers[Number(key)].uri);
      }
      output.json = json;
      return true;
    });
  }
}
function getBuffer(input, output) {
  return Promise.all(
    input.scene.bin.map((url) => {
      if (typeof url === "string") {
        if (/base64/.test(url)) {
          const base64Index = url.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
          const base64 = url.substring(base64Index);
          const raw = window.atob(base64);
          const buffer = new ArrayBuffer(raw.length);
          const array = new Uint8Array(buffer);
          for (let i = 0; i < raw.length; i++) {
            array[i] = raw.charCodeAt(i);
          }
          return buffer;
        } else {
          return fetchBinary(`${input.host}${url}`);
        }
      } else {
        return Promise.resolve(url);
      }
    })
  ).then((buffers) => {
    output.arrayBuffer = buffers;
  });
}

// src/decoder.ts
var decoderModule;
var DecoderModule = () => new Promise((resolve) => {
  const dracoDecoderType = {
    onModuleLoaded(module2) {
      decoderModule = module2;
      resolve(decoderModule);
    }
  };
  Promise.resolve().then(() => __toESM(require_draco3d(), 1)).then((m) => {
    m.createDecoderModule(dracoDecoderType);
  });
});
function decodeDracoData(rawBuffer, decoder, offset, length) {
  const buffer = new decoderModule.DecoderBuffer();
  buffer.Init(new Int8Array(rawBuffer, offset, length), rawBuffer.byteLength);
  const dracoGeometry = new decoderModule.Mesh();
  decoder.DecodeBufferToMesh(buffer, dracoGeometry);
  decoderModule.destroy(buffer);
  return dracoGeometry;
}
function getArray(type, length, decodedGeometry, attribute, decoder) {
  let arr;
  let dracoArr;
  switch (type) {
    case "BYTE":
      arr = new Int8Array(length);
      arr.type = "BYTE";
      dracoArr = new decoderModule.DracoInt8Array();
      if (decodedGeometry) {
        decoder.GetAttributeInt8ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "UNSIGNED_BYTE":
      arr = new Uint8Array(length);
      arr.type = "UNSIGNED_BYTE";
      dracoArr = new decoderModule.DracoUInt8Array();
      if (decodedGeometry) {
        decoder.GetAttributeUInt8ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "SHORT":
      arr = new Int16Array(length);
      arr.type = "SHORT";
      dracoArr = new decoderModule.DracoInt16Array();
      if (decodedGeometry) {
        decoder.GetAttributeInt16ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "UNSIGNED_SHORT":
      arr = new Uint16Array(length);
      arr.type = "UNSIGNED_SHORT";
      dracoArr = new decoderModule.DracoUInt16Array();
      if (decodedGeometry) {
        decoder.GetAttributeUInt16ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "UNSIGNED_INT":
      arr = new Uint32Array(length);
      arr.type = "UNSIGNED_INT";
      dracoArr = new decoderModule.DracoUInt32Array();
      if (decodedGeometry) {
        decoder.GetAttributeUInt32ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "FLOAT":
      arr = new Float32Array(length);
      arr.type = "FLOAT";
      dracoArr = new decoderModule.DracoFloat32Array();
      if (decodedGeometry) {
        decoder.GetAttributeFloatForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
  }
  return [dracoArr, arr];
}

// src/objects/geometry.ts
var GeometryEnum = {
  POSITION: [0, 3],
  TEXCOORD_0: [2, 2],
  NORMAL: [1, 3],
  TANGENT: [3, 4],
  JOINTS_0: [4, 4],
  WEIGHTS_0: [5, 4],
  COLOR_0: [6, 4],
  TEXCOORD_1: [7, 2],
  TEXCOORD_2: [8, 2]
};
var Geometry = class {
  UBO;
  VAO;
  uniformBuffer;
  indicesBuffer;
  attributes;
  targets;
  blend;
  uniforms;
  SKIN;
  boundingSphere;
  vertexAccessor;
  indexType;
  cubeVertexSize;
  VBO;
  indicesWebGPUBuffer;
  verticesWebGPUBuffer;
  uniformBindGroup1;
  g;
  constructor(json, arrayBuffer, weights, draco, primitive) {
    this.boundingSphere = {
      center: new Vector3(),
      radius: null,
      min: new Vector3([Infinity, Infinity, Infinity]),
      max: new Vector3([-Infinity, -Infinity, -Infinity])
    };
    this.uniformBuffer = null;
    this.UBO = null;
    this.VAO = null;
    this.blend = null;
    this.uniforms = null;
    this.SKIN = null;
    this.targets = [];
    let indicesBuffer;
    const vertexBuffers = {};
    const indicesAccessor = primitive.indices !== void 0 ? json.accessors[primitive.indices] : void 0;
    this.indexType = indicesAccessor?.componentType;
    const vertexAccessor = /* @__PURE__ */ new Map();
    for (const a in primitive.attributes) {
      vertexAccessor.set(a, json.accessors[primitive.attributes[a]]);
    }
    const boundingBox = {
      min: vertexAccessor.get("POSITION").min,
      max: vertexAccessor.get("POSITION").max
    };
    const compresedMesh = primitive.extensions && primitive.extensions.KHR_draco_mesh_compression;
    if (compresedMesh) {
      const bufferView = json.bufferViews[compresedMesh.bufferView];
      const decoder = new draco.Decoder();
      const decodedGeometry = decodeDracoData(arrayBuffer[bufferView.buffer], decoder, bufferView.byteOffset, bufferView.byteLength);
      const numFaces = decodedGeometry.num_faces();
      const numPoints = decodedGeometry.num_points();
      for (const k of vertexAccessor.keys()) {
        const attribute = decoder.GetAttributeByUniqueId(decodedGeometry, compresedMesh.attributes[k]);
        const size = getDataType(vertexAccessor.get(k).type);
        const [dracoArr, arr] = getArray(
          getGlEnum(vertexAccessor.get(k).componentType),
          numPoints * size,
          decodedGeometry,
          attribute,
          decoder
        );
        for (let i = 0; i < numPoints * size; i += size) {
          arr[i] = dracoArr.GetValue(i);
          arr[i + 1] = dracoArr.GetValue(i + 1);
          if (size > 2) {
            arr[i + 2] = dracoArr.GetValue(i + 2);
          }
          if (size > 3) {
            arr[i + 3] = dracoArr.GetValue(i + 3);
          }
        }
        draco.destroy(dracoArr);
        vertexBuffers[k] = arr;
      }
      {
        const indices = new Uint32Array(numFaces * 3);
        indices.type = "UNSIGNED_INT";
        const ia = new draco.DracoUInt32Array();
        for (let i = 0; i < numFaces; ++i) {
          decoder.GetFaceFromMesh(decodedGeometry, i, ia);
          const index = i * 3;
          indices[index] = ia.GetValue(0);
          indices[index + 1] = ia.GetValue(1);
          indices[index + 2] = ia.GetValue(2);
        }
        draco.destroy(ia);
        indicesBuffer = indices;
      }
      draco.destroy(decoder);
      draco.destroy(decodedGeometry);
    } else {
      if (indicesAccessor) {
        const bufferView = json.bufferViews[indicesAccessor.bufferView];
        indicesBuffer = buildArray(
          arrayBuffer[bufferView.buffer],
          indicesAccessor.componentType,
          calculateOffset(bufferView.byteOffset, indicesAccessor.byteOffset),
          getDataType(indicesAccessor.type) * indicesAccessor.count
        );
        if (primitive.mode === 6) {
          indicesBuffer = fanToTriListIndices(indicesBuffer);
        }
        if (primitive.mode === 2) {
          indicesBuffer = convertLineLoopToLineList(indicesBuffer);
        }
      }
      for (const k of vertexAccessor.keys()) {
        const accessor = vertexAccessor.get(k);
        const bufferView = json.bufferViews[accessor.bufferView];
        vertexBuffers[k] = buildArrayWithStride(arrayBuffer[bufferView.buffer], accessor, bufferView);
      }
    }
    if (primitive.targets) {
      for (const target of primitive.targets) {
        const vertexAcc = {};
        const accessors = {};
        for (const a in target) {
          accessors[a] = json.accessors[target[a]];
          const accessor = accessors[a];
          const bufferView = json.bufferViews[accessor.bufferView];
          vertexAcc[a] = buildArrayWithStride(arrayBuffer[bufferView.buffer], accessor, bufferView);
        }
        this.targets.push(vertexAcc);
      }
      for (const k of vertexAccessor.keys()) {
        if (this.targets[0][k]) {
          let offset = 0;
          const geometry = vertexBuffers[k];
          const GeometryCtor = geometry.constructor;
          vertexBuffers[k] = new GeometryCtor(geometry.length);
          for (let i = 0; i < vertexBuffers[k].length; i++) {
            if (k === "TANGENT" && (i + 1) % 4 === 0) {
              offset++;
              continue;
            }
            vertexBuffers[k][i] = geometry[i] + weights.reduce((a, b, index) => {
              return a + weights[index] * this.targets[index][k][i - offset];
            }, 0);
          }
        }
      }
    }
    for (const k of vertexAccessor.keys()) {
      const accessor = vertexAccessor.get(k);
      if (k === "COLOR_0" && accessor.type === "VEC3") {
        const ColorCtor = vertexBuffers[k].constructor;
        const temp = new ColorCtor(accessor.count * 4);
        let j = 0;
        for (let i = 0; i < temp.length; i++) {
          if ((i + 1) % 4 === 0) {
            temp[i] = 1;
          } else {
            temp[i] = vertexBuffers[k][j];
            j++;
          }
        }
        vertexBuffers[k] = temp;
      }
      if (accessor.sparse !== void 0) {
        const itemSize = getDataType(accessor.type);
        const indicesBufferView = json.bufferViews[accessor.sparse.indices.bufferView];
        const valuesBufferView = json.bufferViews[accessor.sparse.values.bufferView];
        const sparseIndices = buildArray(
          arrayBuffer[indicesBufferView.buffer],
          accessor.sparse.indices.componentType,
          calculateOffset(indicesBufferView.byteOffset, accessor.sparse.indices.byteOffset),
          accessor.sparse.count
        );
        const sparseValues = buildArray(
          arrayBuffer[valuesBufferView.buffer],
          accessor.componentType,
          calculateOffset(valuesBufferView.byteOffset, accessor.byteOffset),
          getDataType(accessor.type) * accessor.sparse.count
        );
        for (let i = 0, il = sparseIndices.length; i < il; i++) {
          const index = sparseIndices[i];
          vertexBuffers[k][index * itemSize] = sparseValues[i * itemSize];
          if (itemSize >= 2) {
            vertexBuffers[k][index * itemSize + 1] = sparseValues[i * itemSize + 1];
          }
          if (itemSize >= 3) {
            vertexBuffers[k][index * itemSize + 2] = sparseValues[i * itemSize + 2];
          }
          if (itemSize >= 4) {
            vertexBuffers[k][index * itemSize + 3] = sparseValues[i * itemSize + 3];
          }
        }
      }
    }
    if (vertexBuffers.NORMAL === void 0 && indicesBuffer) {
      vertexBuffers.NORMAL = calculateNormals(indicesBuffer, vertexBuffers.POSITION);
      vertexAccessor.set("NORMAL", { componentType: 5126 });
    }
    if (vertexBuffers.NORMAL === void 0 && indicesBuffer === void 0) {
      vertexBuffers.NORMAL = calculateNormals2(vertexBuffers.POSITION);
      vertexAccessor.set("NORMAL", { componentType: 5126 });
    }
    if (vertexBuffers.TEXCOORD_0 === void 0 && indicesBuffer) {
      vertexBuffers.TEXCOORD_0 = calculateUVs(vertexBuffers.POSITION, vertexBuffers.NORMAL);
      vertexAccessor.set("TEXCOORD_0", { componentType: 5126 });
    }
    if (primitive.attributes.TANGENT === void 0 && indicesBuffer) {
      vertexBuffers.TANGENT = calculateBinormals(
        indicesBuffer,
        vertexBuffers.POSITION,
        vertexBuffers.NORMAL,
        vertexBuffers.TEXCOORD_0
      );
      vertexAccessor.set("TANGENT", { componentType: 5126 });
    }
    this.vertexAccessor = vertexAccessor;
    this.attributes = vertexBuffers;
    this.indicesBuffer = indicesBuffer;
    const { min, max } = boundingBox;
    this.boundingSphere._min = new Vector3(min);
    this.boundingSphere._max = new Vector3(max);
  }
  compose(order) {
    let total = 13;
    const count = this.attributes["POSITION"].length / 3;
    const g = new Float32Array(
      count + count * 3 + count * 2 + count * 3 + count * 4 + (this.attributes["JOINTS_0"]?.length ?? 0) + (this.attributes["WEIGHTS_0"]?.length ?? 0) + (this.attributes["COLOR_0"]?.length ?? 0) + (this.attributes["TEXCOORD_1"]?.length ?? 0) + (this.attributes["TEXCOORD_2"]?.length ?? 0)
    );
    if (this.attributes["WEIGHTS_0"]) {
      total += 8;
    }
    if (this.attributes["COLOR_0"]) {
      total += 4;
    }
    if (this.attributes["TEXCOORD_1"]) {
      total += 2;
    }
    if (this.attributes["TEXCOORD_2"]) {
      total += 2;
    }
    let k = 0;
    let l = 0;
    let m = 0;
    this.attributes["NORMAL"] = toFloat32Normalized(this.attributes["NORMAL"]);
    if (this.attributes["COLOR_0"]) {
      this.attributes["COLOR_0"] = toFloat32Normalized(this.attributes["COLOR_0"]);
    }
    for (let i = 0; i < g.length; i += total) {
      let j = 12;
      g[i] = this.attributes["POSITION"][k];
      g[i + 1] = this.attributes["POSITION"][k + 1];
      g[i + 2] = this.attributes["POSITION"][k + 2];
      if (this.attributes["TEXCOORD_0"]) {
        g[i + 3] = this.attributes["TEXCOORD_0"][l];
        g[i + 4] = this.attributes["TEXCOORD_0"][l + 1];
      }
      g[i + 5] = this.attributes["NORMAL"][k];
      g[i + 6] = this.attributes["NORMAL"][k + 1];
      g[i + 7] = this.attributes["NORMAL"][k + 2];
      if (this.attributes["TANGENT"]) {
        g[i + 8] = this.attributes["TANGENT"][m];
        g[i + 9] = this.attributes["TANGENT"][m + 1];
        g[i + 10] = this.attributes["TANGENT"][m + 2];
        g[i + 11] = this.attributes["TANGENT"][m + 3];
      }
      if (this.attributes["WEIGHTS_0"]) {
        g[i + 12] = this.attributes["JOINTS_0"][m];
        g[i + 13] = this.attributes["JOINTS_0"][m + 1];
        g[i + 14] = this.attributes["JOINTS_0"][m + 2];
        g[i + 15] = this.attributes["JOINTS_0"][m + 3];
        g[i + 16] = this.attributes["WEIGHTS_0"][m];
        g[i + 17] = this.attributes["WEIGHTS_0"][m + 1];
        g[i + 18] = this.attributes["WEIGHTS_0"][m + 2];
        g[i + 19] = this.attributes["WEIGHTS_0"][m + 3];
        j += 8;
      }
      if (this.attributes["COLOR_0"]) {
        g[i + 12] = this.attributes["COLOR_0"][m];
        g[i + 13] = this.attributes["COLOR_0"][m + 1];
        g[i + 14] = this.attributes["COLOR_0"][m + 2];
        g[i + 15] = this.attributes["COLOR_0"][m + 3];
        j += 4;
      }
      if (this.attributes["TEXCOORD_1"]) {
        g[i + 12] = this.attributes["TEXCOORD_1"][l];
        g[i + 13] = this.attributes["TEXCOORD_1"][l + 1];
        j += 2;
      }
      if (this.attributes["TEXCOORD_2"]) {
        g[i + 14] = this.attributes["TEXCOORD_2"][l];
        g[i + 15] = this.attributes["TEXCOORD_2"][l + 1];
        j += 2;
      }
      g[i + j] = order;
      k += 3;
      l += 2;
      m += 4;
    }
    this.g = g;
  }
  createGeometryForWebGPU(WebGPU, order) {
    const { device } = WebGPU;
    this.compose(order);
    const verticesBuffer = device.createBuffer({
      size: this.g.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Float32Array(verticesBuffer.getMappedRange()).set(this.g);
    verticesBuffer.unmap();
    this.verticesWebGPUBuffer = verticesBuffer;
    if (this.indicesBuffer) {
      this.indicesBuffer = new Uint32Array(this.indicesBuffer);
      const indicesBuffer = device.createBuffer({
        size: this.indicesBuffer.byteLength,
        usage: GPUBufferUsage.INDEX,
        mappedAtCreation: true
      });
      new Uint32Array(indicesBuffer.getMappedRange()).set(this.indicesBuffer);
      indicesBuffer.unmap();
      this.indicesWebGPUBuffer = indicesBuffer;
    }
  }
  createGeometryForWebGl(gl, defines, order) {
    const VAO = gl.createVertexArray();
    gl.bindVertexArray(VAO);
    this.compose(order);
    const VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, this.g, gl.STATIC_DRAW);
    this.VBO = VBO;
    const vertexLayout = [3, 2, 3, 4];
    if (defines.find((d) => d.name === "JOINTNUMBER")) {
      vertexLayout.push(4, 4);
    }
    if (defines.find((d) => d.name === "COLOR")) {
      vertexLayout.push(4);
    }
    if (defines.find((d) => d.name === "MULTIUV")) {
      vertexLayout.push(2);
    }
    if (this.attributes["TEXCOORD_2"]) {
      vertexLayout.push(2);
    }
    vertexLayout.push(1);
    const cubeVertexSize = Float32Array.BYTES_PER_ELEMENT * vertexLayout.reduce((a, b) => a + b, 0);
    this.cubeVertexSize = cubeVertexSize;
    let offset = 0;
    for (const k in GeometryEnum) {
      if (k in this.attributes || k === "TANGENT" || k === "TEXCOORD_0") {
        const index = GeometryEnum[k];
        gl.enableVertexAttribArray(index[0]);
        gl.vertexAttribPointer(index[0], index[1], gl.FLOAT, false, cubeVertexSize, Float32Array.BYTES_PER_ELEMENT * offset);
        offset += index[1];
      }
    }
    gl.enableVertexAttribArray(9);
    gl.vertexAttribPointer(9, 1, gl.FLOAT, false, cubeVertexSize, Float32Array.BYTES_PER_ELEMENT * offset);
    if (this.indicesBuffer) {
      const VBO2 = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VBO2);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer, gl.STATIC_DRAW);
    }
    this.VAO = VAO;
    gl.bindVertexArray(null);
  }
  calculateBounding(matrix) {
    const box = new Box();
    const min = new Vector3(this.boundingSphere._min.elements).applyMatrix4(matrix);
    const max = new Vector3(this.boundingSphere._max.elements).applyMatrix4(matrix);
    box.expand({ min, max });
    box.expand(this.boundingSphere);
    this.boundingSphere.min = box.min;
    this.boundingSphere.max = box.max;
    const vertices = this.attributes.POSITION;
    let maxRadiusSq = 0;
    this.boundingSphere.center.add(this.boundingSphere.min).add(this.boundingSphere.max).scale(0.5);
    for (let i = 0; i < vertices.length; i = i + 3) {
      maxRadiusSq = Math.max(
        maxRadiusSq,
        this.boundingSphere.center.distanceToSquared(vertices[i], vertices[i + 1], vertices[i + 2])
      );
    }
    this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
  }
  createUniforms(matrixWorld) {
    const uniformBuffer = new UniformBuffer();
    uniformBuffer.add("model", matrixWorld.elements);
    uniformBuffer.done();
    this.uniformBuffer = uniformBuffer;
  }
  updateUniformsWebGPU(WebGPU, buffer, usage = GPUBufferUsage.UNIFORM) {
    const matrixSize = buffer.store.byteLength;
    const offset = 256;
    const uniformBufferSize = offset + matrixSize;
    const { device } = WebGPU;
    const uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: usage | GPUBufferUsage.COPY_DST
    });
    buffer.bufferWebGPU = uniformBuffer;
    const uniformBindGroup1 = [
      {
        binding: 0,
        resource: uniformBuffer
      }
    ];
    device.queue.writeBuffer(uniformBuffer, 0, buffer.store.buffer, buffer.store.byteOffset, buffer.store.byteLength);
    return uniformBindGroup1;
  }
  updateUniformsWebGl(gl, program) {
    const uIndex2 = gl.getUniformBlockIndex(program, "Matrices2");
    gl.uniformBlockBinding(program, uIndex2, 1);
  }
  async updateWebGPU(WebGPU, geometry) {
    const { device } = WebGPU;
    let total = 12;
    if (this.attributes["COLOR_0"]) {
      total += 4;
    }
    if (this.attributes["TEXCOORD_1"]) {
      total += 2;
    }
    let k = 0;
    let l = 0;
    let m = 0;
    const g = this.g;
    for (let i = 0; i < g.length; i += total) {
      if (geometry["POSITION"]) {
        g[i] = geometry["POSITION"][k];
        g[i + 1] = geometry["POSITION"][k + 1];
        g[i + 2] = geometry["POSITION"][k + 2];
      }
      if (geometry["TEXCOORD_0"]) {
        g[i + 3] = geometry["TEXCOORD_0"][l];
        g[i + 4] = geometry["TEXCOORD_0"][l + 1];
      }
      if (geometry["NORMAL"]) {
        g[i + 5] = geometry["NORMAL"][k];
        g[i + 6] = geometry["NORMAL"][k + 1];
        g[i + 7] = geometry["NORMAL"][k + 2];
      }
      if (geometry["TANGENT"]) {
        g[i + 8] = geometry["TANGENT"][m];
        g[i + 9] = geometry["TANGENT"][m + 1];
        g[i + 10] = geometry["TANGENT"][m + 2];
        g[i + 11] = geometry["TANGENT"][m + 3];
      }
      k += 3;
      l += 2;
      m += 4;
    }
    device.queue.writeBuffer(this.verticesWebGPUBuffer, 0, g.buffer, g.byteOffset, g.byteLength);
  }
  update(gl, geometry) {
    gl.bindVertexArray(this.VAO);
    let total = 13;
    if (this.attributes["COLOR_0"]) {
      total += 4;
    }
    if (this.attributes["TEXCOORD_1"]) {
      total += 2;
    }
    let k = 0;
    let l = 0;
    let m = 0;
    const g = this.g;
    for (let i = 0; i < g.length; i += total) {
      if (geometry["POSITION"]) {
        g[i] = geometry["POSITION"][k];
        g[i + 1] = geometry["POSITION"][k + 1];
        g[i + 2] = geometry["POSITION"][k + 2];
      }
      if (geometry["TEXCOORD_0"]) {
        g[i + 3] = geometry["TEXCOORD_0"][l];
        g[i + 4] = geometry["TEXCOORD_0"][l + 1];
      }
      if (geometry["NORMAL"]) {
        g[i + 5] = geometry["NORMAL"][k];
        g[i + 6] = geometry["NORMAL"][k + 1];
        g[i + 7] = geometry["NORMAL"][k + 2];
      }
      if (geometry["TANGENT"]) {
        g[i + 8] = geometry["TANGENT"][m];
        g[i + 9] = geometry["TANGENT"][m + 1];
        g[i + 10] = geometry["TANGENT"][m + 2];
        g[i + 11] = geometry["TANGENT"][m + 3];
      }
      k += 3;
      l += 2;
      m += 4;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
    gl.bufferData(gl.ARRAY_BUFFER, g, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
  }
};

// src/parseSceneBuilder.ts
function buildPrim(input, el, parent, name, skin, weights, primitive, draco) {
  const m = input.json.materials && input.json.materials[primitive.material];
  if (input.json.extensions && input.json.extensions.EXT_lights_image_based) {
    input.defines.push({
      name: "SPHERICAL_HARMONICS",
      value: Math.ceil(Math.log(input.json.extensions.EXT_lights_image_based.lights[0].specularImageSize) * Math.LOG2E) + 10
    });
  }
  if (input.json.extensionsUsed && input.json.extensionsUsed.includes("KHR_texture_basisu")) {
    input.defines.push({ name: "BASISU" });
  }
  const defines = [...input.defines];
  const material = new Material2(m, input.textures, defines);
  if (skin !== void 0) {
    defines.push({
      name: "JOINTNUMBER",
      value: input.skins[skin].jointNames.length
    });
  }
  if (primitive.indices !== void 0 || primitive.attributes["TANGENT"] !== void 0) {
    defines.push({ name: "TANGENT" });
  }
  if (primitive.attributes["TEXCOORD_1"] !== void 0 || primitive.attributes["TEXCOORD_2"] !== void 0) {
    defines.push({ name: "MULTIUV" });
  }
  if (primitive.attributes["TEXCOORD_2"] !== void 0) {
    defines.push({ name: "MULTIUV2" });
  }
  if (primitive.attributes["COLOR_0"]) {
    defines.push({ name: "COLOR" });
  }
  const mesh = skin !== void 0 ? new SkinnedMesh(name, parent) : new Mesh(name, parent);
  const geometry = new Geometry(input.json, input.arrayBuffer, weights, draco, primitive);
  if (primitive.attributes.TANGENT === void 0) {
    defines.push({ name: "USERIGHTHANDEDSYSTEM" });
  }
  if (primitive.extensions && primitive.extensions.KHR_materials_variants) {
    const variants = primitive.extensions.KHR_materials_variants.mappings.map((m2) => {
      return { ...m2, m: new Material2(input.json.materials[m2.material], input.textures, [...defines]) };
    });
    mesh.setVariants(variants);
  }
  mesh.setMode(primitive.mode);
  mesh.setMaterial(material);
  mesh.setGeometry(geometry);
  if (el.scale && el.scale[0] < 0) {
    mesh.setFrontFace();
  }
  if (el.scale && material.thicknessFactor) {
    material.thicknessFactor *= el.scale[0];
  }
  mesh.setDefines(material.defines);
  if (mesh instanceof SkinnedMesh) {
    mesh.skin = skin;
  }
  mesh.matrices = parent.matrices;
  mesh.updateMatrix();
  mesh.calculateBounding();
  mesh.visible = parent.visible;
  mesh.instances = parent.instances;
  return mesh;
}
function buildNode(input, parent, name, draco) {
  const el = input.json.nodes[name];
  let child;
  if (el.camera !== void 0) {
    const camera = Object.assign(
      {
        zoom: 1,
        isInitial: false,
        aspect: input.width && input.height ? input.width / input.height : 1
      },
      input.json.cameras[el.camera]
    );
    const camObj = new Camera(camera, name, parent);
    const proj = calculateProjection(camObj.props);
    camObj.setProjection(proj);
    input.cameras.push(camObj);
    child = camObj;
  } else if (el.extensions && el.extensions.KHR_lights_punctual) {
    if (input.lights.find((l) => l.id === el.name)) {
      return;
    }
    const light = input.json.extensions.KHR_lights_punctual.lights[el.extensions.KHR_lights_punctual.light];
    light.isInitial = false;
    const lightObj = new Light(light, name, parent);
    input.lights.push(lightObj);
    child = lightObj;
  } else {
    if (el.isBone !== void 0) {
      child = new Bone(name, parent);
    } else {
      child = new Object3D(name, parent);
    }
  }
  if (el.translation || el.rotation || el.scale) {
    child.setPosition(el.translation, el.rotation, el.scale);
  } else if (el.matrix) {
    child.setMatrix(el.matrix);
  }
  child.updateMatrix();
  child.visible = parent.visible;
  if (el.extensions && el.extensions.KHR_node_visibility) {
    child.visible = el.extensions.KHR_node_visibility.visible;
  }
  if (el.extensions && el.extensions.EXT_mesh_gpu_instancing) {
    const { attributes } = el.extensions.EXT_mesh_gpu_instancing;
    const keys = ["ROTATION", "SCALE", "TRANSLATION"];
    for (const key of keys) {
      if (!attributes[key]) {
        continue;
      }
      const stride = key === "ROTATION" ? 4 : 3;
      const accessor = input.json.accessors[attributes[key]];
      const bufferView = input.json.bufferViews[accessor.bufferView];
      const buffer = buildArray(
        input.arrayBuffer[bufferView.buffer],
        accessor.componentType,
        calculateOffset(bufferView.byteOffset, accessor.byteOffset),
        getDataType(accessor.type) * accessor.count
      );
      if (child.instances === 1) {
        child.instances = buffer.length / stride;
        child.matrices = Array.from({ length: child.instances });
        for (let i = 0; i < child.instances; i++) {
          child.matrices[i] = new Matrix4();
        }
      }
      for (let i = 0; i < buffer.length; i += stride) {
        const m = child.matrices[i / stride];
        if (key === "ROTATION") {
          m.makeRotationFromQuaternion([buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]]);
        } else if (key === "SCALE") {
          m.scale(new Vector3([buffer[i], buffer[i + 1], buffer[i + 2]]));
        } else if (key === "TRANSLATION") {
          m.setTranslate(new Vector3([buffer[i], buffer[i + 1], buffer[i + 2]]));
        }
      }
    }
  }
  child.id = el.name;
  parent.children.push(child);
  parent = child;
  if (el.mesh !== void 0) {
    parent.children.push(
      ...input.json.meshes[el.mesh].primitives.map(
        (primitive) => buildPrim(
          input,
          el,
          parent,
          input.json.meshes[el.mesh].name,
          el.skin,
          input.json.meshes[el.mesh].weights,
          primitive,
          draco
        )
      )
    );
  }
  if (el.children && el.children.length) {
    el.children.forEach((childName) => buildNode(input, parent, childName, draco));
  }
}
function calculateFov(input, isInitial) {
  const box = new Box();
  walk(input.scene, (node) => {
    if (node instanceof Mesh) {
      box.expand(node.geometry.boundingSphere);
    }
  });
  const size = box.getSize();
  if (isInitial) {
    const center = new Vector3().add(box.min).add(box.max).scale(0.5);
    const matrix = new Matrix4();
    matrix.translate(center.x, center.y, center.z);
    matrix.invert();
    input.scene.matrixWorld.multiply(matrix);
    walk(input.scene, (node) => {
      if (node instanceof Object3D) {
        node.updateMatrix();
      }
    });
  }
  input.cameras.forEach((c) => {
    c.modelSize = size;
  });
}
async function buildMesh(input) {
  let draco;
  if (input.json.extensionsUsed && input.json.extensionsUsed.includes("KHR_draco_mesh_compression")) {
    draco = await DecoderModule();
  }
  if (input.json.extensions && input.json.extensions.KHR_materials_variants) {
    input.scene.variants = input.json.extensions.KHR_materials_variants.variants;
  }
  input.json.scenes[input.json.scene !== void 0 ? input.json.scene : 0].nodes.forEach((n) => {
    if (input.json.nodes[n].extensions !== void 0) {
      buildNode(input, input.scene, n, draco);
    }
    if (input.json.nodes[n].children && input.json.nodes[n].children.length) {
      buildNode(input, input.scene, n, draco);
    }
    if (input.json.nodes[n].mesh !== void 0) {
      buildNode(input, input.scene, n, draco);
    }
    if (input.json.nodes[n].camera !== void 0) {
      buildNode(input, input.scene, n, draco);
    }
  });
  if (input.lights.length === 0 && input.light) {
    input.lights.push(input.light);
  }
  walk(input.scene, (mesh) => {
    if (mesh instanceof Mesh) {
      if (mesh.material.alpha) {
        input.scene.transparentChildren.push(mesh);
      } else {
        input.scene.opaqueChildren.push(mesh);
      }
      input.scene.meshes.push(mesh);
      mesh.material.defines.push({ name: "LIGHTNUMBER", value: input.lights.length });
      input.lights.forEach((light, i) => {
        if (light.visible) {
          if (light.type === "directional") {
            mesh.material.lights[mesh.material.lights.findIndex((l) => l === -1)] = i;
          } else {
            const p = mesh.getPosition();
            const distance = new Vector3(light.getPosition()).distanceToSquared(p[0], p[1], p[2]);
            const attenuation = Math.max(Math.min(1 - Math.pow(distance / light.range, 4), 1), 0) / Math.pow(distance, 2);
            if (attenuation > 0) {
              mesh.material.lights[mesh.material.lights.findIndex((l) => l === -1)] = i;
            }
          }
        }
      });
    }
  });
  input.scene.meshes.forEach((m) => {
    if (m.material.lights[0] === -1) {
      m.material.lights[0] = 0;
    }
  });
  input.scene.opaqueChildren.sort((a, b) => a.distance - b.distance);
  input.scene.transparentChildren.sort((a, b) => a.distance - b.distance);
}
function buildSkin(input) {
  if (!input.json.skins) {
    return true;
  }
  for (const skin of input.json.skins) {
    const acc = input.json.accessors[skin.inverseBindMatrices];
    const buffer = input.json.bufferViews[acc.bufferView];
    const array = buildArray(
      input.arrayBuffer[buffer.buffer],
      acc.componentType,
      calculateOffset(buffer.byteOffset, acc.byteOffset),
      getDataType(acc.type) * acc.count
    );
    const v = {
      jointNames: skin.joints,
      inverseBindMatrices: array,
      bones: [],
      boneInverses: []
    };
    let i = 0;
    for (const join of v.jointNames) {
      input.json.nodes[join].isBone = true;
      const m = v.inverseBindMatrices;
      const mat = new Matrix4().set(m.slice(i * 16, (i + 1) * 16));
      v.boneInverses.push(mat);
      i++;
    }
    input.skins.push(v);
  }
}
function buildAnimation(input) {
  if (!input.json.animations) {
    return true;
  }
  for (const animation of input.json.animations) {
    const tracks = [];
    for (const channel of animation.channels) {
      const duration = 0;
      const sampler = animation.samplers[channel.sampler];
      if (sampler) {
        const { target } = channel;
        let name = target.node;
        let { path } = target;
        if (name === void 0) {
          const s = target.extensions.KHR_animation_pointer.pointer.split("/");
          if (s[1] === "materials") {
            const mat = input.json.materials[Number(s[2])].name;
            ({ name } = input.scene.meshes.find((m) => m.material.name === mat));
            path = s.splice(3).join("/");
          }
          if (s[1] === "nodes") {
            ({ name } = input.json.nodes[Number(s[2])]);
            path = s[5];
          }
        }
        const input_ = animation.parameters !== void 0 ? animation.parameters[sampler.input] : sampler.input;
        const output = animation.parameters !== void 0 ? animation.parameters[sampler.output] : sampler.output;
        const inputAccessor = input.json.accessors[input_];
        const outputAccessor = input.json.accessors[output];
        const inputBuffer = input.json.bufferViews[inputAccessor.bufferView];
        const outputBuffer = input.json.bufferViews[outputAccessor.bufferView];
        const inputArray = buildArray(
          input.arrayBuffer[inputBuffer.buffer],
          inputAccessor.componentType,
          calculateOffset(inputBuffer.byteOffset, inputAccessor.byteOffset),
          getDataType(inputAccessor.type) * inputAccessor.count
        );
        const outputArray = buildArray(
          input.arrayBuffer[outputBuffer.buffer],
          outputAccessor.componentType,
          calculateOffset(outputBuffer.byteOffset, outputAccessor.byteOffset),
          getDataType(outputAccessor.type) * outputAccessor.count
        );
        const meshes = [];
        walk(input.scene, (node) => {
          if (node.name === name || node.id === name) {
            if (path === "weights" && node instanceof Object3D) {
              meshes.push(...node.children);
            } else {
              meshes.push(node);
            }
          }
        });
        let component = path === "weights" ? meshes[0].geometry.targets.length : getDataType(outputAccessor.type);
        if (sampler.interpolation === "CUBICSPLINE") {
          component = component * 3;
        }
        const keys = [];
        for (let i = 0; i < inputArray.length; i++) {
          const firstT = inputArray[i];
          const firstV = outputArray.slice(i * component, (i + 1) * component);
          keys.push({
            time: firstT,
            value: normalize(firstV)
          });
        }
        if (keys.length >= 2) {
          if (meshes.length) {
            tracks.push({
              duration: Math.max(keys[keys.length - 1].time, duration),
              stoped: false,
              meshes,
              component,
              type: path,
              name: `${meshes[0].name}.${path}`,
              keys,
              interpolation: sampler.interpolation
            });
          }
        }
      }
    }
    input.tracks.push(tracks);
  }
}

// src/parseTextures.ts
var KTX2_FORMAT_CANDIDATES = [
  {
    transcoderFormatKey: "cTFASTC_4x4_RGBA",
    webgl: {
      extension: "WEBGL_compressed_texture_astc",
      constant: "COMPRESSED_RGBA_ASTC_4x4_KHR",
      srgbConstant: "COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR"
    },
    webgpu: { feature: "texture-compression-astc", format: "astc-4x4-unorm", srgbFormat: "astc-4x4-unorm-srgb" }
  },
  {
    transcoderFormatKey: "cTFBC7_RGBA",
    webgl: {
      extension: "EXT_texture_compression_bptc",
      constant: "COMPRESSED_RGBA_BPTC_UNORM_EXT",
      srgbConstant: "COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT"
    },
    webgpu: { feature: "texture-compression-bc", format: "bc7-rgba-unorm", srgbFormat: "bc7-rgba-unorm-srgb" }
  },
  {
    transcoderFormatKey: "cTFBC3_RGBA",
    webgl: {
      extension: "WEBGL_compressed_texture_s3tc",
      constant: "COMPRESSED_RGBA_S3TC_DXT5_EXT",
      // sRGB S3TC is a separate extension, not just another constant
      // on WEBGL_compressed_texture_s3tc.
      srgbExtension: "WEBGL_compressed_texture_s3tc_srgb",
      srgbConstant: "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"
    },
    webgpu: { feature: "texture-compression-bc", format: "bc3-rgba-unorm", srgbFormat: "bc3-rgba-unorm-srgb" }
  },
  {
    transcoderFormatKey: "cTFETC2_RGBA",
    webgl: {
      extension: "WEBGL_compressed_texture_etc",
      constant: "COMPRESSED_RGBA8_ETC2_EAC",
      srgbConstant: "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC"
    },
    webgpu: { feature: "texture-compression-etc2", format: "etc2-rgba8unorm", srgbFormat: "etc2-rgba8unorm-srgb" }
  },
  {
    transcoderFormatKey: "cTFPVRTC1_4_RGBA",
    webgl: {
      extension: "WEBGL_compressed_texture_pvrtc",
      constant: "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"
      // No standard sRGB PVRTC constant.
    }
    // No WebGPU equivalent - PVRTC isn't part of the WebGPU spec.
  }
];
function wrapFormat(module2, key) {
  return module2.transcoder_texture_format[key];
}
function selectKTX2FormatWebGL(gl, module2) {
  for (const candidate of KTX2_FORMAT_CANDIDATES) {
    if (!candidate.webgl) {
      continue;
    }
    const ext = gl.getExtension(candidate.webgl.extension);
    if (ext) {
      let srgbExt = ext;
      if (candidate.webgl.srgbExtension) {
        srgbExt = gl.getExtension(candidate.webgl.srgbExtension) ?? ext;
      }
      return {
        transcoderFormat: wrapFormat(module2, candidate.transcoderFormatKey),
        compressed: true,
        webglInternalFormat: ext[candidate.webgl.constant],
        webglInternalFormatSrgb: candidate.webgl.srgbConstant ? srgbExt[candidate.webgl.srgbConstant] : void 0
      };
    }
  }
  return { transcoderFormat: wrapFormat(module2, "cTFRGBA32"), compressed: false };
}
function selectKTX2FormatWebGPU(device, module2) {
  for (const candidate of KTX2_FORMAT_CANDIDATES) {
    if (!candidate.webgpu) {
      continue;
    }
    if (device.features.has(candidate.webgpu.feature)) {
      return {
        transcoderFormat: wrapFormat(module2, candidate.transcoderFormatKey),
        compressed: true,
        webgpuFormat: candidate.webgpu.format,
        webgpuFormatSrgb: candidate.webgpu.srgbFormat
      };
    }
  }
  return { transcoderFormat: wrapFormat(module2, "cTFRGBA32"), compressed: false };
}
async function initTextures(input, output, isbitmap) {
  if (!input.json.textures) {
    return true;
  }
  const texturesMap = {};
  let hasBasisu = false;
  input.json.textures.forEach((t) => {
    if (t.extensions && t.extensions.KHR_texture_basisu) {
      hasBasisu = true;
    }
    let source = t.extensions && t.extensions.KHR_texture_basisu ? t.extensions.KHR_texture_basisu.source : t.source;
    source = t.extensions && t.extensions.EXT_texture_webp ? t.extensions.EXT_texture_webp.source : source;
    const name = String(t.sampler) + String(source);
    texturesMap[name] = t;
    texturesMap[name].name = name;
    t.name = name;
  });
  let ktx2Format;
  if (hasBasisu) {
    const { gl } = input;
    const isWebGPU = Boolean(gl.device);
    const module2 = await loadBasisModule();
    ktx2Format = isWebGPU ? selectKTX2FormatWebGPU(gl.device, module2) : selectKTX2FormatWebGL(gl, module2);
  }
  const promiseArr = Object.values(texturesMap).map((t) => {
    const isBasisu = Boolean(t.extensions && t.extensions.KHR_texture_basisu);
    let s = isBasisu ? t.extensions.KHR_texture_basisu.source : t.source;
    s = t.extensions && t.extensions.EXT_texture_webp ? t.extensions.EXT_texture_webp.source : s;
    const source = input.json.images[s];
    return fetchImage(
      isbitmap,
      input,
      // KHR_texture_basisu images aren't required to carry mimeType
      // themselves (the extension reference is what marks them as
      // KTX2) - fetchImage only branches to the KTX2 loader off
      // mimeType, so make that explicit here.
      isBasisu ? { ...source, mimeType: "image/ktx2" } : source,
      {
        url: `${input.host}${source.uri}`,
        name: t.name
      },
      t.sampler,
      isBasisu ? ktx2Format : void 0
    );
  });
  return Promise.all(promiseArr).then((textures) => {
    output.textures = input.json.textures.map((t) => {
      return textures.find((j) => j.name === t.name);
    });
    return true;
  });
}

// src/state.ts
function commit(target, patch) {
  Object.assign(target, patch);
}

// src/redcube.node.ts
var FOV = 45;
var RedCube = class {
  url;
  state;
  camera;
  constructor(url) {
    if (!url) {
      throw new Error("RedCube: a glTF url must be passed as the first constructor argument");
    }
    this.url = url;
    const scene = new Scene();
    this.state = {
      scene,
      url,
      host: url.substr(0, url.lastIndexOf("/") + 1),
      defines: [],
      tracks: [],
      json: void 0,
      skins: [],
      cameras: [],
      lights: [],
      textures: null,
      images: /* @__PURE__ */ new Map(),
      samplers: null,
      arrayBuffer: null,
      programs: {},
      renderState: {},
      isIBL: true,
      isDefaultLight: true,
      needUpdateView: true,
      needUpdateProjection: true
    };
  }
  async withPatchAsync(run) {
    const patch = {};
    const result = await run(patch);
    commit(this.state, patch);
    return result;
  }
  async init(cb) {
    await this.withPatchAsync((patch) => getJson(this.state, patch));
    await this.withPatchAsync((patch) => getBuffer(this.state, patch));
    await this.withPatchAsync((patch) => initTextures(this.state, patch, false));
    buildSkin(this.state);
    await buildMesh(this.state);
    buildAnimation(this.state);
    if (this.state.cameras.length === 0) {
      this.camera = new Camera(
        {
          type: "perspective",
          isInitial: true,
          zoom: 1,
          aspect: 1,
          perspective: {
            yfov: FOV * Math.PI / 180
          }
        },
        "perspective"
      );
      this.state.cameras.push(this.camera);
    }
    const [c] = this.state.cameras;
    this.camera = c;
    this.state.camera = c;
    calculateFov(this.state, this.camera.props.isInitial);
    this.resize();
    this.state.scene.tracks = this.state.tracks;
    this.state.scene.cameras = this.state.cameras;
    this.state.scene.lights = this.state.lights;
    cb(this.state.scene);
  }
  resize() {
    const z = this.camera.modelSize;
    if (this.camera.props.isInitial) {
      this.camera.setZ(z);
    }
    this.camera.updateNF();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RedCube
});
//# sourceMappingURL=redcube.node.cjs.map
