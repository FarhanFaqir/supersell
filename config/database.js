const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL,
            {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
            });
        console.log('Db connected successfully');
    } catch (err) {
        console.log("Db connection error : ", err);
        process.exit(1);
    }

};

module.exports = connectDB;