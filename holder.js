function createAccessor() {
    var container = {};
    function clear() {
        container = {};
    }
    function set(key, val) {
        container[key] = val;
    }
    function has(key) {
        return container.hasOwnProperty(key);
    }
    function get(key) {
        return container[key];
    }
    return { clear, set, has, get };
}


function Holder(opts) {
    this.accesor = opts.accesor ? opts.accesor(opts.name) : createAccessor();
    this.container = {};
}

Holder.prototype.clear = function() {
    this.accesor.clear();
    this.container = {};
}


Holder.prototype.get = function(key) {
    return this.accesor.get(key);
}

Holder.prototype.has = function(key) {
    return this.accesor.has(key);
}

Holder.prototype.error = function(key) {
    var ptr = this.container[key];
    return ptr ? ptr.error : undefined;
}


Holder.prototype.set = function(key, defer) {
    if (!defer || !defer.then) {
        defer = Promise.resolve(defer);
    }
    var ptr = {
        error: undefined,
        defer: defer
    };
    this.container[key] = ptr;
    var t = this;
    defer.then(function(data) {
        t.accesor.set(key, data);
    }, function(err) {
        t.accesor.set(key, undefined);
        ptr.error = err;
    });
}

Holder.prototype.await = function (key) {
    var ptr = this.container[key];
    if (ptr && ptr.defer) {
        return ptr.defer;
    }
    return Promise.reject('Bucket with key:' + key + ' doesn\' exist');
}

Holder.prototype.awaitAll = function() {
    var t = this;
    const defers = Object.keys(this.container).map(function(key) {
        return t.await(key);
    });
    return Promise.all(defers);
}

module.exports.Holder = Holder;
module.exports.createAccessor = createAccessor;
