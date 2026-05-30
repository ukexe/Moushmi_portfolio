// Fragment shader for project cards.
// Samples the project texture with a radial UV displacement that breathes
// in/out over time, scaled by hover so the image gently warps on hover.

uniform sampler2D uTexture;
uniform float uHover;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Push UVs outward from the centre, pulsing with time and gated by hover.
  float dist = distance(uv, vec2(0.5));
  uv += normalize(uv - vec2(0.5)) * dist * 0.08 * uHover * sin(uTime * 2.0);

  vec4 color = texture2D(uTexture, uv);
  gl_FragColor = color;
}
