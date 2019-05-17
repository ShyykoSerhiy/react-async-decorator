"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var holder_1 = require("./holder");
var promise_1 = require("./promise");
var memory_1 = require("./memory");
function notImpl() {
    var msg = new Error("Fetcher wasn't implemented");
    return promise_1.TSyncPromise.reject(msg);
}
function hashArg(arg) {
    if (arg === null || arg === undefined) {
        return '';
    }
    return JSON.stringify(arg);
}
var Fetcher = /** @class */ (function () {
    function Fetcher(opts, fn) {
        var _this = this;
        this.manual = false;
        this.updates = [];
        var store = __assign({}, opts.store, { dispatch: function (action) {
                var result = opts.store.dispatch(action);
                if (action.type === opts.action) {
                    var mode = action.action;
                    if (mode === 'set' || mode === 'error') {
                        _this.updateFetcher();
                    }
                }
                return result;
            } });
        var holderOpts = __assign({}, opts, { store: store });
        var holder = (this.holder = new holder_1.Holder(holderOpts));
        this.hashArg = opts.hashArg || hashArg;
        var impl = fn.load || notImpl;
        this.impl(impl);
        this.context = { holder: holder, hash: this.hashArg, actions: holder.actions };
        this.manual = opts.manual;
    }
    Fetcher.prototype.updateFetcher = function () {
        this.updates.forEach(function (item) {
            item.fn.call(item.ctx);
        });
    };
    Fetcher.prototype.addUpdater = function (fn, ctx) {
        this.updates.push({ fn: fn, ctx: ctx });
    };
    Fetcher.prototype.removeUpdater = function (fn, ctx) {
        this.updates = this.updates.filter(function (item) {
            if (ctx && ctx === item.ctx) {
                return false;
            }
            return item.fn !== fn;
        });
    };
    Fetcher.prototype.impl = function (load) {
        this.load = load;
    };
    Fetcher.prototype.implModify = function (modify) {
        this.modify = modify;
    };
    Fetcher.prototype.clear = function () {
        return this.holder.clear();
    };
    Fetcher.prototype.init = function (key, args) {
        var load = this.load;
        if (this.holder.has(key)) {
            return;
        }
        if (!this.holder.getAwait(key)) {
            var defer = load(args, this.context);
            var syncDefer = (Array.isArray(defer) ? promise_1.TSyncPromise.all(defer) : promise_1.TSyncPromise.resolve(defer));
            this.holder.set(key, syncDefer);
        }
    };
    Fetcher.prototype.isLoading = function (arg) {
        var key = this.hashArg(arg);
        return this.holder.isLoading(key);
    };
    Fetcher.prototype.awaitAll = function () {
        return this.holder.awaitAll();
    };
    Fetcher.prototype.await = function (arg) {
        var key = this.hashArg(arg);
        return this.holder.await(key);
    };
    Fetcher.prototype.asyncGet = function (args) {
        var key = this.hashArg(args);
        this.init(key, args);
        return this.holder.await(key);
    };
    Fetcher.prototype.get = function (args) {
        if (this.manual) {
            var r = this.asyncGet(args);
            if (!r.data) {
                throw r;
            }
            else if (r.data.type === 'rejected') {
                throw r.data.data;
            }
            else {
                return r.data.data;
            }
        }
        else {
            var key = this.hashArg(args);
            this.init(key, args);
            var error = this.holder.error(key);
            if (error !== undefined) {
                throw error;
            }
            if (!this.holder.has(key)) {
                throw this.holder.await(key);
            }
            return this.holder.get(key);
        }
    };
    Fetcher.prototype.asyncSet = function (opt, arg) {
        var key = this.hashArg(arg);
        var newDefer = this.modify(opt, this.context);
        var syncDefer = newDefer === undefined
            ? promise_1.TSyncPromise.reject('unsupported')
            : (Array.isArray(newDefer) ? promise_1.TSyncPromise.all(newDefer) : promise_1.TSyncPromise.resolve(newDefer));
        this.holder.set(key, syncDefer);
        return syncDefer;
    };
    return Fetcher;
}());
exports.Fetcher = Fetcher;
function getOption(fn, option) {
    return option && typeof option !== 'string' ? fn(option) : undefined;
}
function create(opts) {
    var counter = 0;
    function getName(option) {
        return option === undefined || option === null
            ? '' + counter++
            : typeof option === 'string'
                ? option
                : getName(option.name);
    }
    var action = opts ? opts.action : 'action';
    var key = opts ? opts.key : 'local';
    var initialState = opts ? opts.initialState : undefined;
    var createStore = opts && opts.createStore ? opts.createStore : memory_1.createMemoryStore;
    var setItemInterceptor = {};
    function setItem(action) {
        var iterceptor = setItemInterceptor[action.name];
        return iterceptor ? iterceptor(action) : undefined;
    }
    var store = createStore({ action: action, key: key, setItem: setItem }, initialState);
    function createFetcherImpl(fns, option) {
        var interceptor = getOption(function (o) { return o.setItem; }, option);
        var manual = !!getOption(function (o) { return o.manualStore; }, option);
        var hashArgFn = getOption(function (o) { return o.hashArg; }, option);
        var name = getName(option);
        if (interceptor) {
            setItemInterceptor[name] = interceptor;
        }
        return new Fetcher({ store: store, action: action, key: key, name: name, manual: manual, hashArg: hashArgFn }, !fns ? {} : typeof fns === 'function' ? { load: fns } : fns);
    }
    return createFetcherImpl;
}
exports.create = create;
//# sourceMappingURL=fetcher.js.map