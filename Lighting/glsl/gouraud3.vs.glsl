/**
 * UdeM IFT 3355, H20
 * TP 3 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */
//Fog inspiré de http://in2gpu.com/2014/07/22/create-fog-shader/
uniform float kDiffuse;
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform float kAmbient;
uniform float kSpecular;
uniform float shininess;


varying vec4 V_Color;
vec3 fogColor = vec3(0.8,0.8,0.8);
float fogFactor = 0.0;
float fogDensity = 0.05;


void main() {
	// COMPUTE COLOR ACCORDING TO GOURAUD HERE
	float eyeDist = length(modelViewMatrix*normalize(vec4(position, 1.0)));
	float fogFactor = 1.0/exp((eyeDist*fogDensity)*(eyeDist*fogDensity));
	fogFactor = clamp(fogFactor, 0.0, 1.0);

	//Ambient
	vec3 ambiantLight= ambientColor*kAmbient;


	//Diffuse
	float cosine = max(dot(normalize(lightDirection), normalize(normal)), 0.0);
	vec3 Idiffuse = kDiffuse*lightColor*(cosine);

	//Specular
	vec3 ISpec = kSpecular*lightColor*pow(max(dot(normalize(modelViewMatrix*normalize(vec4(position, 1.0))), normalize(reflect(normalize(vec4(-lightDirection, -1.0)), normalize(vec4(normal, 1.0))))), 0.0), shininess);


	//Lumière complète!!
	vec3 light = ambiantLight + (Idiffuse +  ISpec);
	light = mix(fogColor, light, fogFactor);

	V_Color = vec4(1.0, 1.0, 1.0, 1.0)*vec4(light, 1.0);

	// Position
	gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
}