// Mise à jour par: Alexandre Dufour (p1054564)

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 remotePosition;



void main() {
	/* HINT: WORK WITH remotePosition HERE! */

    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    //Ajout de la position du controleur dans la monde à la position de chaque pixel
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position + remotePosition, 1.0);
}
