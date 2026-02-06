const mongodb=require('mongodb');

const MongoClient=mongodb.MongoClient;

// const url="mongodb+srv://KKR:123Candle123@cluster0.xxbwcxp.mongodb.net/Cluster0?appName=Cluster0";
const url="mongodb://127.0.0.1:27017/airbnb";

let _db;   // local variable assign like this 

const mongoConnect=(callback)=>{   
    MongoClient.connect(url)
    .then((client)=>{
        // console.log(client);
        _db=client.db("airbnb");
        callback();  
    })
    .catch(error=>{
        console.log('error came while connecting to mongoDb',error);
    })
};

const getDb=()=>{
    if(!_db){
        throw new Error('Could not connect to Db');
    }
    return _db;
}

exports.mongoConnect=mongoConnect;
exports.getDb=getDb;