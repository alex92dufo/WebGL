/**
 * UdeM IFT 3355, H20
 * TP 3 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */
uniform vec3 lightDirection;
varying vec4 V_Normal_VCS;
varying vec4 V_ViewPosition;

varying vec3 interpolatedNormal;


void main() {

	// ADJUST THESE VARIABLES TO PASS PROPER DATA TO THE FRAGMENTS

	interpolatedNormal = normal;

	V_Normal_VCS = reflect(normalize(vec4(-lightDirection, -1.0)), normalize(vec4(normal, 1.0)));
	V_ViewPosition = modelViewMatrix*normalize(vec4(position, 1.0));


	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}