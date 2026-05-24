precision highp float;

uniform float uTime;
uniform float uPulseAmp;
uniform float uPulseFreq;

varying vec3  vNormal;
varying vec3  vViewDir;
varying float vRimFactor;

void main() {
  float rimWeight = smoothstep(0.9, 0.5, position.y);
  float pulse     = sin(uTime * uPulseFreq) * uPulseAmp - 0.12;
  vec3  displaced = position + normal * pulse * rimWeight;

  vRimFactor = rimWeight;
  vNormal    = (modelMatrix * vec4(normal,    0.0)).xyz;
  vViewDir   = cameraPosition - (modelMatrix * vec4(displaced, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
