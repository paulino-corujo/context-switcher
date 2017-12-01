const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const pkg = require('./package.json');

const GLOBAL_CONSTANTS = {
    GLOBAL_MENUS_VERSION: JSON.stringify(pkg.version)
};

module.exports = {

    entry: {
        'context-switcher': './src/index.js'
    },

    devtool: 'source-map',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.tpl\.html$/,
                loader: 'babel-loader!template-string-loader'
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-compiled-loader'
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['env', {modules: false}]]
                    }
                }
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')(),
                                require('cssnano')({
                                    zindex: false
                                })
                            ]
                        }
                    },
                    {loader: 'less-loader'}
                ]
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.png$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(['dist']),

        new UglifyJSPlugin({
            parallel: true,
            sourceMap: true,
            uglifyOptions: {
                ecma: 6,
                compress: {
                    warnings: true
                }
            }
        }),

        new CompressionPlugin(),

        new webpack.DefinePlugin(GLOBAL_CONSTANTS),

        new webpack.optimize.ModuleConcatenationPlugin(),
    ],

    devServer: {
        contentBase: path.resolve(__dirname, 'dist', pkg.version),
        port: 4600,
        disableHostCheck: true
    }

};