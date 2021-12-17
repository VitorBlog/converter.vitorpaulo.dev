const Json = new Language({
	type: 'application/json',
	default: '{\n\t"id": 0,\n\t"name": "Hello World",\n\t"user": {},\n\t"date": "Fri Sep 02 2016 00:00:00"\n}',
	replaceTypes: {
		'string': 'string',
		'boolean': 'boolean',
		'int': 'number',
		'long': 'number',
		'double': 'number',
		'date': 'date'
	},

	classInitDeclaration: '{\n',
	classTerminateDeclaration: '\n}',

	variableInitDeclaration: '\t"$NAME"',
	variableValueDeclaration: ': $VALUE',
	variableTerminateDeclaration: ',\n',

	parseClass: function (string) {
		const result = {name: 'JsonObject', variables: []};
		const json = JSON.parse(string);

		Object.keys(json).forEach(
				(key) => {
					result.variables.push(
							{
								name: key,
								type: typeof json[key],
								value: json[key] === 'Fri Sep 02 2016 00:00:00'? undefined : json[key]
							}
					);
				}
		);

		return result;
	},

	buildClass: function (code) {
		let result = '';

		if (code.variables.length === 0) return this.classInitDeclaration + this.classTerminateDeclaration;

		result += this.classInitDeclaration;
		code.variables.forEach(
				(value) => result += this.buildVariable(value)
		);
		result = result.slice(0, result.length - 2) + this.classTerminateDeclaration;

		return result;
	},

	buildVariable: function (variable) {
		let result = '';

		let value;
		let type = this.replaceTypes[variable.type.toLowerCase()];
		if (type === undefined) type = variable.type;

		switch (type) {
			case 'string':
				value = variable.value? `"${variable.value.replace('"', '').replace('"', '').replace("'", '').replace("'", '')}"` : '""';
				break;
			case 'number':
				value = variable.value? variable.value : 0;
				break;
			case 'boolean':
				value = variable.value? variable.value : false;
				break;
			case 'date':
				value = '"Fri Sep 02 2016 00:00:00"';
				break;
		}

		if (value === undefined) value = '{}';

		result += this.variableInitDeclaration.replace('$NAME', variable.name);
		result += this.variableValueDeclaration.replace("$VALUE", value);
		result += this.variableTerminateDeclaration;

		return result;
	}
});
