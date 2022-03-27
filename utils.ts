export function mockAjax(url, delay, callback) {
  setTimeout(() => {
    callback(`${url} 异步请求耗时 ${delay} 秒`)
  }, delay * 1000)
}
