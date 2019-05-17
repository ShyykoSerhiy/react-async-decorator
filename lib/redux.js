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
var fetcher_1 = require("./fetcher");
exports.Fetcher = fetcher_1.Fetcher;
var reduxReducer_1 = require("./reduxReducer");
function initRedux(opt) {
    var api;
    function use(aApi) {
        api = aApi;
    }
    var store = {
        getState: function () {
            return api.getState();
        },
        dispatch: function (action) {
            return api.dispatch(action);
        },
    };
    // reducer initialize after create call
    var reducer;
    // it's sync callback which call after create call
    function createStore(opt) {
        reducer = reduxReducer_1.createReducer(opt);
        return store;
    }
    var fn = fetcher_1.create(__assign({}, opt, { createStore: createStore }));
    return { use: use, reducer: reducer, createFetcher: fn };
}
exports.initRedux = initRedux;
//# sourceMappingURL=redux.js.map