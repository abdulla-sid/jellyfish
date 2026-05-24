precision highp float;

uniform vec3  uColorTop;
uniform vec3  uColorBottom;
uniform float uRimPower;

varying vec3  vNormal;
varying vec3  vViewDir;
varying float vRimFactor;

void main() {
  vec3  N         = normalize(vNormal);
  vec3  V         = normalize(vViewDir);
  vec3  baseColor = mix(uColorTop, uColorBottom, vRimFactor);
  float facing    = clamp(dot(N, V), 0.0, 1.0);
  float fresnel   = pow(1.0 - facing, uRimPower);
  float alpha     = mix(0.18, 0.85, fresnel);
  gl_FragColor    = vec4(baseColor, alpha);
}
