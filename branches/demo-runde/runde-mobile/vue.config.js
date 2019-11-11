module.exports = {
  lintOnSave: true,
  publicPath: "/branches/demo-runde/runde-web/dist/",
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        images: "@/assets/images",
        styles: "@/assets/styles",
        common: "@/common",
        components: "@/common/components",
        views: "@/views"
      }
    }
  }
};
