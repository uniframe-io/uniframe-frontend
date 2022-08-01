export default function defineFileType(str) {
	if (str === 'xlsx' || str === '.xls') return 'Excel';
	if (str === '.csv') return 'CSV';
}
