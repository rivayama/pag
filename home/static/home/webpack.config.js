// webpack.config.js
module.exports = {
  entry : './src/scripts/main.js',   // メインとなるのjsパス
  output: {
    path    : __dirname + '/build/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{                     // require('**.js'); jsxのコンパイル設定
      test  : /\.js$/,
      loader: 'jsx-loader?harmony'  //es6の記法を使いたいのでharmonyを追加する
    }, {
      test  : /\.styl$/,            // require('**.styl')の設定
      loader: 'style!css!stylus'
    }]
  },
  externals: {
    // Reactをnpmからでなくグローバルから取得する
    // この設定がないとcompileが遅くなる
    'react': 'React'
  },
  resolve: {
    extensions: ['', '.js', '.json', '.coffee']
  }
};
