const path = require('path')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')

module.exports = {
  webpack(config, env) {
    config = rewireReactHotLoader(config, env)
    return config
  },
  devServer(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)
      // Add "./stats" folder to base directories
      config.contentBase = [config.contentBase, path.join(__dirname, 'stats')]
      return config
    }
  },
}
