const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const config = {
  entry: {
    content: path.join(__dirname, 'src/content.ts'),
    background: path.join(__dirname, 'src/background.ts'),
    index: path.join(__dirname, 'src/index.tsx'),
  },
  output: { path: path.join(__dirname, 'build'), filename: '[name].js' },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: 'file-loader',
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    alias: {
      '@hours': path.resolve(__dirname, 'src/lib/hours'),

    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    watchContentBase: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public', to: '.' }],
    }),
  ],
  devtool: 'cheap-module-source-map',
  node: {
    global: true,
    __filename: true,
    __dirname: true,
  },
  optimization: {
    minimize: false,
}
}

module.exports = config;
