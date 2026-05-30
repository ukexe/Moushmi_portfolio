// Type declarations so TypeScript treats imported GLSL shader files as strings.
// Mirrors the webpack raw-loader + glslify-loader pipeline in next.config.js.

declare module "*.glsl" {
  const value: string;
  export default value;
}

declare module "*.vert" {
  const value: string;
  export default value;
}

declare module "*.frag" {
  const value: string;
  export default value;
}
