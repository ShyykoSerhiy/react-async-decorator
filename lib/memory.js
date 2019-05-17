"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reduxReducer_1 = require("./reduxReducer");
var promise_1 = require("./promise");
function createMemoryStore(opt, initState) {
    if (initState === void 0) { initState = {}; }
    var _a;
    var key = opt.key;
    var reducer = reduxReducer_1.createReducer(opt);
    var state = (_a = {}, _a[key] = initState, _a);
    var ret = {
        getState: function () {
            return state;
        },
        dispatch: function (action) {
            state = reducer(state, action);
            return action;
        },
    };
    return ret;
}
exports.createMemoryStore = createMemoryStore;
function snapshotStoreFetcher(holderState) {
    if (!holderState) {
        return {};
    }
    return Object.keys(holderState).reduce(function (m2, name) {
        var ptr = holderState[name];
        if (ptr) {
            m2[name] = new promise_1.TSyncPromise(function (resolve) { return resolve(ptr.data); });
        }
        return m2;
    }, {});
}
exports.snapshotStoreFetcher = snapshotStoreFetcher;
function snapshotStore(state, container) {
    if (container === void 0) { container = {}; }
    if (!state) {
        return container;
    }
    return Object.keys(state).reduce(function (memo, key) {
        var holderState = state[key];
        if (holderState) {
            memo[key] = snapshotStoreFetcher(holderState);
        }
        return memo;
    }, container);
}
exports.snapshotStore = snapshotStore;
//# sourceMappingURL=memory.js.map