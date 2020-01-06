// 一个类
class LgcWebpackPlugin {
    constructor(options) {
        this.options = options;
    }
    // 定义 apply 方法。
    apply(compiler) {
        // 指定一个触及到 webpack 本身的  [事件钩子](https://webpack.docschina.org/api/compiler-hooks/) 。
        compiler.hooks.emit.tapAsync('LgcWebpackPlugin', (compilation, callback) => {
            // 操作 webpack 内部的实例特定数据。
            debugger;
            console.log('compilation', compilation);
            // 在实现功能后调用 webpack 提供的 callback
            callback();
        });
    }
}

module.exports = LgcWebpackPlugin;
