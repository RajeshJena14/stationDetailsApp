const mongoose = require('mongoose');
const mongoURI = "mongodb://127.0.0.1:27017/stationApp"

const connectToMongo = () => {
    mongoose.connect(mongoURI).then(()=>{console.log("Connected to mongo succesfully.");
    }).catch((e)=>{console.log(e.message);
    })
}

module.exports = connectToMongo;