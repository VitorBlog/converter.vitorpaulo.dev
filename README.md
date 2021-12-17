# [converter.vitorpaulo.dev](https://converter.vitorpaulo.dev)
Convert your class to other languages.

- [ ] FIXME: The code looks like sh*t;
- [ ] TODO: Make a better 'type' interpretation system;
- [ ] TODO: Make global 'types';
- [ ] TODO: Recreate variable value reading and build system;
- [ ] TODO: Add Kotlin, PHP, Swift and more;
- [ ] TODO: Transforme CodeObject and VariableObject into a class;
- [ ] FIXME: Java and TypeScript class declaration can be removed without any error.

# Creating a new language
It's very simple to create any language parser and builder.
First you will have to create an JS file on `assets/js/` named
`YourLanguage.js` with something like that inside:

```js
const YourLanguage = new Language({
	type: '',
	default: '',

	parseClass: function (string) {},
	buildClass: function (code) {},
	buildVariable: function (variable) {}
});
```

## Defining the type
Define the type based on [MIME](https://en.wikipedia.org/wiki/MIME) types or [CodeMirror](https://codemirror.net/) modes like:
```js
    type: 'text/javascript'
```
or
```js
    type: 'javascript'
```

## Parsing
Parsing the class doesn't have much rules, it's more about you and your knowledge.
There's only one rule that is to return the CodeObject with VariableObject:
```json
{
	"name":"ExampleEntity",
	"variables":[
		{
			"name":"id",
			"type":"Long"
		},
		{
			"name":"name",
			"type":"String",
			"value":"\"Hello World\""
		},
		{
			"name":"user",
			"type":"User"
		},
		{
			"name":"date",
			"type":"Date"
		}
	]
}
```

## Building
Again, building doesn't have rules you just need to know that you will work
with the CodeObject and VariableObject above, just return a String with the class
and everything will be OK.
