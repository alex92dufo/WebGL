/**
 * UdeM IFT 3355, H20
 * TP 3 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */

// Create shared variable. The value is given as the interpolation between normals computed in the vertex shader
//Inspiré de https://en.wikibooks.org/wiki/GLSL_Programming/GLUT/Textured_Spheres
uniform sampler2D sphereTexture;
varying vec4 texCoord;

void main() {

	// LOOK UP THE COLOR IN THE TEXTURE
  vec2 texel = vec2((atan(texCoord.y, texCoord.x)/3.1415926 + 1.0)*0.5, (asin(texCoord.z)/3.1415926 + 0.5));
  // Set final rendered color according to the surface normal

  gl_FragColor = texture2D(sphereTexture, texel);
}
