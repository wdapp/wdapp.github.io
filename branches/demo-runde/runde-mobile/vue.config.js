module.exports = {
  lintOnSave: true,
  publicPath:
    process.env.NODE_ENV === "production"
      ? "/branches/demo-runde/runde-mobile/dist/"
      : "/",
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
