"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Iterator = /** @class */ (function () {
    function Iterator(count, onSuccess, onFail) {
        var _this = this;
        this.count = count;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.data = [];
        this.executed = false;
        this.handleSuccess = function (data, index) {
            _this.data[index] = data;
            _this.count--;
            if (_this.count <= 0 && !_this.executed) {
                _this.executed = true;
                _this.onSuccess(_this.data);
            }
        };
        this.handleError = function (error) {
            if (!_this.executed && !_this.error) {
                _this.error = error;
                _this.executed = true;
                _this.onFail(_this.error);
            }
        };
    }
    return Iterator;
}());
exports.Iterator = Iterator;
var TSyncPromise = /** @class */ (function () {
    function TSyncPromise(fn) {
        var _this = this;
        if (fn) {
            fn(function (data) { return _this.setData('resolved', data); }, function (data) { return _this.setData('rejected', data); });
        }
    }
    TSyncPromise.resolve = function (data) {
        if (data instanceof Promise) {
            return new TSyncPromise(function (resolve, reject) { return data.then(resolve, reject); });
        }
        else if (data && data.toString && data.toString() === 'TSyncPromise') {
            return data;
        }
        else {
            var p = new TSyncPromise(null);
            p.data = { type: 'resolved', data: data };
            return p;
        }
    };
    TSyncPromise.reject = function (data) {
        var p = new TSyncPromise(null);
        p.data = { type: 'rejected', data: data };
        return p;
    };
    TSyncPromise.all = function (p) {
        return new TSyncPromise(function (resolve, reject) {
            if (!p.length) {
                return resolve([]);
            }
            var iterator = new Iterator(p.length, resolve, reject);
            p.forEach(function (arg, index) {
                if (arg instanceof Promise || (arg.toString && arg.toString() === 'TSyncPromise')) {
                    arg.then(function (d) { return iterator.handleSuccess(d, index); }, iterator.handleError);
                }
                else {
                    iterator.handleSuccess(arg, index);
                }
            });
        });
    };
    TSyncPromise.prototype.setData = function (type, data) {
        var _this = this;
        if (!this.data) {
            if (data instanceof Promise || (data && data.toString() === 'TSyncPromise')) {
                data.then(function (data) { return _this.setData('resolved', data); }, function (err) { return _this.setData('rejected', err); });
            }
            else {
                this.data = { type: type, data: data };
                if (this.onApply) {
                    this.onApply.forEach(function (cb) {
                        cb(type === 'rejected' ? data : undefined, type === 'resolved' ? data : undefined);
                    });
                    this.onApply = undefined;
                }
            }
        }
    };
    TSyncPromise.prototype.then = function (onfulfilled, onrejected) {
        var _this = this;
        var d = this.data;
        if (d) {
            if (onfulfilled && d.type === 'resolved') {
                var p = onfulfilled(d.data);
                return TSyncPromise.resolve(p);
            }
            else if (onrejected && d.type === 'rejected') {
                var p = onrejected(d.data);
                return TSyncPromise.resolve(p);
            }
            else {
                return this;
            }
        }
        else {
            var buf_1 = this.onApply || (this.onApply = []);
            return new TSyncPromise(function (resolve, reject) {
                return buf_1.push(function (_) {
                    var d = _this.data;
                    if (d.type === 'resolved') {
                        var p = onfulfilled ? onfulfilled(d.data) : d.data;
                        resolve(p);
                    }
                    else if (d.type === 'rejected') {
                        if (onrejected) {
                            var p = onrejected(d.data);
                            resolve(p);
                        }
                        else {
                            reject(d.data);
                        }
                    }
                    else {
                        reject(new Error('unexpected error'));
                    }
                });
            });
        }
    };
    TSyncPromise.prototype.catch = function (onrejected) {
        return this.then(undefined, onrejected);
    };
    TSyncPromise.prototype.finally = function (onCb) {
        return this.then(onCb, onCb);
    };
    TSyncPromise.prototype.toPromise = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return _this.then(resolve, reject); });
    };
    TSyncPromise.prototype.toString = function () {
        return 'TSyncPromise';
    };
    return TSyncPromise;
}());
exports.TSyncPromise = TSyncPromise;
//# sourceMappingURL=promise.js.map