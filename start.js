

const express = require('express')
const app = express();
const cors = require("cors");
const cookieParser=require("cookie-parser")
const express_session = require("express-session");
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
const {DB,connectDatabase, startDatabaseHealthCheck} = require("./config/config");
const fs = require("fs");
const { ENV_FILE, restartServer } = require("./config/serverconfig");
const models = require("./models");
const port =process.env.PORT;

// routers .js
const Exchange_routes=require("./routes/ExchangeRoutes");
const Currency_routes=require("./routes/CurrencyRoutes");
const User_Role_Status_routes=require('./routes/UserRoleStatusRoutes');
const User_routes=require('./routes/UserRoutes')
const Category_routes=require('./routes/CategoryRoutes')
const shipping_method_routes=require("./routes/Shippingmethodroutes");
const Attribute_option_routes=require('./routes/AttributeOptionRoutes');
const Attribute_type_routes=require("./routes/AttributeTypeRoutes");
const Category_attribute_routes=require('./routes/CategoryAttriubteRoutes');
const Product_attribute_routes=require('./routes/ProductAttriubteRoutes');
const Product_routes=require("./routes/ProductRoutes");
const Product_status_routes=require("./routes/ProductStatusRoutes");
const Product_condition_routes=require("./routes/ProductConditionRoutes");
const Supplier_routes=require('./routes/SupplierRoutes');
const Supplier_shipment_routes=require("./routes/Supplier_shipmentRoutes");
const Supplier_shipment_details_routes=require("./routes/Supplier_shipment_detailsRoutes");
const Json_routes=require('./routes/JsonRoutes');
const Order_routes=require("./routes/OrderRoutes")
const Order_Status_routes=require('./routes/OrderStatusRoutes')
const path = require('path');


let waitlist = [];
for (let i = 0; i < 9; i++) {
  waitlist.push(`http://192.168.1.10${i}`);
}
waitlist.push('http://127.0.0.1:5000');
// const corsoption={

//     Credential:true,
//     origin: async function(origin,callback){
//         if(waitlist.indexof(origin)!== -1){
//             callback(null ,true);
//         }
//         else{
//             callback("no", false);
//         }
//     }
// }
const corsoption = {
  credentials: true,
  origin: function (origin, callback) {
    //    if (!origin) {
    //   // Origin is undefined or missing => reject
    //   return callback("No Origin header - request blocked by CORS", false);
    // }
    // console.log(origin)
    // if (!origin || waitlist.indexOf(origin) !== -1) {
    //   callback(null, true);
    // } else {
    //   callback(new Error("Not allowed by CORS"), false);
    // }
        callback(null, true);
  }
};


app.use(
  express_session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
      maxAge:3600000 ,
     secure:false,
     httpOnly:true, 
    },
       
  })
);



app.use(cors(corsoption));
app.use(cookieParser());
app.use(express.json(),express.urlencoded({extends:true}));
// after all routes and middlewares
app.use((err, req, res, next) => {
  console.error(err);
  res.status(403).json({ error: typeof err === "string" ? err : err.message || "Forbidden" });
});

// App routes.js
app.use(Exchange_routes);
app.use(Currency_routes);
app.use(User_Role_Status_routes);
app.use(User_routes);
app.use(Category_routes);
app.use(shipping_method_routes);
app.use(Attribute_option_routes);
app.use(Attribute_type_routes);
app.use(Category_attribute_routes);
app.use(Product_attribute_routes);
app.use(Product_routes);
app.use(Product_status_routes);
app.use(Product_condition_routes);
app.use(Supplier_routes);
app.use(Supplier_shipment_routes);
app.use(Supplier_shipment_details_routes);
app.use(Json_routes);
app.use(Order_routes);
app.use(Order_Status_routes);

app.get('/pleasetestmerightnow',(req,res)=>{
  res.send('adsfadsf');
})



async function syncDatabase(options = { alter: true }) {
  try {
    // Sync all models with the DB
    // await DB.sync(options);
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Failed to synchronize database:', error);
  }
}

async function startServer() {
  try {
      await connectDatabase();
      if(process.env.ASYNC_DB)
      await syncDatabase({alter: true  });
      startDatabaseHealthCheck();
  const server = app.listen(port,'0.0.0.0', () => {
    console.log(`🚀 Server running on ${port}`);
  });
  server.on('error', (err) => {
    console.error('🔥 Server error:', err.message);
    console.log('🔄 Restarting server...');
    setTimeout(startServer, 5000);
  });
    process.on('SIGINT', async () => {
      console.log('\n🛑 Stopping server...');
      await DB.close();
      console.log('🟢 Database connection closed');
      server.close(() => process.exit(0));
    });
  process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught exception:', err.message);
    console.log('🔄 Restarting server...');
    server.close(() => startServer());
  });
  process.on('unhandledRejection', (err) => {
    console.error('💥 Unhandled rejection:', err.message);
    console.log('🔄 Restarting server...');
    server.close(() => startServer());
  });
     } catch (error) {
      console.error('🔴 Failed to connect to the database:', error.message);
      process.exit(1);
    }
}


startServer();