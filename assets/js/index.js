const left = { language: Java };
const right = { language: Json };
const whitelist = ['string', 'int', 'double', 'boolean', 'long', 'number'];
const defaultCM = {
	indentUnit: 4,
	lineNumbers: true,
	theme: 'darcula',
	hint: true,
	indentWithTabs: true
};
const languages = {
	'Java': Java,
	'TypeScript': TypeScript,
	'Json': Json
};

function createEditors(showDefault = false) {
	left.codeMirror?.toTextArea();
	right.codeMirror?.toTextArea();

	defaultCM.mode = left.language.type;
	left.codeMirror = CodeMirror.fromTextArea(document.getElementById('leftEditor'), defaultCM);
	left.codeMirror.save();

	defaultCM.mode = right.language.type;
	right.codeMirror = CodeMirror.fromTextArea(document.getElementById('rightEditor'), defaultCM);
	right.codeMirror.save();

	if (showDefault) left.codeMirror.setValue(left.language.default);
	left.codeMirror.on('change', () => { translate() });
}

function translate() {
	document.getElementById('error').innerText = '';

	let code = left.language.parseClass(left.codeMirror.getValue());
	console.log('Parse result: ', code)
	if (code.error) {
		document.getElementById('error').innerText = code.message;
		return;
	}
	right.codeMirror.setValue(right.language.buildClass(code));
}

function updateEditors(element, side) {
	side.language = languages[element.value];
	createEditors();
	translate();
}

function generateSelectors() {
	const leftSelector = document.getElementById('leftSelector');
	const rightSelector = document.getElementById('rightSelector');

	Object.keys(languages).forEach(
			(key) => {
				leftSelector.options.add(new Option(key, key));
				rightSelector.options.add(new Option(key, key));

				if (left.language === languages[key]) leftSelector.value = key;
				if (right.language === languages[key]) rightSelector.value = key;
			}
	);
}

generateSelectors();
createEditors(true);
translate();
