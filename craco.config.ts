const config = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          fs: false,
          path: false,
        },
      },
    },
  },
}
export default config
