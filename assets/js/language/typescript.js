const TypeScript = new Language({
	type: 'javascript',
	default: 'export class ExampleEntity {\n\n\tid: number;\n\tname = "Hello World";\n\tuser: User;\n\tdate: Date;\n\n}',
	replaceTypes: {
		'string': 'string',
		'boolean': 'boolean',
		'int': 'number',
		'long': 'number',
		'double': 'number'
	},

	classInitDeclaration: 'export class $NAME {\n\n',
	classTerminateDeclaration: '\n}',

	variableInitDeclaration: '\t$NAME',
	variableTypeDeclaration: ': $TYPE',
	variableValueDeclaration: ' = $VALUE',
	variableTerminateDeclaration: ';\n',

	parseClass: function (string) {
		const result = {name: undefined, variables: []};
		const split = string.split("\n");

		/* Find name */
		result.name = split.filter((string) => string.match(/(export )?(class|interface) [A-z_0-9]*/))[0]
														.replace(/.*(class|interface) /, '')
														.replace(/( )?(extends|implement)?( )?{/, '');
		if (!result.name || result.name.length === 0) return {error: true, message: 'Invalid class name.'};

		/* Find variables */
		split.filter(
				(string) => string.match(/(private|public)?( )?[A-z_0-9]*(: [A-z_0-9]*)?( )?(=)?.*;/)
		).forEach(
				(string) => {
					const variable = {name: '', type: '', value: undefined};
					const split = string.replace(/.*(private|public) /, '')
										.replace('\t', '')
										.replace(/( )?=.*;/, '')
										.replace(/( )?;/, '')
										.split(':');

					variable.name = split[0];
					variable.type = split.length > 1? split[1].replace(' ', '') : 'string';

					if (!variable.name || variable.name.length === 0
							|| !variable.type === undefined || variable.type.length === 0) return {error: true, message: 'Invalid variable name or type.'};

					if (whitelist.indexOf(variable.type.toLowerCase()) >= 0 && string.includes("=")) {
						variable.value = string.replace('= ', '=')
												.split('=')[1]
												.replace(';', '');
					}

					result.variables.push(variable);
				}
		);

		return result;
	},

	buildClass: function (code) {
		let result = '';

		result += this.classInitDeclaration.replace('$NAME', code.name);
		code.variables.forEach(
				(value) => result += this.buildVariable(value)
		);
		result += this.classTerminateDeclaration;

		return result;
	},

	buildVariable: function (variable) {
		let result = '';

		let type = this.replaceTypes[variable.type.toLowerCase()];
		if (!type) type = variable.type;

		if (type === 'object') {
			type = variable.name.charAt(0).toUpperCase() + variable.name.slice(1).toLowerCase();
			variable.value = undefined;
		}

		if (type === 'string' && variable.value && !variable.value.includes("'")) {
			variable.value = `'${variable.value?.replace('"', "").replace('"', "")}'`;
		}


		result += this.variableInitDeclaration.replace('$NAME', variable.name);

		if (type !== 'string') result += this.variableTypeDeclaration.replace("$TYPE", type);
		if (variable.value !== undefined) result += this.variableValueDeclaration.replace("$VALUE", variable.value);

		result += this.variableTerminateDeclaration;

		return result;
	}
});
