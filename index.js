require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require("cookie-parser")

const urlRoute = require("./routes/url")
const staticRoute = require("./routes/staticRoutes")
const userRoute = require("./routes/user.js")
const { connectToMongoDB } = require("./connect")
const URL = require('./models/url')
const { restrictToLoggedinUser, checkAuth } = require('./middlewares/auth.js')

const app = express()
const PORT = process.env.PORT || 8001;
connectToMongoDB(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected !!"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static("public"))

app.set("view engine", 'ejs')
app.set("views", path.resolve("./views"))


app.use("/url", restrictToLoggedinUser, urlRoute)
app.use("/user", userRoute)
app.use("/", checkAuth, staticRoute)

app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId

    const entry = await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            }
        }
    });
    if (!entry) {
        return res.json({ error: "No URL Found" });
    }

    res.redirect(entry.redirectURL)
})


app.listen(PORT, () => {
    console.log(`Server is Started at port:${PORT}`)
})