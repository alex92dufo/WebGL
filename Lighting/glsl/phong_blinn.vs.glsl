/**
 * UdeM IFT 3355, H20
 * TP 3 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */
varying vec4 V_Normal_VCS;
varying vec4 V_ViewPosition;

uniform vec3 lightDirection;
varying vec3 interpolatedNormal;

void main() {

	// ADJUST THESE VARIABLES TO PASS PROPER DATA TO THE FRAGMENTS
	//V_Normal_VCS = vec4(1.0,0.0,0.0, 1.0);
	//V_ViewPosition = vec4(1.0,0.0,0.0, 1.0);

	interpolatedNormal = normal;

	V_Normal_VCS = reflect(vec4(-lightDirection, -1.0), vec4(normal, 1.0));
	V_ViewPosition = modelViewMatrix*normalize(vec4(position, 1.0));

	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}