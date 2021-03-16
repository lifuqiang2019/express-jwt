const express = require("express")
const { User } = require("./db")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())

const SECRET = "131313"

app.get("/users", async (req, res) => {
    const users = await User.find()
    res.send(users)
})

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(" ").pop()
    const { id } = jwt.verify(raw, SECRET)

    req.user = await User.findById(id)
    next()
}

app.get("/profile", auth, async (req, res) => {
    res.send(req.user)
})

app.post("/register", async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })

    res.send(user)
})

app.post("/login", async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
    })
    if(!user) {
        return res.status(422).send({
            message: "用户不存在"
        })
    }

    const isPasswordValid = require("bcrypt").compareSync(req.body.password. user.password)
    if(!isPasswordValid) {
        return res.status(422).send({
            message: "密码无效"
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

app.listen(3001, () => {
    console.log("http://localhost:3001")
})