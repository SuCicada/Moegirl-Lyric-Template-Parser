String.prototype.iterator = function (action, canNext) {
    // 这里不能用 es6 的箭头函数, 参见
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    // 迭代自己, 当exit函数执行结果为 true 就结束迭代
    let str = this
    while (canNext(str)) {
        str = action(str)
    }
    return str
}
/*
function loadJS(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = function () {
            console.log(url + " load success")
            resolve && resolve();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    })
}
*/
