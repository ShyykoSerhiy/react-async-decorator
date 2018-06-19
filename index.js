var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
    ({
        __proto__: []
      }
      instanceof Array && function (d, b) {
        d.__proto__ = b;
      }) ||
    function (d, b) {
      for (var p in b)
        if (b.hasOwnProperty(p)) d[p] = b[p];
    };
  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();

function wrapRender(render, renderLoader, renderError) {
  var catchDefer = null;
  var tLoader = typeof renderLoader;
  var tError = typeof renderError;
  return function () {
    try {
      return render.apply(this, arguments);
    } catch (e) {
      if (e instanceof Promise || (e.toString && e.toString() === 'TSyncPromise')) {
        if (catchDefer !== e) {
          catchDefer = e;
          var ctx = this;
          function forceUpdate() {
            ctx.forceUpdate();
          }
          e.then(forceUpdate, forceUpdate);
        }
        return (tLoader === 'string' && typeof this[renderLoader] === 'function') ?
          this[renderLoader].call(this) :
          tLoader === 'function' ? renderLoader.call(this) : null
      } else {
        return (tError === 'string' && typeof this[renderError] === 'function') ?
          this[renderError].call(this, e) :
          tError === 'function' ? renderError.call(this, e) : null
      }
    }
  };
}
module.exports.asyncClassFactory = asyncClassFactory;

function asyncClassFactory(opts) {
  return function asyncClass(Base) {
    var constructor = Base.constructor;
    __extends(WrapClass, Base);

    function WrapClass() {
      Base.apply(this, arguments);
      var ptrLoader = this.renderLoader;
      var ptrError = this.renderError;
      if (opts) {
        var renderLoader = opts.renderLoader;
        if (typeof renderLoader === 'function') {
          ptrLoader = renderLoader;
        } else if (typeof renderLoader === 'string') {
          ptrLoader = this[renderLoader];
        }
        var renderError = opts.renderError;
        if (typeof renderError === 'function') {
          ptrError = renderError;
        } else if (typeof renderError === 'string') {
          ptrError = this[renderError]
        }
      }
      if (this.renderLoader === undefined) {
        this.renderLoader = ptrLoader;
      } else {
        ptrLoader = this.renderLoader;
      }
      if (this.renderError === undefined) {
        this.renderError = ptrError;
      } else {
        ptrError = this.renderError;
      }
      this.render = wrapRender(this.render, ptrLoader, ptrError);
      return this;
    }
    return WrapClass;
  }

}
module.exports.asyncClass = asyncClassFactory();

module.exports.asyncMethodFactory = asyncMethodFactory;

function asyncMethodFactory(opts) {
  return function (target, key, descriptor) {
    var fn = descriptor.value;
    if (typeof fn !== 'function') {
      throw new Error('decorator can only be applied to methods not: ' + typeof fn);
    }
    return {
      configurable: true,
      get: function () {
        const wrapper = wrapRender(
          fn,
          (opts && opts.renderLoader) || 'renderLoader',
          (opts && opts.renderError) || 'renderError'
        );
        if (this === target.prototype) {
          return wrapper;
        }
        var boundFn = wrapper.bind(this);
        Object.defineProperty(this, key, {
          value: boundFn,
          configurable: true,
          writable: true
        });
        return boundFn;
      }
    };
  }

}
module.exports.asyncMethod = asyncMethodFactory();

module.exports.initFetchers = require('./lib/fetcher').create;
module.exports.initReduxFetchers = require('./lib/redux').initRedux;
