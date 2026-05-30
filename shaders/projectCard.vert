// Vertex shader for project cards.
// Pushes the plane's vertices along Z in a ripple that radiates from the
// cursor's UV position, scaled by the hover amount so it only appears on hover.

uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Distance (in UV space) from this vertex to the cursor.
  float dist = distance(uv, uMouse);

  // Concentric travelling wave, strongest near the cursor and only while hovered.
  float wave = sin(dist * 15.0 - uTime * 3.0) * 0.02 * uHover * (1.0 - dist);
  pos.z += wave;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
