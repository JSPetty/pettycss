const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const ASSET_PATH = process.env.ASSET_PATH || '/'
const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
    entry: {},
    output: {
        chunkFilename: '[name].[chunkhash].chunk.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: ASSET_PATH
    },
    resolveLoader: {
        modules: ['node_modules'],
        extensions: ['.js', '.json'],
        mainFields: ['loader', 'main']
    },
    externals: {
        '$': 'window.jQuery',
        'jQuery': 'window.jQuery'
    },
    devServer: {
        contentBase: '/', 
        publicPath: '/',
        index: 'index.html',
        hot: true,
        historyApiFallback: true, 
        //contentBase: path.join(__dirname, 'dist'),
        // contentBase:  path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({filename: 'style.css'})
    ]
}

if (NODE_ENV === 'production') {
    module.exports.mode = 'production'
    module.exports.entry.index = [
        './src/index.js'
    ]
    module.exports.output.filename = '[name].[chunkhash].js'
    module.exports.optimization = {
        splitChunks: {
            chunks: 'all',
            name: 'common'
        },
        runtimeChunk: {
            name: 'runtime'
        }
    }
    module.exports.plugins = (module.exports.plugins || []).concat([
        new HtmlWebpackPlugin({
            template:  path.resolve(__dirname, 'index.html'),
            inject: 'head'
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify('production'),
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        })
    ])
    module.exports.devtool = 'source-map'
} else {
    module.exports.entry.index = [
        './src/index.js'
    ]
    module.exports.mode = 'development'
    module.exports.output.filename = '[name].js'
    module.exports.plugins = (module.exports.plugins || []).concat([
        new HtmlWebpackPlugin({
            template:  path.resolve(__dirname, 'index.html'),
            inject: 'head'
        }),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify('development'),
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
        }),
        new webpack.HotModuleReplacementPlugin()
    ])
    module.exports.devtool = 'eval-source-map'
}