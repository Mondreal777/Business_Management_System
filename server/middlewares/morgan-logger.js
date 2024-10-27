// Libraries
const morgan = require('morgan');

const format = ":remote-addr - :method :url :status :response-time ms - :res[content-length]";

module.exports.morganLogger = morgan(format);
