class Language {

	type = '';
	default = '';
	replaceTypes = {};

	parseClass = function (string) { return {error: true, message: '???'}; };

	buildClass = function (code) { return ''; };
	buildVariable = function (variable) { return ''; };

	constructor(language) {
		this.type = language.type;
		this.default = language.default;
		this.replaceTypes = language.replaceTypes;

		this.classInitDeclaration = language.classInitDeclaration;
		this.classTerminateDeclaration = language.classTerminateDeclaration;

		this.variableInitDeclaration = language.variableInitDeclaration;
		this.variableTypeDeclaration = language.variableTypeDeclaration;
		this.variableValueDeclaration = language.variableValueDeclaration;
		this.variableTerminateDeclaration = language.variableTerminateDeclaration;

		this.parseClass = language.parseClass;
		this.buildClass = language.buildClass;
		this.buildVariable = language.buildVariable;
	}

}
