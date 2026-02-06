// require('dotenv').config();       // for env file

const ENV=process.env.NODE_ENV || 'production'
// const ENV=process.env.NODE_ENV || 'development'
require('dotenv').config({
  path:`.env.${ENV}`
}); 


const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const { hostRouter } = require("./routers/hostRouter");
const storeRouter = require("./routers/storeRouter");
const { authRouter } = require("./routers/authRouter");
const fetchUser = require("./middleware/fetchUser");   
const multer=require('multer');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');
const rootDir = require("./utils/path-util");
const errorController = require("./controllers/errorController");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodb_session = require("connect-mongodb-session");

// const mongodb_url = `mongodb://127.0.0.1:27017/${process.env.MONGO_DB_DATABASE}`; 
// const mongodb_url = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.xxbwcxp.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`;


const loggingPath=path.join(rootDir,'access.log');

const loggingStream=fs.createWriteStream(loggingPath,{flags:'a'});





const app = express();
// Add this near the top of App.js, right after 'const app = express();'
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(helmet());

app.use(compression());

app.use(morgan('combined',{stream:loggingStream}));




app.set("view engine", "ejs");
app.set("views", "views");

// app.use(express.static(path.join(rootDir, "public")));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(rootDir, "uploads"))); //  
app.use("/uploads",express.static(path.join(rootDir, "uploads")));  // 

app.use(bodyParser.urlencoded({ extended: true }));


const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null,'uploads/');
  },
  filename:(req,file,cb)=>{
    const date = new Date().toISOString().replace(/:/g, '-');
    cb(null,date + '_' + file.originalname);  
  }
})

const fileFilter=(req,file,cb)=>{
  const isValidFile = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.mimetype);
  cb(null, isValidFile);
}

app.use(multer({storage:storage,fileFilter}).single('photo'));             


app.use((req, res, next) => {
  console.log("Request Received : ", req.url, req.method, req.body);
  next();
});



const mongodbStore=mongodb_session(session);

const sessionStore=new mongodbStore({
  uri:mongodb_url,
  collection:'sessions',
});



app.use(
  session({
    secret: "airbnb-secret",
    resave: false, 
    saveUninitialized: false, 
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 
    }
  })
);
app.use(fetchUser);      

app.use((req, res, next) => {          
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.user = req.user;
  next();
});

app.use(storeRouter);
app.use(authRouter);


app.use("/host", hostRouter);

app.use(errorController.get404);

const PORT = process.env.PORT || 8080;


mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.log("Mongoose Connection Error: ", err));
