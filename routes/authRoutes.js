const express = require("express");
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const router = express.Router();

//! Add a new user "/auth/signup"
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    // {
    //     "name":"user1",
    //      'email':"user1@email.com",
    //      "password":"123456"
    // }
    if (!email || !password || !name) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const newUser = await UserModel.create({

        name: name,
        email: email,
        password: hashedPassword,
    });
    if (!newUser) return res.status(400).send("user not Created")
    console.log(req.body);
    let sendUser = { ...newUser };
    delete sendUser._doc.password;

    return res.send({
        msg: "User created",
        user: sendUser._doc,
    });
});
//! Login a new user "/auth/login"
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // {
    //     "email":"user1@email.com", 
    //     "password":"123456"
    // }
    console.log(email, password);

    if (!email || !password) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }
    const user = await userModel.findOne({ email: email });
    let payload = { email: user.email };
    if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }
    let sendUser = { ...user };
    delete sendUser._doc.password;
    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10h",
    });
    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10h",
    });
    res.send({
        accessToken: accessToken,
        refreshToken: refreshToken,
        id: user._id
    });
});
//! Get a users details "/auth/:id"
router.get("/user/:id", async (req, res) => {
    const userId = req.params.id
    const user = await userModel.findById(userId);
    console.log(user);
    if (user == null) {
        return res.status(400).send("User not found")
    }
    return res.status(200).send(user);
});
//! Get a new refrech token
router.get("/token", async (req, res) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).send("please Provide Refresh token");
    }
    try {
        let payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        delete payload.exp;
        delete payload.iat;
        let newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).send({ accessToken: newAccessToken });
    } catch (err) {
        res.status(401).json({ error: "invalid Refesh token provided" });
    }
});





module.exports = router;
