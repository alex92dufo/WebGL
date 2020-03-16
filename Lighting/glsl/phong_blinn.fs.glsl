/**
 * UdeM IFT 3355, H20
 * TP 3 Template
 * Mise à jour par: Alexandre Dufour (p1054564)
 */
varying vec4 V_ViewPosition;
varying vec4 V_Normal_VCS;

varying vec3 interpolatedNormal;

uniform float kDiffuse;
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform float kAmbient;
uniform float kSpecular;
uniform float shininess;


void main() {

	//Ambient
	vec3 ambiantLight= ambientColor*kAmbient;

	//diffuse
	float cosine = dot(normalize(vec4(interpolatedNormal, 1.0)), normalize(vec4(lightDirection, 1.0)));
	vec3 Idiffuse = kDiffuse*lightColor*cosine;

	//Specular
	vec4 h = vec4(normalize(vec4(lightDirection,1.0))+normalize(V_ViewPosition))/2.0;
	vec3 ISpec = kSpecular*lightColor*pow(max(dot(normalize(h), normalize(vec4(interpolatedNormal,1.0))),0.0), shininess);

	vec3 light = ambiantLight + Idiffuse + ISpec;

	gl_FragColor = vec4(1.0,0.0,0.0, 1.0)*vec4(light, 1.0);
}