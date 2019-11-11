const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

const prodConfig = {
    // 默认走的是生产模式，代码经过压缩
    mode: 'production',
    // 粗暴解释：告诉你源代码里哪一行出错了，而不是打包后的代码，有个映射关系
    devtool: 'cheap-module-source-map',
};

module.exports = merge(commonConfig, prodConfig);
