const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './index.js',
    output: {
        path: path.join(__dirname, './dist'),
    },
    plugins: [new CleanWebpackPlugin()],
};
