"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var count = 0;
var MyPromise = /** @class */ (function () {
    function MyPromise(fn) {
        this.callbacks = [];
        this.state = "pending";
        this.value = null; // 保存每次 resolve 结果
        console.log("constructor", this);
        // constructor MyPromise { callbacks: [], state: 'pending', value: null }
        // TODO: 经证实，下面想法错误，为什么？
        // 关键：每次初始化时，会将 this 指向上一个实例，这样才能够获得 callbacks
        fn(this._resolve.bind(this));
    }
    MyPromise.prototype.then = function (onFulfilled) {
        var _this = this;
        console.log("then");
        // 每次 .then 返回的是一个新的 Promise, 新的 Promise 实例和第一个实例之间是什么关系？
        return new MyPromise(function (resolve) {
            _this._handle({
                onFulfilled: onFulfilled,
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
        // 再次调用 resolve：把 res 赋值给 this.value，把它存下来
        callback.resolve(res);
    };
    // 初始化时只是 bind 绑定上下文，但是并没有执行
    // value 是 resolve 的值
    MyPromise.prototype._resolve = function (value) {
        var _this = this;
        console.log("_resolve");
        this.state = "fulfilled";
        console.log('this._resolve', this.callbacks);
        this.value = value;
        this.callbacks.forEach(function (cb) {
            console.log("forEach");
            // fn(value)
            _this._handle(cb);
        });
    };
    return MyPromise;
}());
var pro = new MyPromise(function (resolve) {
    // console.log("ready")
    // resolve("5 sec")
    // setTimeout(() => {
    //   console.log("done")
    //   resolve("5 sec")
    // }, 2000)
    utils_1.mockAjax("getUserId", 2, function (res) {
        resolve(res);
    });
})
    .then(function (res) {
    console.log("then1: >>", res);
    return 333;
})
    .then(function (res) { return console.log("then2: >>", res); });
