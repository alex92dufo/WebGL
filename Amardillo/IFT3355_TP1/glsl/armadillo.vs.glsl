// Mise à jour par: Alexandre Dufour (p1054564)

// Create shared variable for the vertex and fragment shaders
varying vec3 interpolatedNormal;

/* HINT: YOU WILL NEED A DIFFERENT SHARED VARIABLE TO COLOR ACCORDING TO POSITION */
uniform vec3 remotePosition;
uniform int tvChannel;
uniform float rotation;

void main() {
    // Set shared variable to vertex normal
    
    // Multiply each vertex by the model-view matrix and the projection matrix to get final vertex position
    mat4 transform;

    if(tvChannel == 1)
    //État de base
        transform = mat4(1,0,0,0,
                         0,1,0,0,
                         0,0,1,0,
                         0,0,0,1);

    else if(tvChannel == 2){
    //Fait tourner le haut du corps de l'amardillo dans un arc de cercle de rotation
        float cosAngle = cos(rotation);
        float sinAngle = sin(rotation);

        if(position[1] > 0.5)
        transform = mat4(-cosAngle,0,sinAngle,0,
                         0,1,0,0,
                         -sinAngle,0,-cosAngle,0,
                         0,0,0,1);
        else
            transform = mat4(1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1);
    }
    //Affiche le bas du corps de Amardillo avec un sin, donne l'apparence d'un génie, si on veut.
    else if(tvChannel == 3){
        float angle = -90.0;
        float radAngle = radians(angle);
        float cosAngle = cos(radAngle);
        float sinAngle = sin(radAngle);
        transform = mat4(1,0,0,0,
                         0,cosAngle,-sinAngle,0,
                         0,sinAngle,cosAngle,0,
                         0,0,0,1) *
                     mat4(1, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, 0, 0,
                         0, 0, 1, 1);

    }
    //Affiche un amardillo à quatre patte, plus comme un vrai amadillo
    else if(tvChannel == 4){
        //Descend le torse parallèle au sol
        if (position[1] < 1.0 && position[1] > 0.5){
            float angle = 90.0;
            float radAngle = radians(angle);
            float cosAngle = cos(radAngle);
            float sinAngle = sin(radAngle);
            transform = mat4(1,0,0,0,
                             0,cosAngle,-sinAngle,0,
                             0,sinAngle,cosAngle,0,
                             0,0,0.5,1);
        }
        //Ramène le haut du corps devant le torse
        else if(position[1] > 1.0) {
            transform = mat4(1, 0, 0, 0,
                             0, 1, 0, 0,
                             0, 0, 1, 0,
                             0, -1, -1, 1);
            //Place les pattes avant vers le sol
            if(position[0] > 0.5 || position[0] < -0.5 ){
                float angle = 90.0;
                float radAngle = radians(angle);
                float cosAngle = cos(radAngle);
                float sinAngle = sin(radAngle);
                transform = mat4(1,0,0,0,
                                 0,cosAngle,-sinAngle,0,
                                 0,sinAngle,cosAngle,0,
                                 0,0,0.5,1);
            }
        }
        //Laisse les pattes arrières à leur place
        else {
            transform = mat4(1, 0, 0, 0,
                             0, 1, 0, 0,
                             0, 0, 1, 0,
                             0, 0, 0, 1);
        }
    }
    //Amardillo écrasé par une voiture
    else if(tvChannel == 5){
        if(position[1] < 0.5){
            vec3 transformed = vec3(position);
            float freq = 15.0;
            float amp = 1.0;
            float angle = position[1] * freq;

            transform = mat4(sin(angle), 0, 0, 0,
                             0, 1, 0, 0,
                             0, 0, sin(angle), 0,
                             position[0], 0, position[2], 1);
        }
        else
        transform = mat4(1, 0, 0, 0,
                         0, 1, 0, 0,
                         0, 0, 1, 0,
                         0, 0, 0, 1);

    }

    // Détermine la position dans l'espace de chaque point de l'amardillo, pour pouvoir y appliquer le controlleur
    vec4 modelPosition = modelMatrix*transform*vec4(position,1.0);

    //Mesure de la distance entre le controleur et chaque point de l'amardillo dans l'espace monde
    if(distance(modelPosition, vec4(remotePosition,1.0)) < 1.5)
        //Donne une apparence un peu de scan.
        interpolatedNormal = normal*remotePosition;
    else
        interpolatedNormal = normal;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
