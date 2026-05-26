precision highp float;

uniform float uTime;
uniform float uPulseAmp;
uniform float uPulseFreq;
uniform float uSplit;

varying vec3  vNormal;
varying vec3  vViewDir;
varying float vRimFactor;

void main() {
  float switchY = 0.45;
  float upperT = clamp((0.9 - position.y) / (0.9 - 0.4), 0.0, 1.0);
  float upperWeight = upperT * upperT * (3.0 - 2.0 * upperT);

  float joinValue = 0.972;
  float joinSlope = -1.08;
  float lowerDepth = max(switchY - position.y, 0.0);
  float lowerSharpness = 14.0;
  float lowerGain = -joinSlope / lowerSharpness;
  float lowerWeight = joinValue + lowerGain * (exp(lowerSharpness * lowerDepth) - 1.0);

  float rimWeight = position.y > switchY ? upperWeight : lowerWeight;


  float TWO_PI = 6.28318530718;
  float PI     = 3.14159265359;

  float phase = fract(uTime * uPulseFreq / TWO_PI);

  float theta;
  if (phase < uSplit) {
      theta = (phase / uSplit) * PI;
  } else {
      theta = PI + ((phase - uSplit) / (1.0 - uSplit)) * PI;
  }

  float pulse = (1.0 - cos(theta)) * uPulseAmp - 0.1;
  vec3  localNormal = normalize(normal);
  vec3  displaced = position + localNormal * pulse * rimWeight;

  vRimFactor = clamp(rimWeight, 0.0, 1.0);
  vNormal    = normalize(normalMatrix * localNormal);
  vViewDir   = cameraPosition - (modelMatrix * vec4(displaced, 1.0)).xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
