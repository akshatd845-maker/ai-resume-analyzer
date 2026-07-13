const cors = require('cors');
const securityConfig = require('./security.config');

module.exports = cors(securityConfig.cors);