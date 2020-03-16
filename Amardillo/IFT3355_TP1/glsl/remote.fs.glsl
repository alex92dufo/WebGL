// Mise à jour par: Alexandre Dufour (p1054564)

uniform int tvChannel;


void main() {
	// HINT: WORK WITH tvChannel HERE
	//Modification de la couleur du controlleur selon le poste choisi
	vec3 vChannel;

	if(tvChannel == 1)
	//Affiche vert
		vChannel = vec3(1,0,0);
	else if(tvChannel == 2)
	//Affiche vert
		vChannel = vec3(0,1,0);
	else if(tvChannel == 3)
	//Affiche bleu
		vChannel = vec3(0,0,1);

	//Paint it red
	gl_FragColor = vec4(vChannel, 1);

}