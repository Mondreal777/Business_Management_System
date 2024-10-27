
const QRCode = require('qrcode');


const generateUrlQrCode = async (str) => {
    let code = null;
	await QRCode.toDataURL(str).then(res => {
		code = res;
	}).catch(err => {
		console.log('There is an error in generating qr code: ', err );
	})
	return code;
}

module.exports = { generateUrlQrCode }