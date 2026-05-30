/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow importing GLSL shader source files directly into TS/JS modules.
  // raw-loader turns the file into a string; glslify-loader resolves any
  // #pragma glslify imports before raw-loader stringifies the result.
  // (webpack applies loaders right-to-left, so glslify runs first.)
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader", "glslify-loader"],
    });

    return config;
  },
};

module.exports = nextConfig;
