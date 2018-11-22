const path = require('path');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'index.js',
        library: '',
        libraryTarget: 'commonjs'
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            /*{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }*/
        ]
    }
};
