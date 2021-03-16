var mongoose = require('mongoose');            

mongoose.connect('mongodb://106.15.192.128:27017/autu?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false', {
    useCreateIndex: true,
    useNewUrlParser: true,
})     //连接本地数据库blog 

var db = mongoose.connection;


const UseSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String, 
        set(val) {
            return require("bcrypt").hashSync(val, 10)
        }
    }
})

const User = mongoose.model("User", UseSchema)

module.exports = { User }

