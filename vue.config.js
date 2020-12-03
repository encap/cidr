module.exports = {
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          indentedSyntax: true,
        },
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          signAndEditExecutable: false,
          target: [
            'portable',
          ],
        },
        portable: {
          artifactName: 'cidr-portable.exe',
        },
      },
    },
  },
  outputDir: './docs',
  publicPath: './',
};
