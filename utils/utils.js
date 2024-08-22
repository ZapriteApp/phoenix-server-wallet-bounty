require('dotenv').config();

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

module.exports = { saveToEnvFile };