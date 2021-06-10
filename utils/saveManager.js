
const fs = require('fs');

var list = {};

function readSaveFile() {
	try {
		let data = fs.readFileSync('./ElswordLists.txt', {encoding:'utf8', flag:'a+'});
		if (!data) {
			data = '{}';
		}
		list = JSON.parse(data);
	} catch (err) {
		console.error(err);
	}
}

function writeSaveFile() {
	try {
		fs.writeFileSync('./ElswordLists.txt', JSON.stringify(list, null, 4), {flag: 'w'});
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

function setUserList(user, data, saveFile = true) {
	//TODO: implement that
}

exports.getList = getList;
exports.setList = setList;
exports.setUserList = setUserList;