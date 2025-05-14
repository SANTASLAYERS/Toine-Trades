const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
  },
});

const config = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

module.exports = withMDX(config);