
const fs = require('fs')

var list = {};

function readSaveFile() {
	try {
		const data = fs.readFileSync('./ElswordTest.txt', 'utf8');
		list = JSON.parse(data);
	} catch (err) {
		console.error(err);
	}
}

function writeSaveFile() {
	try {
		fs.writeFileSync('./ElswordTest.txt', JSON.stringify(list));
	} catch (err) {
		console.error(err);
	}
}

function getList(readFile = false) {
	if (readFile) {
		readSaveFile();
	}
	return list;
}

function setList(data, saveFile = true) {
	list = data;
	if (saveFile) {
		writeSaveFile();
	}
}

exports.getList = getList;
exports.setList = setList;