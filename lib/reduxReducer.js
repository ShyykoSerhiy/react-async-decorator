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
function setItemDefault(act) {
    if (act.action === 'set') {
        return Object.keys(act.payload).reduce(function (memo, key) {
            memo[key] = { data: act.payload[key] };
            return memo;
        }, {});
    }
    else if (act.action === 'error') {
        var payload_1 = act.payload;
        return Object.keys(payload_1).reduce(function (memo, key) {
            var error = payload_1[key];
            if (error instanceof Error) {
                var err = { name: error.name, message: error.message, stack: error.stack };
                memo[key] = { error: err };
            }
            else {
                memo[key] = { error: { name: 'custom error', message: error, stack: '' } };
            }
            return memo;
        }, {});
    }
    else {
        return undefined;
    }
}
function createReducer(opt) {
    var KEY = opt.key;
    var ACTION = opt.action;
    var setItem = opt.setItem || setItemDefault;
    function reducer(state, act) {
        if (act.type === ACTION) {
            var nstate = Object.assign({}, state);
            if (act.action === 'clear') {
                if (nstate[KEY]) {
                    nstate[KEY][act.name] = {};
                }
            }
            else if (act.action === 'set' || act.action === 'error' || act.action === 'request') {
                var name = act.name;
                var data = (nstate[KEY] = Object.assign({}, nstate[KEY]));
                var ptr_1 = (data[name] = Object.assign({}, data[name]));
                if (act.action === 'request') {
                    if (Array.isArray(act.keys)) {
                        act.keys.forEach(function (key) { return (ptr_1[key] = __assign({}, ptr_1[key], { loading: true })); });
                    }
                    else {
                        ptr_1[act.keys] = __assign({}, ptr_1[act.keys], { loading: true });
                    }
                }
                else if (act.action === 'set' || act.action === 'error') {
                    var dataHash_1 = setItem(act);
                    if (dataHash_1 === undefined || dataHash_1 === null) {
                        if (setItem !== setItemDefault) {
                            dataHash_1 = setItemDefault(act);
                        }
                    }
                    if (dataHash_1) {
                        Object.keys(dataHash_1).forEach(function (key) {
                            ptr_1[key] = __assign({}, dataHash_1[key], { loading: false });
                        });
                    }
                }
            }
            return nstate;
        }
        return state;
    }
    if (opt.middleware) {
        return function (state, act) {
            return opt.middleware(state, act, reducer);
        };
    }
    else {
        return reducer;
    }
}
exports.createReducer = createReducer;
//# sourceMappingURL=reduxReducer.js.map