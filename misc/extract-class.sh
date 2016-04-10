#! /bin/bash
# ce script n'est pas la propriété du CNRS
#
# Permet de visualiser l'héritage d'un ensemble de classes C++
# Le fichier généré est un fichier .dot de GraphViz

function class ()
{
	while read a; do
		class_name=$(echo $a | sed 's/;//' | awk -F: '{ print $1}')
		class_name=$(echo $class_name | awk '{ gsub (" ", "", $0); print }')
		echo "$class_name [label=\"<f0> $class_name\"];"
		echo $a | awk -F: '{print $2}' | sed -e 's/\<public\|private\|protected\>//g' | sed 's/<.*>//' | awk -v tmp="$class_name" -F, '{
			for (i=1;i<=NF;i++)
			{ print tmp":f0 -> "$i":f0 [arrowhead=onormal];" }
		}'
	done
}

echo "
digraph structs {
	node [shape=record];
	rankdir=LR;
	overlap=false;
	ranksep=1.3;
"

cat $* | grep -e '^class *' | sed 's/class //' | cut -d"{" -f1 | class

echo "}"
