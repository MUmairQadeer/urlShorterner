const mongoose =require("mongoose")

async function connectToMongoDB(url){
    return mongoose.connect(url);

}
module.exports ={
    connectToMongoDB,
    
}
//if local mongo db not running use below commands to start it
// mkdir C: \data\db
// "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath C: \data\db
