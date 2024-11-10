"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const sse_const_js_1 = require("./sse.const.js");
let SseControler = (() => {
    let _classDecorators = [(0, common_1.Controller)('sse')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _connect_decorators;
    let _broadcast_decorators;
    let _partial_decorators;
    var SseControler = _classThis = class {
        constructor() {
            this.connections = (__runInitializers(this, _instanceExtraInitializers), new Map());
        }
        /**
         * IP를 기준으로 SSE 연결 생성
         */
        async connect(ip) {
            this.connections.set(ip, new rxjs_1.Subject());
            return this.connections
                .get(ip)
                .asObservable()
                .pipe((0, rxjs_1.map)((message) => ({ data: message })));
        }
        async broadcast() {
            this.connections.forEach((connection) => {
                connection.next({
                    event: sse_const_js_1.SSE_EVENTS.BROADCAST,
                    content: 'This is a broadcast message!',
                });
            });
        }
        async partial() {
            // 전체 커넥션의 10%에게만 메세지 전송
            const connections = Array.from(this.connections.keys());
            // eslint-disable-next-line prettier/prettier
            const partialConnections = connections.slice(0, Math.floor(connections.length * 0.1));
            partialConnections.forEach((connection) => {
                this.connections.get(connection).next({
                    event: sse_const_js_1.SSE_EVENTS.PARTIAL,
                    content: 'This is a partial message!',
                });
            });
            return { message: `Send to ${partialConnections.length} connections` };
        }
    };
    __setFunctionName(_classThis, "SseControler");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _connect_decorators = [(0, common_1.Sse)('connect/:ip')];
        _broadcast_decorators = [(0, common_1.Post)('broadcast')];
        _partial_decorators = [(0, common_1.Post)('partial')];
        __esDecorate(_classThis, null, _connect_decorators, { kind: "method", name: "connect", static: false, private: false, access: { has: obj => "connect" in obj, get: obj => obj.connect }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _broadcast_decorators, { kind: "method", name: "broadcast", static: false, private: false, access: { has: obj => "broadcast" in obj, get: obj => obj.broadcast }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _partial_decorators, { kind: "method", name: "partial", static: false, private: false, access: { has: obj => "partial" in obj, get: obj => obj.partial }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SseControler = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SseControler = _classThis;
})();
exports.default = SseControler;
