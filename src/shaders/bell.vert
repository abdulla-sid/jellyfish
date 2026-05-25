precision highp float;

uniform float uTime;
uniform float uPulseAmp;
uniform float uPulseFreq;
uniform float uSplit;

varying vec3  vNormal;
varying vec3  vViewDir;
varying float vRimFactor;

void main() {
  float rimWeight       = smoothstep(0.9, 0.5, position.y);

  float TWO_PI = 6.28318530718;
  float PI     = 3.14159265359;

  float phase = fract(uTime * uPulseFreq / TWO_PI);

  float theta;
  if (phase < uSplit) {
      theta = (phase / uSplit) * PI;
  } else {
      theta = PI + ((phase - uSplit) / (1.0 - uSplit)) * PI;
  }

  float pulse = (1.0 - cos(theta)) * uPulseAmp - 0.15;
  vec3  localNormal = normalize(normal);
  vec3  displaced = position + localNormal * pulse * rimWeight;

  vRimFactor = rimWeight;
  vNormal    = normalize(normalMatrix * localNormal);
  vViewDir   = cameraPosition - (modelMatrix * vec4(displaced, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
