import { withMDX } from '@next/mdx';

const config = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
};

export default withMDX({
  extension: /\.mdx?$/,
  options: {
    providerImportSource: "@mdx-js/react",
  },
})(config);
