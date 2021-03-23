const express = require("express")
const jwt = require("jsonwebtoken")
const { User } = require("./db")

const app = express()
app.use(express.json())

const SECRET = "131313"

// Get all users
app.get("/user", async (req, res) => {
    const users = await User.find()
    res.send(users)
})

// Create a user
app.post("/user", async (req, res) => {
    console.log(req.body["firstName"], req.body["lastName"], req.body["password"])
    if(!req.body["firstName"] || !req.body["lastName"] || !req.body["password"]) {
        return res.status(422).send({
            message: "Please enter complete information"
        })
    }

    const ReqArr = ["firstName", "lastName", "email", "password", "bio", "accessLevel"]
    const ReqObj = {}
    ReqArr.map((item) => {
        if(req.body[item]) {
            ReqObj[item] = req.body[item]
        }
    })
    console.log(ReqObj)

    const user = await User.create(ReqObj)

    res.send(user)
})

// Getting a single user
app.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id, (error) => {
        if(error) {
            return res.status(422).send({
                message: "User does not exist"
            })
        }
        
    })

    if(!user) {
        return res.status(422).send({
            message: "User does not exist"
        })
    }

    res.send({
        user
    })
})

// Modify the user
app.put("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        return res.status(422).send({
            message: "User does not exist"
        })
    }

    const ReqArr = ["firstName", "lastName", "email", "password", "bio", "accessLevel"]
    const ReqObj = {}

    ReqArr.map((item) => {
        if(req.body[item]) {
            ReqObj[item] = req.body[item]
        }
    })

    let updates = {$set: ReqObj};

    User.update({_id: req.params.id}, updates, function (error) {
        if (error) {
            console.error(error);
        } else {
            console.error("Updated user name successfully")
        }
    });

    res.send({
        code: 0,
        msg: "Updated user name successfully"
    })
})

// Delete user
app.delete("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        return res.status(422).send({
            message: "User does not exist"
        })
    }

    User.remove({_id: req.params.id}, function (error) {
        if (error) {
            console.error(error);
        } else {
            console.error("")
            res.send({
                code: 0,
                msg: "User deleted successfully"
            })
        }
    })
})

// The user login
app.post("/auth/signin", async (req, res) => {
    // "firstName", "lastName", "email", "password", "bio", "accessLevel"
    console.log(req.body.firstName, req.body.lastName, req.body.password)
    const user = await User.findOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    if(!req.body["password"]) {
        return res.status(422).send({
            message: "Please enter your password."
        })
    }

    if(!user) {
        return res.status(422).send({
            message: "User does not exist"
        })
    }

    console.log(">>>", user)

    const isPasswordValid = require("bcrypt").compareSync(req.body.password, user.password)
    console.log("isPasswordValid", isPasswordValid)
    if(!isPasswordValid) {
        return res.status(422).send({
            message: "The password is invalid"
        })
    }


    const token = jwt.sign({
        id: String(user._id)
    }, SECRET)

    res.send({
        user,
        token
    })
})

// validation token
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(" ").pop()
    if(!raw) {
        return res.status(422).send({
            message: "Login date"
        })
    }
    const { id } = jwt.verify(raw, SECRET)

    req.user = await User.findById(id)
    next()
}

// Gets the user's login token
app.get("/auth/validate", auth, async (req, res) => {
    res.send(req.user)
})

app.listen(3001, () => {
    console.log("http://localhost:3001")
})