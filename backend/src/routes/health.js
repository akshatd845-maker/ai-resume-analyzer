const express = require('express');
const ApiResponse = require('../utils/ApiResponse');

const router = express.Router();

router.get('/', (req, res) => {
  const response = ApiResponse.success('Server is running', {
    timestamp: new Date().toISOString(),
  });
  return response.send(res);
});

module.exports = router;