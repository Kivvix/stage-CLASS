# Méthode numérique

Un des gros morceaux à optimiser dans *CLASS* est la résolution du *burnup*. Il s'agit de résoudre l'équation différentielle suivante :

![\vec{n}'(t) = A \cdot \vec{n}(t)](http://www.sciweavers.org/tex2img.php?eq=%5Cvec%7Bn%7D%27%28t%29%20%3D%20A%20%5Ccdot%20%5Cvec%7Bn%7D%28t%29&bc=Transparent&fc=Black&fs=18&ff=mathdesign&edit=0&img=png)

On sait que la solution exacte d'un tel système est la suivante :

![\vec{n}(t) = \text{e}^{At}](http://www.sciweavers.org/tex2img.php?eq=\vec{n}%28t%29%20%3D%20\text{e}^{At}&bc=Transparent&fc=Black&fs=18&ff=mathdesign&edit=0&img=png)

Le problème est le calcul de l'exponentielle matricielle qui formellement s'écrit :

![\text{e}^A = \sum_{k \in \mathbb{N}} \frac{A^k}{k!}](http://www.sciweavers.org/tex2img.php?eq=\text{e}^A%20%3D%20\sum_{k%20\in%20\mathbb{N}}%20\frac{A^k}{k!}&bc=Transparent&fc=Black&fs=18&ff=mathdesign&edit=0&img=png)

## Méthode de troncature de la série de Taylor

Il est possible d'utiliser la formule explicite de l'exponentielle et d'ajouter des termes supplémentaires tant que le nouvel élément n'est pas négligeable. Cette méthode permet d'adapter le temps de calcul simplement, mais s'avère très mauvaise en terme de précision (ou très mauvaise en temps de calcul si l'on souhaite une bonne précision).

C'est la méthode actuellement implémentée dans *CLASS*. J'aimerais savoir jusqu'à quel ordre est calculé l'exponentielle, si quelqu'un à une idée...


## La méthode de CRAM

La *Chebyshev rational approximation method* (CRAM) est une méthode qui consiste à approcher l'exponentielle par une fonction rationnelle (fonction quotient de deux polynômes) sur l'ensemble des réels négatifs (j'ai pas compris pourquoi seulement les négatifs, je vais devoir lire un peu plus attentivement cette méthode). La fonction sélectionnée est la meilleure fonction rationnelle à l'ordre choisie dont le calcul des coefficients a été effectué jusqu'à l'ordre 30. Une méthode semblable utilise les fonctions rationnelles de Padé (que je ne connais pas), mais ne s'agit pas de la meilleure approximation, la méthode CRAM est initialement couteuse car requière le calcul de la meilleure fonction rationnelle.

Maria Pusa utilise dans [sa publication](http://montecarlo.vtt.fi/download/S32.pdf) la fonction à l'ordre 16, il s'agit donc de calculer deux polynômes matriciels d'ordre 16. Il n'est pas envisageable de calculer comme ça les puissances successives d'une matrice (même problème que le calcul de l'exponentielle de la matrice). En réalité il est possible de calculer la valeur de la fonction en résolvant *seulement* k/2 systèmes linéaires (k étant l'ordre du polynôme choisie).

La résolution d'un système linéaire avec la méthode du pivot de Gauss a une complexité cubique, l'algorithme de Stassen fait descendre cette complexité légèrement en dessous. De plus les k/2 systèmes à résoudre sont indépendants il est donc possible de paralléliser ces calculs via MPI.

L'erreur relative de cet algorithme commence à diverger à partir de 32 000 ans de simulation (l'erreur dépasse alors 10^(-5) !). Quelques erreurs plus importantes sont observées sur des éléments à demi-vie courte (Béryllium 12 et le Bore 10 dont la demi-vie est de l'ordre de la milliseconde), mais sont d'après Mario Pusa négligeable car ayant peu d'impact sur la suite de la simulation (personnellement je m'y connais plus en astronomie qu'en neutronique, donc mon tableau de Mendeleïev ne contient que l'hydrogène et l'hélium ^^).

> Cette méthode est intéressante pour des simulations nécessitant une résolution précise du *burnup*, BaM m'a indiqué hier soir que la simulation dans *CLASS* ne nécessitait pas une telle précision. Je pense qu'il est possible d'avoir un module *CRAM* dans *CLASS*, mais il serait plutôt avantageux d'avoir une méthode de résolution rapide.

