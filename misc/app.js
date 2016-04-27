(function(angular) {
  'use strict';
angular.module('controllerExample', [])
  .controller('SettingsController2', ['$scope', SettingsController2]);

function SettingsController2($scope) {
	$scope.name = "A";
	$scope.attributs = [
		{type:'int', name:'size'},
		{type:'double *', name:'tab'},
	];

	$scope.greet = function() {
		alert($scope.name);
	};

	$scope.addAttribut = function() {
		$scope.attributs.push({type:'', name:''});
	};

	$scope.removeAttribut = function(attrToRemove) {
		var index = $scope.attributs.indexOf(attrToRemove);
		$scope.attributs.splice(index, 1);
	};

	$scope.clearAttribut = function(attr) {
		attr.type = '';
		attr.value = '';
	};

	$scope.displayStars = function(attr) {
		var deg = (attr.type.match(/\*/g)||[]).length;
		var stars = " ";
		var i=0;
		for ( i = 0 ; i < deg ; i++ ) {
			stars += "*";
		}
		return stars;
	};

	$scope.displayZeroH = function(attr) {
		var deg = (attr.type.match(/\*/g)||[]).length;
		if ( deg > 0 ) {
			var r = "void zero_" + attr.name + " ();";
			return r;
		}
	};

	$scope.displayZeroC = function(attr,class_name) {
		var deg = (attr.type.match(/\*/g)||[]).length;
		if ( deg == 1 ) {
			return "void " + class_name + "::zero_" + attr.name + " ()\n{\n\
	delete[] " + attr.name + ";\n}";
		}
		if ( deg > 1  ) {
		return "void " + class_name + "::zero_" + attr.name + " ()\n{\n\
	// TODO: specify how to delete " + attr.name + "\n\
	/* for ( unsigned int i = 0 ; i < n ; ++i )\n\
		delete[] " + attr.name + "[i];\n\
	}\n\
	delete[] " + attr.name + ";*/\n\
}";
		}
	};

	$scope.displayDelete = function(attr) {
		var deg = (attr.type.match(/\*/g)||[]).length;
		if ( deg > 0 ) {
			return "\tzero_" + attr.name + "();";
		}
	};

	$scope.displayEq = function(attr) {
		var deg = (attr.type.match(/\*/g)||[]).length;
		if ( deg == 0 ) {
			return attr.name + " = a." + attr.name;
		} else {
			var r = "zero_" + attr.name + "();";
			if ( deg == 1 ) {
				r += "\n\t\t" + attr.name + " = new " + attr.type + " /*[ n ]*/;";
				r += "\n\t\t/*std::copy( a." + attr.name + " , a." + attr.name + "+n , " + attr.name + " );*/";
			}
			return r;
		}
	};
}
})(window.angular);
