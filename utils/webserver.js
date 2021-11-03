// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
process.env.ASSET_PATH = '/';
const PORT = 3002;
const WebpackDevServer = require('webpack-dev-server'),
  webpack = require('webpack'),
  config = require('../webpack.config'),
  path = require('path');


delete config.chromeExtensionBoilerplate;

const compiler = webpack(config);

const server = new WebpackDevServer({
  static: {
    directory: path.join(__dirname, '../build'),
  },
  https: false,
  hot: false,
  port: PORT,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  allowedHosts: "all",
  devMiddleware: {
    publicPath: `http://localhost:${PORT}`,
    writeToDisk: true,
  },
}, compiler);

server.listen(PORT);
