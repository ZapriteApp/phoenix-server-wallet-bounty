require('dotenv').config();
const apiService = require('./apiService');
const fs = require('fs');
const path = require('path');

function saveToEnvFile(key, value) {
  const envVar = `${key}=${value}\n`;
  const envFilePath = path.resolve(__dirname, '.env');

  fs.appendFile(envFilePath, envVar, (err) => {
    if (err) {
      console.error('Error writing to .env file:', err);
    } else {
      console.log(`Successfully added ${key} to .env file.`);
    }
  });
}

function isBolt11(value) {
  if (typeof offer !== 'string') {
    return False;
  }

  fetch('/api/decode-invoice')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      return data
    })
    .catch(error => {
      console.error('Error decoding invoice:', error);
    });
}

function isBolt12(value) {
  if (typeof offer !== 'string') {
    return False;
  }

  fetch('/api/decode-offer')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      return data
    })
    .catch(error => {
      console.error('Error decoding offer:', error);
    });
}



module.exports = { saveToEnvFile, isBolt11, isBolt12 };