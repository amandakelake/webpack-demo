const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    // 默认走的是生产模式，代码经过压缩
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    // 粗暴解释：告诉你源代码里哪一行出错了，而不是打包后的代码，有个映射关系
    devtool: process.env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
    entry: {
        main: './src/index.js',
        sub: './src/index.js',
    },
    output: {
        // publicPath: '//s3.cdn.com', // publicPath可以用来添加文件的地址前缀(比如CDN)或者文件夹
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js', // 上面的入口文件都会被引入
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
            {
                test: /\.(eot|ttf|svg)$/i,
                loader: 'file-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                // css-loader和style-loader 这两一般连着一起用，
                // 执行顺序   从下往上执行  从右到左
                // 先搞个加自动加前缀的postcss-loader+autoprefixer插件  https://github.com/postcss/autoprefixer#webpack
                // sass-loader就不用解释了，跟less一样的
                // css-loader会解析css文件内的@import import/require()等引用，并合并成同一个文件
                // style-loader 会把上面的一份css挂载到head标签内
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // scss里面直接@import其他的scss文件的时候，直接走css-loader  会漏掉前面的两个loader
                            // 所以此处 2 强制也要走postcss-loader和sass-loader
                            importLoaders: 2,
                            modules: true, // 样式模块化 CSS Module 防止样式冲突
                        },
                    },
                    'sass-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/tpl/index.html',
        }),
    ],
};
