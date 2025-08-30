const { Sequelize } = require('sequelize');
const cls = require('cls-hooked');
const path=require("path");
require("dotenv").config({path:path.resolve(__dirname,'../.env')});
// Create namespace for CLS (Context Local Storage) for transactions
const namespace = cls.createNamespace('transaction-namespace');
Sequelize.useCLS(namespace);



var DB = createSequelizeInstance();

  function createSequelizeInstance() {
    console.log(    process.env.DB_PASSWORD,process.env.DB_HOST,process.env.PORTDB)
  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.PORTDB|| 3306,
      dialect: process.env.DIALECT,
      
    }
  );
}

// اختبار الاتصال
async function connectDatabase(retries = 6, delay = 5000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await DB.authenticate();
      console.log('🟢 Database connected');
      return DB;
    } catch (error) {
      console.error(`🔴 Database connection error (Attempt ${attempt}/${retries}):`, error.message);
      // If last attempt, shutdown the server
      if (attempt === retries) {
        console.error('🛑 Maximum retry attempts reached, continues.....');

      }else{
        
      // Wait before retrying
      console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      }

    }
  }
}

async function reinitializeDatabase() {
  try {
    console.log('🔄 Reinitializing database connection...');
    await DB.close();
    console.log('🟢 Old connection closed');
    DB = createSequelizeInstance();
    await DB.authenticate();
    console.log('🟢 Database reinitialized successfully');
  } catch (error) {
    console.error('🔴 Failed to reinitialize database:', error.message);
  }
}


function startDatabaseHealthCheck(intervalMs = 60000*360) {
  setInterval(async () => {
    try {
      await DB.authenticate();
      console.log('🟢 Database connection is healthy');
    } catch (error) {
      console.error('🔴 Database connection lost:', error.message);
      // Here you can decide to restart the app or notify admins
    }
  }, intervalMs);
}


module.exports = { DB, connectDatabase, startDatabaseHealthCheck ,reinitializeDatabase};
