var mongoose = require('mongoose');            

mongoose.connect('mongodb://106.15.192.128:27017/autuNew?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})     //Connecting to a remote database autuNew
 
var db = mongoose.connection;

const UseSchema = new mongoose.Schema({
    // "firstName", "lastName", "email", "password", "bio", "accessLevel"
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    bio: { type: String },
    accessLevel: { type: Number},
    password: { type: String, 
        set(val) {
            return require("bcrypt").hashSync(val, 10)
        }
    }
})

const User = mongoose.model("User", UseSchema)

module.exports = { User }

