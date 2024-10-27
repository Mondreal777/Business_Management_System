const logger = require('../../util/loggers/logger');


const convertB64toString = async b64String => {
	try {
		const newBuff = new Buffer(b64String, 'base64');
		const convertedBuff = newBuff.toString();

		return convertedBuff;
	} catch (err) {
		logger.error(`[Convert Base 64 to String] helpers.converter.convertB64toString: Error in converting base 64 into string. \n ${err.stack}`);
		throw err;
	}
}

const convertBlobToBase64 = async (file) => { // blob data
	try {
		const blobData = file;
		let base64data = null;
		if (!file) {			
			return base64data
		} else {
			base64data = blobData.toString('base64');
			return base64data
		}
		
	} catch (err) {
		logger.error(`[Convert Blob to Base64] helpers.converter.convertBlobToBase64: Error in converting blob to base 64. \n ${err.stack}`);
		throw err;
	}
}

module.exports = {
	convertB64toString,
	convertBlobToBase64
};