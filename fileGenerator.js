/* eslint-disable */
// in the root directory run "node fileGenerate.js" to implement this file
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const filePath = '../Dataset Sample/test.csv';
const filepath = path.resolve(__dirname, filePath);

let str = '';
const recordsNumber = 1000000;
console.log('start generating data with faker please wait...');
for (let i = 0; i < recordsNumber; i++) {
	if (i === 0) str += 'CompanyName,Year,Founder,email' + '\n';
	const d = new Date(faker.date.past(20));
	str +=
		faker.company.companyName().split(',').slice(0, 1) +
		',' +
		d.getFullYear().toString() +
		',' +
		faker.name.firstName() +
		' ' +
		faker.name.lastName() +
		',' +
		faker.internet.email() +
		'\n';
}

console.log('File write started...');
fs.writeFile(filepath, str, function (err) {
	if (err) {
		return console.log(err);
	} else {
		console.log('file created successfully');
	}
});
