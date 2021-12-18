const Java = new Language({
	type: 'text/x-java',
	default: 'public class ExampleEntity {\n\n    @Id\n    @GeneratedValue(strategy = GenerationType.AUTO)\n    private Long id;\n\n    private String name = "Hello World";\n\n    @ManyToOne\n    private User user;\n\n    private Date date;\n\n}',
	replaceTypes: {
		'string': 'String',
		'boolean': 'Boolean',
		'number': 'long',
		'object': 'Object'
	},

	classInitDeclaration: 'public class $NAME {\n\n',
	classTerminateDeclaration: '\n}',

	variableInitDeclaration: '\t$TYPE $NAME',
	variableValueDeclaration: ' = $VALUE',
	variableTerminateDeclaration: ';\n',

	parseClass: function (string) {
		const result = {name: undefined, variables: []};
		const split = string.split("\n");

		/* Find name */
		result.name = split.filter((string) => string.match(/(class|interface) [A-z_0-9]*/))[0]
							.replace(/.*(class|interface) /, '')
							.replace(/( )?(extends|implement)?( )?{/, '');
		if (!result.name || result.name.length === 0) return {error: true, message: 'Invalid class name.'};

		/* Find variables */
		split.filter(
				(string) => string.match(/(private|public) [A-z_0-9]* [A-z_0-9]*( )?(=)?.*;/)
		).forEach(
				(string) => {
					const variable = {name: '', type: '', value: undefined};
					const split = string.replace(/.*(private|public) /, '')
										.replace(/( )?=.*;/, '')
										.replace(/( )?;/, '')
										.split(' ');

					variable.type = split[0];
					variable.name = split[1];

					if (!variable.name || variable.name.length === 0
							|| !variable.type || variable.type.length === 0) return {error: true, message: 'Invalid variable name or type.'};

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

		if (type === 'Object') {
			type = variable.name.charAt(0).toUpperCase() + variable.name.slice(1).toLowerCase();
			variable.value = undefined;
		}

		if (type === 'String' && variable.value && !variable.value.includes('"')) {
			variable.value = `"${variable.value?.replace("'", "").replace("'", "")}"`;
		}

		result += this.variableInitDeclaration
						.replace('$TYPE', type)
						.replace('$NAME', variable.name);

		if (variable.value !== undefined) result += this.variableValueDeclaration.replace("$VALUE", variable.value);

		result += this.variableTerminateDeclaration;

		return result;
	}
});
