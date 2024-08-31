import dotenv from 'dotenv';
dotenv.config();
import * as apiService from '../api/apiService.js';
import fs from 'fs'
import db from './db.js'
import lodash from 'lodash'
import path  from 'path';
import { v4 as uuidv4 } from 'uuid'

export function saveToEnvFile(key, value) {
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

export function isBolt11(value) {
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

export function isBolt12(value) {
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

export function getId() {
  return uuidv4();
}