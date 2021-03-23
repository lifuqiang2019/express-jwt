var mongoose = require('mongoose');            
let mongodbAlta = "mongodb+srv://978080458:131131@cluster0.9g0na.mongodb.net/jwt-auth?retryWrites=true&w=majority"
let myRemote = "mongodb://106.15.192.128:27017/autuNew?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false"
mongoose.connect(mongodbAlta, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})     //Connecting to a remote database autuNew

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

