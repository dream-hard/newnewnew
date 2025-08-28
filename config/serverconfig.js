// server.js
const path=require('path');
require('dotenv').config({path:path.resolve(__dirname,'../.env')});
const express = require('express');
const fs = require('fs');
const { connectDatabase, DB } = require('./config');

let server;
let isRestarting = false;
const ENV_FILE = path.resolve(__dirname, '.env');
exports.ENV_FILE = ENV_FILE;

// Helper function to load .env without restart
function reloadEnv() {
  delete require.cache[require.resolve('dotenv')];
  require('dotenv').config();
  console.log('✅ Environment variables reloaded');
}

// Function to start the server
async function startServer() {
  try {
    await connectDatabase();
    console.log('🟢 Database connected successfully');

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.get('/', (req, res) => res.send('🟢 Server is running'));

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });

  } catch (error) {
    console.error('🔴 Failed to start server:', error.message);
    process.exit(1);
  }
}

// Function to restart the server
async function restartServer() {
  if (isRestarting) return;
  isRestarting = true;

  console.log('🔄 Restarting server...');

  if (server) {
    server.close(async () => {
      console.log('🛑 Server stopped');
      await DB.close();
      console.log('🛑 Database connection closed');
      
      reloadEnv();
      
      isRestarting = false;
      startServer();  // Restart the server
    });
  } else {
    startServer();
    isRestarting = false;
  }
}

// Function to stop the server
async function stopServer() {
  console.log('🛑 Stopping server...');
  
  if (server) {
    server.close(async () => {
      console.log('🛑 Server stopped');
      await DB.close();
      console.log('🛑 Database connection closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}



// Expose functions for external control
module.exports = { restartServer, stopServer };
