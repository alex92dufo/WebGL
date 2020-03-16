// Mise à jour par: Alexandre Dufour (p1054564)

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 robotPosition;
varying vec3 interpolatedNormal;

void main() {
	//Ajout de la position du controleur dans la monde à la position de chaque pixel
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + robotPosition, 1.0);
    interpolatedNormal = normal;
}
