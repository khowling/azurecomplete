var webpack = require('webpack');
var path = require('path');
var util = require('util');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var version = '0.0.0.1',
    name =  'webapp' 

var jsBundle = path.join('js', util.format('[name].%s.js', version));
var fileLoader = 'file-loader?name=[path][name].[ext]';
var htmlLoader = fileLoader + '!' +
   'template-html-loader?' + [
     'raw=true',
     'engine=lodash',
     'VERSION=' + version,
     'TITLE=' + name,
     'SERVER_URL='
   ].join('&')

console.log ('htmlLoader' + htmlLoader);

module.exports = {
    context: path.join(__dirname, 'app'),
    entry:  {app: ['./app_index.jsx']},
    target: "web",
    output: {
        path: path.resolve('./_package/_static'),
        filename: jsBundle,
        publicPath: "/"
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin()
    ],
    node: {
        fs: "empty"
    },
    module: {
        loaders: [
            {
              test: /\.jsx$|\.es6$/,
              exclude: /node_modules/,
              loaders:  ['react-hot', 'babel-loader?presets[]=react,presets[]=es2015,presets[]=stage-0']
            },
            {
              test: /\.html$/,
              loader: htmlLoader
            },
            {
              test: /\.json$/,
              loader: 'json-loader'
            },
            {
              test: /\.scss$|\.css$/,
              loaders: ["style", "css", "sass"]
            }
        ]
    }
};

