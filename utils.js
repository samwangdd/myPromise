"use strict";
exports.__esModule = true;
function mockAjax(url, delay, callback) {
    setTimeout(function () {
        callback(url + " \u5F02\u6B65\u8BF7\u6C42\u8017\u65F6 " + delay + " \u79D2");
    }, delay * 1000);
}
exports.mockAjax = mockAjax;
