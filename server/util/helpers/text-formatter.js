

const convertSpecialCharactersToEscapedString = async stringText => {
	return stringText.replace('&', '&amp;');
}


module.exports = {
	convertSpecialCharactersToEscapedString
}