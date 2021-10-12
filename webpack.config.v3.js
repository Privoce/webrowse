var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs-extra'),
  env = require('./utils/env'),
  CopyWebpackPlugin = require('copy-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const IS_DEV = env.NODE_ENV == 'development';
const ASSET_PATH = process.env.ASSET_PATH || '/';

var alias = {
  'react-dom': '@hot-loader/react-dom',
  "socket.io-client": path.resolve(__dirname, "node_modules/socket.io-client/dist/socket.io.js"),
};

// load the secrets
var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

const buildFolder = env.NODE_ENV === 'development' ? 'dev' : 'build';

var options = {
  target: ['web'],
  mode: env.NODE_ENV || 'development',
  entry: {
    // newtab: path.join(__dirname, 'src', 'pages', 'Newtab', 'index.jsx'),
    // options: path.join(__dirname, 'src', 'pages', 'Options', 'index.js'),
    // popup: path.join(__dirname, 'src', 'pages', 'Popup', 'index.jsx'),
    background: path.join(__dirname, 'src', 'pages', 'Background', 'index.js'),
    contentScript: path.join(__dirname, 'src', 'pages', 'Content', 'index.js'),
    catchInviteId: path.join(__dirname, 'src', 'pages', 'Content', 'catchInviteId.js'),
    login: path.join(__dirname, 'src', 'pages', 'Login', 'index.js'),
    // devtools: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.js'),
    // panel: path.join(__dirname, 'src', 'pages', 'Panel', 'index.tsx'),
  },
  externals: {
    rangy: 'rangy'
  },
  chromeExtensionBoilerplate: {
    notHotReload: ['contentScript', 'devtools'],
  },
  output: {
    path: path.resolve(__dirname, buildFolder),
    filename: (pathData) => {
      if (pathData.chunk.name === 'login') return 'Login/index.js';
      return '[name].bundle.js';
    },
    publicPath: ASSET_PATH,
    clean: true
  },
  module: {
    rules: [
      {
        // look for .css or .scss files
        test: /\.(css|scss)$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        loader: require.resolve('file-loader'),
        // Exclude `js` files to keep "css" loader working as it injects
        // its runtime that would otherwise be processed through "file" loader.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [/\.(js|mjs|jsx|ts|tsx|css|svg)$/, /\.html$/, /\.json$/],
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 1000
            }
          },
        ],
      },
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.js', '.jsx', '.ts', '.tsx', '.css']),
    fallback: {
      "fs": false,
      "net": false,
      "tls": false,
      "child_process": false
    }
  },
  node: {
    global: false
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      "React": "react",
      global: require.resolve('./global.js'),
      Buffer: ['buffer', 'Buffer']
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, buildFolder),
          force: true,
          transform: function (content) {
            // generates the manifest file using the package.json informations
            const ori = JSON.parse(content.toString());
            // IS_DEV && ori['background']['scripts'].push('./hot-reload.bundle.js');
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                ...ori,
              })
            );
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: path.join(__dirname, buildFolder, 'assets'),
          force: true
        }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/_locales',
          to: path.join(__dirname, buildFolder, '_locales'),
          force: true
        }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/pages/Login/index.html',
          to: path.join(__dirname, buildFolder, 'Login'),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/pages/Options',
          to: path.join(__dirname, buildFolder, 'Options'),
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/pages/Popup',
          to: path.join(__dirname, buildFolder, 'Popup'),
          force: true,
        },
      ],
    }),
  ],
  infrastructureLogging: {
    level: 'info',
  },
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'inline-source-map';
  options.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/pages/Background/hot-reload.js',
          to: path.join(__dirname, buildFolder, 'hot-reload.bundle.js'),
          force: true,
        },
      ],
    })
  )
} else {
  options.optimization = {
    minimize: true,
    emitOnErrors: true
  };
}

module.exports = options;
