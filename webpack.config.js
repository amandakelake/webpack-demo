const path = require('path');

module.exports = {
    // 默认走的是生产模式，代码经过压缩
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                // url-loader比file-loader更叼一些 多了一个limit的配置参数
                // 把小于某size的文件打包成base64的格式，内嵌进代码里，不再是图片的形式，可以省http请求
                // url-loader works like file-loader, but can return a DataURL if the file is smaller than a byte limit.
                loader: 'url-loader',
                options: {
                    name: '[name]_[hash].[ext]',
                    outputPath: 'images',
                    limit: 2048,
                },
            },
        ],
    },
};
