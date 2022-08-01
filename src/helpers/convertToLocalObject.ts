import defineFileType from './defineFileType';
import moment from 'moment';
const getTimeZoneOffset = (time) => moment(`${time}`).utcOffset();
export const convertedTime = (time) =>
	moment.utc(time).utcOffset(getTimeZoneOffset(time)).format('YYYY-MM-DD HH:mm');
export default function convertToLocalObject(arr) {
	arr.map((val) => {
		// I am defining file type and put in the object
		const ext = val.media ? val.media.ext_info.file_name.slice(-4) : '';
		val.fileType = defineFileType(ext);
		val.na = 'NA';
		val.permission = 'owner';
		//I am changing time format  here
		val.createdAt = convertedTime(val.created_at);
	});

	return arr;
}
