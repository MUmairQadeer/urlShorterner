
const User = require("../models/user");
const { setUser } = require('../service/auth');
async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.render('signup', {
            error: "All fields are required"
        });
    }

    try {
        await User.create({
            name,
            email,
            password,
        });
        return res.redirect("/");
    } catch (error) {
        if (error.code === 11000) {
            return res.render('signup', {
                error: "Email already exists. Please use a different email or login."
            });
        }
        return res.render('signup', {
            error: "An error occurred during signup"
        });
    }
}
async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({
        email,
        password,
    })

    if (!user) {
        return res.render('login', {
            error: "Invalid Username or Password"
        })
    }


    const token = setUser(user)
    res.cookie('uid', token);
    return res.redirect("/")
}
module.exports = {
    handleUserSignup,
    handleUserLogin
}