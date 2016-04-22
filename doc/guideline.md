> Sont regroupés ici sous le même document tout ce qui va traiter des conventions adoptées pour l'écriture du code *C++* (et autre) de *CLASS*, mais aussi tout ce qui va autour tel que la gestion de *SVN* ou l'utilisation de tests unitaires

# Table des matières

* [Guide de style](#guide-de-style)
	* [Convention de nommage](#convention-de-nommage)
	* [Indentation](#indentation)
	* [Blocs vides](#bloc-vide)
	* [Instanciation des variables](#instanciation-des-variables)
		* [Cas du constructeur](#cas-du-constructeur)
	* [Espace de nommage](#espace-de-nommage)
	* [Commentaires](#commentaires)
	* [Code minimal d'une classe](#code-minimal-dune-classe)
		* [L'opérateur égal](#lopérateur-égal)
	* [Utilisation de la STL](#utilisation-de-la-stl)
	* [Les exceptions](#les-exceptions)
* [SVN](#svn)
* [Tests](#tests)
	* [Installtion de `google_test`](#installation-de-google_test)
		* [Sous GNU/Linux](#sous-gnulinux)
		* [Sous MacOS](#sous-macos)
	* [Utilisation](#utilisation)
		* [Écriture d'un test](#Écriture-dun-test)


# Guide de style

> Un guide de style est l'ensemble des conventions de nommage (de classes, méthodes, variables et fonctions), d'indentation d'un code donc des caractères esthétiques, mais on peut aussi y inclure bonnes pratiques d'instanciation des variables et le choix ou non de l'utilisation de certaines fonctionnalités du langage (non utilisation des `goto` par exemple).

## Convention de nommage

> Je m'appuie ici sur ce qui a déjà était fait (même si je ne les apprécies pas nécessairement).

**Les classes** : sont nommées en *UpperCamelCase*.

**Les méthodes** : sont nommées en *UpperCamelCase* (en conservant du *camelCase* je préfèrerais avoir les méthodes en *lowerCamelCase*, cela permet entre autre de faire la différence entre l'utilisation d'un pointeur de méthode ou de fonction et un foncteur, de plus cela permettrait de savoir quelles sont les méthodes sur lesquelles ont a travaillé (test et/ou optimisation), ça reste un choix purement cosmétique).

**Les variables** : sont en *lowerCamelCase*, les noms d'attributs sont préfixés par la lettre *f* (*f* comme attribut). (je comprends le préfixe ou suffixe des attributs, mais pourquoi par un *f* ? j'ai souvent pris l'habitude à cause de *Python* de préfixer mes attributs par *_*, mais c'est une question de goût). Les attributs seront de préférence privés, protégés si les classes filles ont réellement besoin d'accéder aux attributs, et public dans de rares cas.

**Les fonctions** : j'ai l'impression que vous avez appris à coder en *C++* avec *ROOT* et donc on y trouve les mêmes conventions de nommage ainsi que l'absence de fonctions, bref on dirait que vous faites du *Java*. Quand je code dans un langage j'essaie d'harmoniser mes notations avec celles des fonctions/classes/méthodes de base du langage, donc en *C++* je me cale sur la *STL* donc j'utilise plutôt la *snake_case*.

## Indentation

Comme de nombreux codes en *C++* le choix de l'indentation est l'*Allman style* (j'ai essayé d'autres types d'indentation mais je reviens toujours sur celle-ci).

## Bloc vide

Un bloc de code est tout ce qu'il y a entre deux accolades, je préconise l'écriture d'un point-virgule dans un bloc vide, cela permet parfois de s'assurer qu'il s'agit d'un bloc vide et non d'un *TODO* un peu tardif. De plus cela permet en cas d'oublie d'un point-virgule plus haut de ne pas avoir une erreur qui se reporte bien plus loin. Un exemple de bloc vide :

```cpp

int maFonction ()
{ ; } // <- ceci est un bloc vide

```

Je rappelle que les variables statiques (les variables qui ne sont pas des pointeurs) créées dans un bloc sont détruites à la sortie du bloc et qu'il est possible de créer des blocs de code sans qu'il commence par une instruction particulière. Le code suivant est donc valide

```cpp

int main (int,char**)
{
	{
		int n = 42;
		// ... action sur n
	}
	
	// sortie du bloc, n est détruit
	
	{
		int n = 1337;
		// ... action sur n
	}
	
	// sortie du bloc, n est détruit

	return 0;
}

```

Ceci permet dans certain cas de libérer la mémoire d'une variable statique (dont la libération est le travail du compilateur) relativement lourde (un vecteur temporaire pour la lecture d'un fichier ou une étape de calcul) que l'on aurait déclaré en début et dont on aura pas besoin à la fin. C'est sur ce principe qu'en *C++* on préconise de déclarer ses variables au moment où l'on en a besoin, et de s'arranger pour les libérer dès qu'elles ne sont plus nécessaire.

## Instanciation des variables

La déclaration d'une variable est le moment où l'on déclare sa variable, exemple :

```cpp

	int i , j; // ceci est la déclaration des variables i et j

```

L'instanciation d'une variable est le moment où on lui donne un valeur particulière :

```cpp
	
	int i; // déclaration
	i = 5; // instanciation
```

Le compilateur instancie naturellement les variables que l'on déclare, mais selon le compilateur, sa version et options d'optimisation, les méthodes seront différentes. La variable peut naturellement être instancié à zéro ou, plus rapide, à la valeur présente dans la mémoire à ce moment (j'ai vu quelqu'un qui utilisait ça comme générateur de nombre pseudo-aléatoire, mais il ne pouvait pas compiler avec n'importe quel compilateur et n'importe quelles options sinon il n'obtenait que des zéros, je précise qu'il s'agit d'une mauvaise pratique, fun mais mauvaise).

Il est conseillé d'instancier sa variable au moment de sa déclaration. De même dans le constructeur d'une classe, il est conseillé d'instancier tous les attributs.

### Cas du constructeur

Dans le constructeur d'une classe il est possible d'utiliser la *liste d'instanciation*, cette liste permet d'instancier les attributs à certaines valeurs (dont la prise en compte des arguments). Exemple :

```cpp

class A
{
	private:
		int i;
		int j;
		unsigned int size;
		double * data;

	public:
		A ();
		A ( int , int , int s=10 );
};

A::A () : // <- les deux points indiquent le début de la liste d'instanciation
	i(0) , j(1) , size(5) , data(NULL) // <- liste d'instanciation, l'ordre doit être celui déclaré dans la classe
{ ; }

A::A ( int a , int b , int s ) :
	i(b) , j(a*0.5) , size(s) , data(new double[s]) // il est possible d'utiliser autrement l'ordre des arguments et d'effectuer des instructions
{
	// ici i, j, size et data on déjà des valeurs
}

```

## Espace de nommage

J'ai tendance à ne pas utiliser l'instruction `using std` (ce qui me permet de définir une classe `vector` sans problème), et d'utiliser des espaces de nommages. Cela se révèle pratique pour la déclaration de constantes, l'utilisateur n'est pas gêné par les collisions de noms entre ses déclarations et celles de la librairie qu'il utilise. Cela permet aussi d'éviter de préfixer ses noms de classes par `CLASS`, `IM`, `EQM` ou `XSM` (tout allusion est fortuite), de même préfixer tous ses noms de classes par un `T` c'est débile (tout allusion à un quelconque *framework* développé par un quelconque institut de physique est fortuit).


## Commentaires

Tout code doit être commenté. Chaque classe, fonction ou méthode doit contenir le minimum de commentaire doxygen (j'ai remarqué que vous utilisez Doxygen donc autant continuer) indiquant ce que doit faire la fonction. Cela permet d'éviter des confusions dans les noms, imaginons le cas simple d'une méthode s'appelant `print`, est-ce qu'elle affiche dans le terminal, un fichier, envoie à l'imprimante ou dans une fenêtre le contenu de la classe ?

## Code minimal d'une classe

> Ce code est à proscrire dans des cas très rares où l'on souhaite faire des choses un peu sioux, mais dans ce cas là je suppose que vous savez ce que vous voulez faire.

```cpp

class ClassName
{
	public:
		ClassName (); // constructeur par défaut
		ClassName ( const ClassName & ) // constructeur de copie

		~ ClassName (); // destructeur (doit être virtuel si la classe doit être spécialisée)

		ClassName & operator = ( const ClassName & ); // opérateur d'affectation

	private:
		// liste des attributs privés, je préfère les mettre au début de la classe, vous avez choisi à la fin, ça ne change rien mais je trouve ça étrange
};

```

Ce code respecte la *forme normale de Coplien*. Il s'agit du minimum pour que tout se passe bien et ne pas laisser le compilateur écrire des trucs que l'on ne voudrait pas. Je précise que les comportements bizarres apparaissent lorsque notre classe contient un pointeur, mais il est préférable d'écrire ce code.

### L'opérateur égal

Petit conseil sur `operator = ()`, il est préférable d'effectuer un test avant d'effectuer la copie comme dans le code suivant :

```cpp

ClassName & ClassName::operator = ( const ClassName & a )
{
	if ( this != &a ) // <- ce test permet d'éviter bien des conneries lorsque l'on écrit a=a;
	{

	}
	return *this;
}
```

Le test effectué permet d'éviter une erreur lorsque l'on essaie d'écrire `a = a;`, en effet si l'objet `a` contient un tableau, le code normal voudrait qu'on libère d'avoir le tableau, qu'on le ré-alloue à la bonne taille puis qu'on copie le contenue du tableau (la libération et ré-allocation se fait dans le cas  de tableaux de tailles variables). Le problème est que le tableau contenu dans l'objet `a` a été libéré, on obtient alors une jolie erreur de segmentation.


## Utilisation de la *STL*

Je recommande d'utiliser une bonne partie des conteneurs et des algorithmes de la *STL*, en effet ceux-ci sont optimisés pour ce qu'ils font (il est donc important de sélectionner la bonne structure de données). De mêmes les algorithmes de la STL on l'avantage de s'utiliser facilement sur n'importe quel conteneur s'il possède la bonne interface : c'est à dire des itérateurs.


## Les exceptions

Lorsque quelque chose ne se passe pas nécessairement bien il est conseillé de prévenir la fonction appelante en levant ce qu'on appelle une *exception*, c'est-à-dire que l'on souligne le fait que ça n'a pas bien marché. Cela permet d'effectuer un certain nombre d'action avant l'arrêt du programme (fermeture propre des fichiers, utilisation de la persistance des données avec des fichiers `.root`, libération propre de la mémoire, etc.) ou sa tentative de reprise du programme malgré une mauvaise opération.

C'est une manière plus propre, plus simple et plus efficace d'indiquer une erreur qu'en utilisant (comme en *C*) le code de retour d'une fonction (c'est à dire faire en sorte que chaque fonction renvoie un entier, et sa valeur indique si la fonction s'est bien exécutée ou non).

Il est peut compliqué d'expliquer ceci en quelques lignes ici, mais je pense que cela pourrait être intéressant d'utiliser des exceptions par moment.



# SVN

*Subversion* est un logiciel de versionnement qui permet de garder un historique du développement du code et potentiellement revenir en arrière si nécessaire ou d'effectuer des développement parallèle pour tester l'ajout de nouvelles fonctionnalités et de gérer les conflits de modifications de plusieurs personnes d'un même fichier à des endroits différents.

L'utilisation recommandée est de créer une nouvelle branche pour chaque apport de nouvelle fonctionnalité. Une fois la fonctionnalité finie et opérationnelle, il *suffit* de la merger sur la branche principale.

## Mini-tuto de SVN

> Je n'ai pas encore testé, c'est de la théorie.

**Récupération des sources**

```
svn check-out svn+ssh://jmassot@svn.in2p3.fr/class
```

**Commit d'une modification**

```
svn commit -m "Message indicatif du commit"
```

**Update**

```
svn update
```

**Création d'une branche**

```
svn copy svn+ssh://svn.in2p3.fr/class/trunk svn+ssh://svn.in2p3.fr/class/branches/NAME_OF_BRANCH -m "Creating a branch of project"
```

Puis il faut se déplacer dans la nouvelle branche :
```
svn switch --relocate svn://svn.in2p3.fr/class/trunk svn://svn.in2p3.fr/class/branches/NAME_OF_BRANCH
```
Tout nouveau commit sera effectué dans cette branche.

**Merge des branches**

Une fois la fonctionnalité développée, il faut la *merger* avec la branche principale.

```
svn merge -r 250:HEAD http://svn.in2p3.fr/class/trunk
```

# Tests

La mise en place de tests permet d'améliorer la qualité du code dans le sens où cela évite un grand nombre de petits bugs dès le début du développement. De plus cela permet de s'assurer que les modifications que l'on apporte ne perturbe pas d'autres classes.

> De plus dans mon cas, je sais que je vais devoir toucher à une grande partie du code, donc cela me permet de m'assurer que mes modifications ne changent pas le résultat.

Tant que l'on ne modifie pas l'interface d'une classe (donc le nom et le comportement de ses méthodes) le jeu de tests écrit reste opérationnel.

## Installation de `google_test`

Par simplification il a été décidé d'utiliser le *framework* `google_test` pour effectuer les tests (unitaires ou non) sur *CLASS*. Ainsi il est demandé à tous les contributeurs souhaitant développer une partie du code de *CLASS* d'installer ce *framework* et de tester le code (cela vous incitera à tester vos autres codes).

>  L'installation nécessite le téléchargement des sources, la *release* proposée est le `1.7.0`, qui est la dernière version actuelle. Pour vérifier si une nouvelle version n'est pas sortie (et potentiellement la télécharger), il est possible d'aller sur [GitHub](https://github.com/google/googletest/releases).

### Sous GNU/Linux

**Récupération des sources**

```
wget https://github.com/google/googletest/archive/release-1.7.0.tar.gz
```

**Untare et compilation**

Il est nécessaire d'avoir `cmake` (`sudo apt-get install cmake`) pour compiler le *framework* `google_test`.


```
tar xf release-1.7.0.tar.gz
cd googletest-release-1.7.0
cmake -DBUILD_SHARED_LIBS=ON .
make
```

**Installation des headers au bon endroit**

Cette étape est différente d'une distribution à l'autre, il faut localiser le dossier contenant les headers et les librairies de sa distribution. Les chemins proposés ici sont ceux pour une Debian-like (donc Ubuntu) ; pour une RedHat-like (donc CentOS ou Scientific Linux) le service info de Subatech n'a pas voulu me laisser les droits root sur une machine (et je n'ai pas cherché non plus).

```
sudo cp -a include/gtest /usr/include
sudo cp -a libgtest_main.so libgtest.so /usr/lib/
```

**Mise-à-jour du cache et du linker**

.. et vérification si l'OS reconnait la lib.

```
sudo ldconfig -v | grep gtest
```

La sortie devrait ressembler à ceci :

```
libgtest.so.0 -> libgtest.so.0.0.0
libgtest_main.so.0 -> libgtest_main.so.0.0.0
```

### Sous MacOS

**Récupération des sources**

```
wget http://googletest.googlecode.com/files/gtest-1.7.0.zip
```

**Dézippage et compilation**

```
unzip gtest-1.7.0.zip
cd gtest-1.7.0
./configure
make
```

**Installation des headers**

````
sudo cp -a include/gtest /usr/include
sudo cp -a lib/.libs/* /usr/lib/
```

## Utilisation

Le programme de lancement des tests ressemble à ceci :

```cpp

#include <gtest/gtest.h>
#include "test_iv.inl" // fichier contenant les tests

int main(int argc,char * argv[]) {
	::testing::InitGoogleTest(&argc,argv);
	return RUN_ALL_TESTS();
}
```

Qu'il faut compiler avec les options de *CLASS* plus `-lgtest`
```
g++ -o CLASS_test test.cxx -I $CLASS_include -L $CLASS_lib -lCLASSpkg `root-config --cflags` `root-config --libs` -fopenmp -lgomp -lTMVA -lgtest
```

### Écriture d'un test

Le gros du travail est l'écriture des tests. Je ne ferai pas un cours complet dessus ici et je vous conseille de lire la [documentation](https://github.com/google/googletest/blob/master/googletest/docs/Primer.md).

Un test simple ressemble à ceci :

```cpp


TEST ( TestIV, getSize ) {
	const int n=10; // <- valeur espérée

	// génération du contexte du test
	IsotopicVector iv;
	for ( unsigned int i = 0 ; i < n ; ++i )
	{
		ZAI z(i,i+1,i+2);
		iv.Add(z,i*3.141592653589);
	}

	EXPECT_EQ( iv.GetZAIQuantity() , n ); // <- test
	// il peut y avoir plusieurs tests dans un même test, cela évite de ré-écrire trop de contextes identiques
}

```

> Attention : l'ordre des tests n'est pas fixe et fonctionne par bloc, il ne faut pas considérer le code écrit plus haut comme exécuté.

