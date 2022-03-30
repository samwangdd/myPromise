"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var count = 0;
var MyPromise = /** @class */ (function () {
    function MyPromise(fn) {
        this.callbacks = [];
        this.state = "pending";
        this.value = null; // 保存每次 resolve 结果
        console.log("constructor " + count, this);
        // constructor MyPromise { callbacks: [], state: 'pending', value: null }
        // TODO: 经证实，下面想法错误，为什么？
        // 关键：每次初始化时，会将 this 指向上一个实例，这样才能够获得 callbacks
        fn(this._resolve.bind(this));
    }
    MyPromise.prototype.then = function (onFulfilled) {
        var _this = this;
        console.log("then");
        // 每次 .then 返回的是一个新的 Promise, 新的 Promise 实例和第一个实例之间是什么关系？会覆盖之前的 Promise 实例
        return new MyPromise(function (resolve) {
            _this._handle({
                onFulfilled: onFulfilled,
                // 关键：这个 resolve 是当前 Promise 的，resolve 执行会改变状态，并执行 callbaacks 回调
                // 这个 resolve 是什么时候调用？
                resolve: resolve,
                name: "promise " + count
            });
        });
    };
    MyPromise.prototype._handle = function (callback) {
        if (this.state === "pending") {
            this.callbacks.push(callback);
            count++;
            return;
        }
        // 如果 then 中没有传递任何函数？
        if (!callback.onFulfilled) {
            callback.resolve(this.value);
            return;
        }
        console.log("_handle callback", callback);
        // TODO: 关键逻辑
        // this.value 就是上次 promise return 的值
        // 如果没有 return 就是 undefined
        var res = callback.onFulfilled(this.value);
        // 调用下一个 Promise 的 resolve：把 res 赋值给 this.value，保存下来
        callback.resolve(res);
    };
    // 初始化时只是 bind 绑定上下文，但是并没有执行
    // value 是 resolve 的值
    MyPromise.prototype._resolve = function (value) {
        // 判断 resolve 的值是一个 promise 实例
        var _this = this;
        if (value && (typeof value === "object" || typeof value === "function")) {
            var then = value.then;
            if (typeof then === "function") {
                console.log("value", value);
                console.log("then", then);
                console.log("this", this);
                // FIXME: 什么意思？？
                then.call(value, this._resolve.bind(this));
                return;
            }
        }
        console.log("_resolve");
        this.state = "fulfilled";
        // 保存上一个 promise 的返回值
        this.value = value;
        // 第一次 resolve 拿到了第一个 then 的 callback
        this.callbacks.forEach(function (cb) {
            console.log("forEach");
            // fn(value)
            _this._handle(cb);
        });
    };
    return MyPromise;
}());
// const pUserId = new MyPromise((resolve) => {
//   mockAjax("getUserId", 1, function (result) {
//     resolve(result)
//   })
// })
var pUserName = new MyPromise(function (resolve) {
    utils_1.mockAjax("getUserName", 2, function (result) {
        resolve(result);
    });
});
var pro = new MyPromise(function (resolve) {
    utils_1.mockAjax("getUserId", 1, function (res) {
        resolve(res);
    });
})
    .then(function (res) {
    console.log("then1: >>", res);
    return pUserName;
    return 333;
})
    .then(function (res) { return console.log("then2: >>", res); });
