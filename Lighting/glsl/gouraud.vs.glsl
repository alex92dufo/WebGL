/**
 * UdeM IFT 3355, H20
 * TP 3 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */
uniform float kDiffuse;
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform float kAmbient;
uniform float kSpecular;
uniform float shininess;


varying vec4 V_Color;


void main() {
	// COMPUTE COLOR ACCORDING TO GOURAUD HERE

	//Ambient
	vec3 ambiantLight= ambientColor*kAmbient;


	//Diffuse
	float cosine = max(dot(normalize(lightDirection), normalize(normal)), 0.0);
	vec3 Idiffuse = kDiffuse*lightColor*(cosine);

	//Specular
	vec3 ISpec = kSpecular*lightColor*pow(max(dot(normalize(modelViewMatrix*normalize(vec4(position, 1.0))), normalize(reflect(normalize(vec4(-lightDirection, -1.0)), normalize(vec4(normal, 1.0))))), 0.0), shininess);


	//Lumière complète!!
	vec3 light = ambiantLight + (Idiffuse +  ISpec);

	V_Color = vec4(1.0, 0.0, 0.0, 1.0)*vec4(light, 1.0);

	// Position
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}