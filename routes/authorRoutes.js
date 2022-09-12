const express = require("express");
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AuthorModel = require("../models/authorModel");
const router = express.Router();

//! Add a new user "/author/add"
router.post("/add", async (req, res) => {
    const { name, desc } = req.body;
    if (!name || !desc) return res.status(400).send("Provide All info");
    const existingAuthor = await AuthorModel.findOne({ name: name });
    if (existingAuthor) return res.status(400).json({ msg: "User already exists" });


    const newAuthor = new AuthorModel({
        name: name,
        desc: desc
    })
    // {
    //     "name":"author1",
    //     "desc":"Very good author indeed.."
    // }

    let resAuthor = await newAuthor.save();
    if (!resAuthor) return res.status(400).send("Could not add author");
    return res.status(200).send('Author Added')
});
// !List all authors "author/all"
router.get("/all", async (req, res) => {
    let allAuthors = await AuthorModel.find().populate({
        path: 'books',

    });
    if (!allAuthors) return res.status(400).send("Could not get authors")
    return res.status(200).send({
        allAuthors: allAuthors
    })

})

// !Get A Author "author/one"
router.get("/one", async (req, res) => {

    let { authorId } = req.body;
    if (!authorId) return res.status(400).send("Please provide author id");

    const author = await AuthorModel.findById(authorId + "").populate({
        path: 'books',

    });;
    if (!author) return res.status(400).send("Author not found")
    return res.status(200).send({ author: author })

})

module.exports = router;
