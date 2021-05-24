/*!
 * Next-static-pages v0.0.2-0
 * (c) Blujedis <blujedicorp@gmail.com>
 * Released under the MIT License.
 */

import fglob from 'fast-glob';
import { readFile } from 'fs';
import { parse, relative, sep, extname, join } from 'path';
import xss from 'xss';
import gmatter from 'gray-matter';
import markdown from 'markdown-it';
import hljs from 'highlight.js';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayLikeToArray);

var arrayWithoutHoles = createCommonjsModule(function (module) {
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

module.exports = _arrayWithoutHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(arrayWithoutHoles);

var iterableToArray = createCommonjsModule(function (module) {
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

module.exports = _iterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(iterableToArray);

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(unsupportedIterableToArray);

var nonIterableSpread = createCommonjsModule(function (module) {
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableSpread;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

unwrapExports(nonIterableSpread);

var toConsumableArray = createCommonjsModule(function (module) {
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

module.exports = _toConsumableArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _toConsumableArray = unwrapExports(toConsumableArray);

var asyncToGenerator = createCommonjsModule(function (module) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _asyncToGenerator = unwrapExports(asyncToGenerator);

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
module.exports["default"] = module.exports, module.exports.__esModule = true;
});

var _defineProperty = unwrapExports(defineProperty);

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var regenerator = runtime_1;

/**
 * Creates a slug from path segments and name.
 * 
 * @param segments array of segments used to create a slug.
 * @returns A slugified string.
 */

function slugify(segments) {
  return segments.map(function (v) {
    return v.replace(/[.\s]/g, '-');
  }).join('-');
}
/**
 * Ensures the result and an array of a given type.
 * 
 * @param arr an type or array of type.
 * @returns An array of the specified type.
 */

function normalizeArray(arr) {
  // if falsey or already array return array or empty array.
  if (Array.isArray(arr) || typeof arr === 'undefined' || !arr) return arr || [];
  return [arr];
}
/**
 * Removes/filters duplicate strings.
 * 
 * @param arr the array of paths to dedupe.
 * @returns De-duplicated array of paths.
 */

function dedupe(arr) {
  return arr.filter(function (v, i) {
    return arr.indexOf(v) === i;
  });
}
/**
 * Sanitizes content for safely injecting into innerHTML.
 * 
 * @param content the content to be sanitized.
 * @param options sanitization options.
 * @returns Sanitized HTML content.
 */

function sanitizer(content, options) {
  return xss(content, options);
}

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var DEFAULTS = {
  mode: 'render',
  directories: 'statics',
  extensions: ['md', 'html'],
  excludes: [],
  paramKey: 'slug',
  highlight: false,
  fallback: 'blocking',
  sanitize: '*',
  onSlugify: slugify,
  onBeforeRender: function onBeforeRender(content) {
    return content;
  }
};
/**
 * Creates simple Api for use with NextJS async static methods.
 * 
 * @example
 * ```tsx
 * import { FC } from 'react';
 * import nsp, { IRenderedProps } from 'next-static-pages';
 * const {getStaticPaths, getStaticProps} = nsp();
 * 
 * const MyComponent: FC<IRenderedProps> = ({ content }) => {
 *  return <div dangerouslySetInnerHTML={{ __html: content }} />;
 * };
 * 
 * export { getStaticPaths, getStaticProps };
 * export default MyComponent;
 * ```
 * 
 * @param initOptions initialization options.
 * @returns Api for use with async static methods in NextJS
 */

function nsp() {
  var initOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULTS;
  initOptions = _objectSpread({}, DEFAULTS, {}, initOptions); // ensure we have an array if extensions passed
  // ensure that each is prefixed with '.';

  initOptions.sanitize = normalizeArray(initOptions.sanitize).map(function (v) {
    if (v === '*') return v;
    return '.' + v.replace(/^\./, '');
  });
  var _ref = initOptions,
      directories = _ref.directories,
      paramKey = _ref.paramKey,
      fallback = _ref.fallback,
      initHighlight = _ref.highlight,
      mode = _ref.mode,
      excludes = _ref.excludes,
      extensions = _ref.extensions,
      onSlugify = _ref.onSlugify,
      onBeforeRender = _ref.onBeforeRender,
      sanitize = _ref.sanitize;
  var resolvedPaths = [];
  /**
   * Matches a route for rendering props based on locale and slug/key.
   * 
   * NOTE: if you end up here tracking down odd behavior don't second
   * guess yourself. Not done a ton of localization with static files this
   * may need to be revisited!!
   * 
   * @param resolved the resolved path configs.
   * @param slug the current slug to match.
   * @param locale optional locale to match.
   * @param allowFallback the current fallback mode.
   * @returns The resolved path or undefined if none was found.
   */

  function matchRoute(resolved, slug, locale) {
    var allowFallback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var _iterator = _createForOfIteratorHelper(resolved),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var config = _step.value;
        var localeMatch = !!locale && config.locale === locale;
        var slugMatch = !!slug && config.slug === slug; // Matching on both locale and slug.

        if (localeMatch && slugMatch) return config; // essentially matching on slug only when fallback
        // is set to true or blocking.

        if (locale && !localeMatch && allowFallback && slugMatch) return config; // No locale, no fallback matching ONLY on slug itself.

        if (!locale && !allowFallback && slugMatch) return config;
        if (!locale && slugMatch) return config;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return undefined;
  }
  /**
   * Reads a file from the file system.
   * 
   * NOTE: wrapper because jest when running in ci doesn't like import 'fs/promises';
   * 
   * @param path the path to be read.
   * @param options the read options to apply
   * @returns The file from file system.
   */


  function readFileAsync(_x, _x2) {
    return _readFileAsync.apply(this, arguments);
  }
  /**
   * Gets an array of path strings by way of resolving glob patterns.
   * 
   * @param patterns the glob patterns for loading paths.
   * @param options the fast-glob options to be applied.
   * @returns Array of path strings.
   */


  function _readFileAsync() {
    _readFileAsync = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(path, options) {
      return regenerator.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (res, rej) {
                readFile(path, options, function (err, data) {
                  if (err) return rej(err);
                  res(data);
                });
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _readFileAsync.apply(this, arguments);
  }

  function getPaths(dirs, options) {
    options = _objectSpread({
      ignore: normalizeArray(excludes)
    }, options, {
      onlyFiles: true // always only get files.

    }); // Build up globs from directories accounting for 
    // wether locales are being used.

    dirs = normalizeArray(directories);
    var exts = normalizeArray(extensions).map(function (v) {
      return v.replace('.', '');
    });
    var globs = dirs.map(function (v) {
      var suffix = exts.length > 1 ? "*.{".concat(exts.join(','), "}") : "*.".concat(exts[0]);
      suffix = "**".concat(sep).concat(suffix);
      return join(v, suffix);
    });
    return fglob(globs, options);
  }
  /**
   * Resolves globs mapping to resolved object map.
   * 
   * @param dirs the directories expressions to be resolved.  
   * @param locales an array of enabled internationalization locales.
   * @param options glob parsing options.
   * @returns Resolved path containing map of path, ext and slug.
   */


  function resolvePaths() {
    return _resolvePaths.apply(this, arguments);
  }
  /**
   * Renders markdown as html markup.
   * 
   * @param content the content to be rendered from markdown.
   * @param highlight when true apply syntax highlighting.
   * @returns html representation of markdown syntax.
   */


  function _resolvePaths() {
    _resolvePaths = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2() {
      var dirs,
          locales,
          defaultLocale,
          options,
          paths,
          _args2 = arguments;
      return regenerator.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              dirs = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : directories;
              locales = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : [];
              defaultLocale = _args2.length > 2 ? _args2[2] : undefined;
              options = _args2.length > 3 ? _args2[3] : undefined;
              dirs = normalizeArray(dirs);
              _context2.next = 7;
              return getPaths(dirs, options);

            case 7:
              paths = _context2.sent;
              return _context2.abrupt("return", dedupe(paths).map(function (path) {
                var _parse = parse(path),
                    dir = _parse.dir,
                    name = _parse.name,
                    ext = _parse.ext;

                var root = dirs.find(function (d) {
                  return dir.includes(d);
                });
                var relDir = relative(root, dir);
                var segments = relDir.length ? relDir.split(sep) : [];
                var locale = locales.find(function (v) {
                  return v === segments[0];
                }); // locale must be first after root dir.

                var slugSegments = locale ? segments.slice(1) : segments;
                slugSegments = [].concat(_toConsumableArray(slugSegments), [name]).filter(function (v) {
                  return !!v;
                });
                var slug = onSlugify(slugSegments, {
                  ext: ext,
                  root: root,
                  locale: locale
                });
                var result = {
                  path: path,
                  ext: ext,
                  slug: slug
                };
                if (locale) result.locale = locale;else if (defaultLocale) result.locale = defaultLocale;
                return result;
              }));

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _resolvePaths.apply(this, arguments);
  }

  function renderMarkdown() {
    var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var _highlight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : initHighlight;

    var config = !_highlight ? {} : {
      highlight: function highlight(str, lang) {
        if (!_highlight || !lang || !hljs.getLanguage(lang)) return str;
        return hljs.highlightAuto(str).value;
      }
    };
    var md = markdown(config);
    return md.render(content.toString());
  }
  /**
   * Reads and renders metadata and content for display in component.
   * 
   * @param path the path to be rendered.
   * @param highlight when true apply syntax highlighting.
   * @returns Returns metadata and static content to be rendered in component.
   */


  function renderFile(_x3) {
    return _renderFile.apply(this, arguments);
  }
  /**
   * Loads static paths and returns for use in "getStaticProps".
   * 
   * @param props get static paths properties including locales, default localse.
   * @returns Static paths array with slug param.
   */


  function _renderFile() {
    _renderFile = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee3(path) {
      var highlight,
          isMarkdown,
          buffer,
          ext,
          content,
          data,
          err,
          result,
          _args3 = arguments;
      return regenerator.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              highlight = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : initHighlight;

              if (path) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt("return", {
                data: {},
                content: ''
              });

            case 3:
              isMarkdown = /\.md$/.test(path);
              _context3.next = 6;
              return readFileAsync(path);

            case 6:
              buffer = _context3.sent;
              ext = extname(path);
              content = buffer.toString();
              data = {};
              err = '';

              try {
                if (isMarkdown) {
                  result = gmatter(content);
                  data = result.data;
                  if (sanitize.includes('*') || sanitize.includes(ext)) content = sanitizer(result.content);
                  content = renderMarkdown(result.content, highlight);
                } else if (highlight) {
                  if (sanitize.includes('*') || sanitize.includes(ext)) content = sanitizer(content);
                  content = hljs.highlightAuto(content).value;
                }

                content = onBeforeRender(content);
              } // eslint-disable-next-line
              catch (ex) {
                err = ex;
                console.log(ex.stack);
              }

              return _context3.abrupt("return", {
                content: content,
                data: data,
                err: err
              });

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _renderFile.apply(this, arguments);
  }

  function getStaticPaths(_x4) {
    return _getStaticPaths.apply(this, arguments);
  }
  /**
   * Consumes static paths params, renders metadata and content returning as props to be passed to Component.
   * 
   * @param props static props including route params by slug key.
   * @returns Static props to be passed to your component.
   */


  function _getStaticPaths() {
    _getStaticPaths = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee4(props) {
      var locales, defaultLocale, paths;
      return regenerator.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // Get the enabled locales if any.
              locales = props.locales || [];
              defaultLocale = props.defaultLocale; // Resolve paths 

              _context4.next = 4;
              return resolvePaths(directories, locales, defaultLocale);

            case 4:
              resolvedPaths = _context4.sent;
              paths = resolvedPaths.map(function (v) {
                return {
                  params: _defineProperty({}, paramKey, v.slug)
                };
              });
              return _context4.abrupt("return", {
                paths: paths,
                fallback: fallback
              });

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _getStaticPaths.apply(this, arguments);
  }

  function getStaticProps(_x5) {
    return _getStaticProps.apply(this, arguments);
  }

  function _getStaticProps() {
    _getStaticProps = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee5(props) {
      var locale, locales, defaultLocale, slug, config, path, rendered;
      return regenerator.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              locale = props.locale, locales = props.locales, defaultLocale = props.defaultLocale;

              if (resolvedPaths.length) {
                _context5.next = 5;
                break;
              }

              _context5.next = 4;
              return resolvePaths(directories, locales, defaultLocale);

            case 4:
              resolvedPaths = _context5.sent;

            case 5:
              if (!(mode === 'resolved')) {
                _context5.next = 7;
                break;
              }

              return _context5.abrupt("return", {
                props: {
                  resolved: resolvedPaths
                }
              });

            case 7:
              slug = props.params ? props.params[paramKey] : '';
              config = matchRoute(resolvedPaths, slug, locale, fallback);
              path = (config === null || config === void 0 ? void 0 : config.path) || '';
              _context5.next = 12;
              return renderFile(path);

            case 12:
              rendered = _context5.sent;
              return _context5.abrupt("return", {
                props: _objectSpread({}, rendered)
              });

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _getStaticProps.apply(this, arguments);
  }

  return {
    getStaticPaths: getStaticPaths,
    getStaticProps: getStaticProps
  };
}

export default nsp;
export { nsp };
