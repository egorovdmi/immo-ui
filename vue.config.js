module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(options => {
      options[0].chunks = ["app", "chunk-vendors"];
      return options;
    });
  },
  devServer: {
    // public: "brave-duck-20.localtunnel.me",
    proxy: {
      "^/api": {
        target: "http://localhost:3000",
        ws: true
      }
    }
  }
};
