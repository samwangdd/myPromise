class MyPromise {
  callbacks = []
  state = "pending"
  value = null
  constructor(fn) {
    console.log("constructor")
    fn(this._resolve.bind(this))
  }

  then(onFulfilled: (res: any) => void) {
    console.log("then")
    if (this.state === "pending") {
      this.callbacks.push(onFulfilled)
    } else {
      onFulfilled(this.value)
    }
    return this
  }

  _resolve(value) {
    console.log("_resolve")
    this.state = "fulfilled"
    this.value = value
    this.callbacks.forEach((fn) => {
      console.log("forEach")
      fn(value)
    })
  }
}

let pro = new MyPromise((resolve) => {
  console.log("ready")
  resolve("5 sec")
  // setTimeout(() => {
  //   console.log("done")
  //   resolve("5 sec")
  // }, 2000)
})
  .then((res) => console.log("then1: >>", res))
  .then((res) => console.log("then2: >>", res))
