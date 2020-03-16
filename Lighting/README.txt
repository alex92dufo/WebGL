Nom: Alexandre Dufour
Matricule: p1054564
Projet: TP3 - Sphère/lumière

Détails:

Texture:
Pour cette partie du travail, je me suis inspiré de 
https://en.wikibooks.org/wiki/GLSL_Programming/GLUT/Textured_Spheres pour obtenir la
formule de mapping entre une position sur une sphère et sa position sur une image
2D. En envoyant du vertex shader au fragment shader la position d'un pixel sur la sphère,
on peut retrouver le pixel auquel il se mappe sur l'image 2D.

Partie créative:
Dans cette partie du travail, deux éléments de création ont été fait. Ces deux éléments
n'ont été ajouté qu'à la sphère gouraud.

1. L'ajout d'une seconde lumière amovible.
	Pour ajouter la seconde lumière, il faut appuyer sur la touche '2' du clavier.
	On voit alors une lumière verte à l'avant, et une lumière bleue à l'arrière de la
	sphère. La lumière bleue peut être bougé en utilisant les touches 'A', 'W', 'S' et 'D'.
	La lumière bouge de façon un peu étrange, mais nous voyons le halo de lumière bouger
	sur la spère, ce qui change entre autre la couleur si on superpose les lumières, ainsi
	que les zones sombre. Pour appliquer cette deuxième lumière, un nouveau gouraudMaterial
	a été créé (gouraudMaterial2), dans lequel on retrouve les variables uniformes 
	lightDirection2 et lightColor2. On y modifie également la couleur de la première lumière.
	On crée également un nouveau vertex et fragment shader (gouraud2) sur lequel on applique
	le nouveau matériel. Dans le vertex shader, on applique les effets de la seconde
	lumière. Les mouvements de la lumière se font directement dans A3.js, où les
	valeur du vecteur lightDirection change de 0.1 à chaque frame. De plus, pour bien voir
	les différente couleur, dans le vertex shader, la couleur de base de la sphère
	a été modifié pour être blanche.

2. L'ajout d'un effet de brume (fog) sur la sphère gouraud.
	En appuyant sur le touche '3', on applique à la sphère gouraud un effet de brume. Plus
	précisemment, à grande distance de la sphère, on voit celle-ci comme étant blanchâtre.
	En se reprochant de la sphère, sa couleur mauve devient de plus en plus clair.
	Pour se faire, j'ai crée un nouveau gouraudMaterial (gouraudMaterial3), dans
	lequel on retrouve les même variables uniformes que la sphère de base, sauf la 
	couleur de la lumière qui est devenu mauve. On crée également de nouveaux vertex et
	fragment shaders (gouraud3), dans lequel on applique les formules pour crée une brume.
	À savoir que le travail pour faire cette brume a été inspiré de 
	http://in2gpu.com/2014/07/22/create-fog-shader/, puisque ce n'est pas une notion que nous
	avons vu en classe. Encore une fois, la couleur d'origine de la sphère a été modifé
	pour blanche pour bien voir le changement de couleur.

À s'avoir qu'en appuyant sur le touche '1', la sphère gouraud reviendra a son état avec son
matériaux d'origine.
