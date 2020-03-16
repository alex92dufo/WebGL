// Mise à jour par: Alexandre Dufour (p1054564)

varying vec3 interpolatedNormal;


void main() {
	// HINT: WORK WITH tvChannel HERE
	//Modification de la couleur du controlleur selon le poste choisi

	gl_FragColor = vec4(normalize(interpolatedNormal), 1);

}