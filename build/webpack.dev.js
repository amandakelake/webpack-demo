const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const devConfig = {
    // 默认走的是生产模式，代码经过压缩
    mode: 'development',
    // 粗暴解释：告诉你源代码里哪一行出错了，而不是打包后的代码，有个映射关系
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        open: false, // 自动打开浏览器，访问本地地址
        compress: true,
        port: 8080,
        hot: true, // 开启HMR 模块热更新
        hotOnly: true, // 失败也不自动重启页面
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    optimization: {
        usedExports: true,
    },
};

module.exports = merge(commonConfig, devConfig);
