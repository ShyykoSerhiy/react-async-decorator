"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var promise_1 = require("./promise");
var memory_1 = require("./memory");
function createActions(opts, holder) {
    var store = opts.store, name = opts.name, action = opts.action;
    var actions = {
        success: function (keys, params, payloads) {
            var allowKeys = keys.filter(function (key) { return holder.allow(key, params[key]); });
            var indexes = allowKeys.map(function (key) { return keys.indexOf(key); });
            var payload = {};
            indexes.forEach(function (id) {
                payload[keys[id]] = payloads[id];
            });
            if (indexes.length) {
                var act2 = {
                    type: action,
                    action: 'set',
                    name: name,
                    payload: payload,
                };
                store.dispatch(act2);
            }
        },
        error: function (keys, params, error) {
            var allowKeys = keys.filter(function (key) { return holder.allow(key, params[key]); });
            var indexes = allowKeys.map(function (key) { return keys.indexOf(key); });
            var payload = {};
            indexes.forEach(function (id) {
                payload[keys[id]] = error;
            });
            var act2 = {
                type: action,
                action: 'error',
                name: name,
                payload: payload,
            };
            store.dispatch(act2);
        },
        request: function (keys) {
            var act = { type: action, action: 'request', name: name, keys: keys };
            store.dispatch(act);
        },
    };
    return actions;
}
exports.createActions = createActions;
var Holder = /** @class */ (function () {
    function Holder(props) {
        this.props = props;
        this.container = memory_1.snapshotStoreFetcher(this.getFetcherBlob());
        this.actions = createActions(this.props, this);
    }
    Holder.prototype.set = function (aKey, aDefer) {
        var _this = this;
        var _a;
        var isPropsArg = aDefer !== undefined;
        var keys = isPropsArg ? [aKey] : Object.keys(aKey);
        var params = isPropsArg ? (_a = {}, _a[aKey] = aDefer, _a) : aKey;
        var defers = keys.map(function (key) {
            _this.container[key] = params[key];
            return params[key];
        });
        if (!this.props.manual) {
            this.actions.request(keys);
            promise_1.TSyncPromise.all(defers).then(function (payloads) { return _this.actions.success(keys, params, payloads); }, function (error) { return _this.actions.error(keys, params, error); });
        }
    };
    Holder.prototype.allow = function (key, defer) {
        return this.container[key] === defer;
    };
    Holder.prototype.clear = function () {
        var _a = this.props, store = _a.store, action = _a.action, name = _a.name;
        store.dispatch({ type: action, action: 'clear', name: name });
        this.container = {};
    };
    Holder.prototype.getFetcherBlob = function () {
        var _a = this.props, store = _a.store, key = _a.key, name = _a.name;
        var state = store.getState();
        if (!state) {
            return;
        }
        var holderState = state[key];
        if (!holderState) {
            return;
        }
        return holderState[name];
    };
    Holder.prototype.getDataBlob = function (aKey) {
        var ptr = this.getFetcherBlob();
        return ptr ? ptr[aKey] : undefined;
    };
    Holder.prototype.get = function (key) {
        var blob = this.getDataBlob(key);
        return blob ? blob.data : undefined;
    };
    Holder.prototype.has = function (key) {
        var blob = this.getDataBlob(key);
        return blob ? (blob.loading === true ? false : true) : false;
    };
    Holder.prototype.isLoading = function (key) {
        var blob = this.getDataBlob(key);
        return blob ? blob.loading : undefined;
    };
    Holder.prototype.error = function (key) {
        var blob = this.getDataBlob(key);
        var error = blob ? blob.error : undefined;
        if (error) {
            var err = new Error();
            err.message = error.message;
            err.stack = error.stack;
            err.name = error.name;
            return err;
        }
    };
    Holder.prototype.getAwait = function (key) {
        return this.container[key];
    };
    Holder.prototype.await = function (key) {
        var ret = this.getAwait(key);
        return ret || Holder.notExist;
    };
    Holder.prototype.awaitAll = function () {
        var _this = this;
        var allDefers = Object.keys(this.container).map(function (key) { return _this.container[key]; });
        return promise_1.TSyncPromise.all(allDefers);
    };
    Holder.notExist = promise_1.TSyncPromise.reject(new Error("Doesn't exist"));
    return Holder;
}());
exports.Holder = Holder;
//# sourceMappingURL=holder.js.map