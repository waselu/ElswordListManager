
const fs = require('fs');

var list = {};

function readSaveFile() {
	try {
		let data = fs.readFileSync('./cookieSave.txt', {encoding:'utf8', flag:'a+'});
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
		fs.writeFileSync('./cookieSave.txt', JSON.stringify(list, null, 4), {flag: 'w'});
	} catch (err) {
		console.error(err);
	}
}

function getCookieSave(readFile = false) {
	if (readFile) {
		readSaveFile();
	}
	return list;
}

function getUserCookieSave(userID, readFile = false) {
    let l = getCookieSave(readFile);
    return l[userID];
}

function setCookieSave(data, saveFile = true) {
	list = data;
	if (saveFile) {
		writeSaveFile();
	}
}

function setUserCookieSave(userID, userData, saveFile = true) {
    let l = getCookieSave();
    l[userID] = userData;
    setCookieSave(l, saveFile);
}

exports.getCookieSave = getCookieSave;
exports.getUserCookieSave = getUserCookieSave;
exports.setCookieSave = setCookieSave;
exports.setUserCookieSave = setUserCookieSave;