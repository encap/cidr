module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: '\n@import "@/global.sass"\n',
        sassOptions: {
          indentedSyntax: true,
        },
      },
    },
  },
};
