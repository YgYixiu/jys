module.exports = {
  lintOnSave: false,
  devServer: {
    overlay: {
      warning: false,
      errors: false
    },
    proxy: {
      '/api': {
        target: 'http://27.102.102.229',
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  },
  publicPath: './',
  productionSourceMap: false
};
