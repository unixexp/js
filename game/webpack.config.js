const path = require('path');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/'
}

module.exports = (env = {}) => {

    const { mode = 'development' } = env;
    const isProd = mode === 'production';
    const isDev = mode === 'development';

    return {
        mode: isProd ? 'production': isDev && 'development',
        
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                      {
                        loader: 'babel-loader'
                      }
                    ]
                },

                {
                    test: /\.(ttf|otf|eot|woff|woff2)$/,
                    type: 'asset',
                    generator: {
                        filename: `${PATHS.assets}fonts/[name][ext]`
                    }
                },

                {
                    test: /\.(png|jpg|gif|svg)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `${PATHS.assets}img/[name][ext]`
                    }
                },

                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isProd ? MiniCSSExtractPlugin.loader: isDev && 'style-loader',
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        }
                    ]
                },

                {
                    test: /\.css$/,
                    use: [
                        isProd ? MiniCSSExtractPlugin.loader: isDev && 'style-loader',
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        }
                    ]
                }
            ]
        },

        resolve: {
            alias: {
                '~': PATHS.src
            }
        },

        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img`},
                    { from: `${PATHS.src}/${PATHS.assets}favicon.ico`, to: `${PATHS.dist}`}
                ]
            }),

            new MiniCSSExtractPlugin({
                filename: `${PATHS.assets}css/[name].[contenthash].css`
            }),

            ...glob.sync('./src/*.html').map((htmlFile) => {
                return new HtmlWebpackPlugin({
                    title: 'Music Market',
                    filename: path.basename(htmlFile),
                    template: `${PATHS.src}/${path.basename(htmlFile)}`,
                    inject: 'body',
                    minify: false,
                });
            })
        ],

        devServer: {
            historyApiFallback: true
        },

        entry: {
            app: `${PATHS.src}/index.js`
        },

        output: {
            path: PATHS.dist,
            filename: `${PATHS.assets}js/[name]-[contenthash].js`,
            clean: true
        }
    }
}