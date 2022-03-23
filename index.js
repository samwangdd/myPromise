var MyPromise = /** @class */ (function () {
    function MyPromise(fn) {
        this.callbacks = [];
        this.state = "pending";
        this.value = null;
        console.log("constructor");
        fn(this._resolve.bind(this));
    }
    MyPromise.prototype.then = function (onFulfilled) {
        console.log("then");
        if (this.state === "pending") {
            console.log("pending");
            this.callbacks.push(onFulfilled);
        }
        else {
            console.log("onFulfilled");
            onFulfilled(this.value);
        }
        return this;
    };
    MyPromise.prototype._resolve = function (value) {
        console.log("_resolve");
        this.state = "fulfilled";
        this.value = value;
        this.callbacks.forEach(function (fn) {
            console.log("forEach");
            fn(value);
        });
    };
    return MyPromise;
}());
var pro = new MyPromise(function (resolve) {
    console.log("ready");
    resolve("5 sec");
    // setTimeout(() => {
    //   console.log("done")
    //   resolve("5 sec")
    // }, 2000)
})
    .then(function (res) { return console.log("then1: >>", res); })
    .then(function (res) { return console.log("then2: >>", res); });
