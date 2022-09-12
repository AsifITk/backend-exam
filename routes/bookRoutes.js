const express = require("express");
const userModel = require("../models/userModel")

const AuthorModel = require("../models/authorModel");
const BookModel = require("../models/bookModel")
const router = express.Router();

//! Add a new user "/book/add"
router.post("/add", async (req, res) => {
    const { title, authorId, authorName } = req.body;
    if (!title || !authorId || !authorName) return res.status(400).send("Provide All info");
    const existingBook = await BookModel.findOne({ title: title });
    if (existingBook) return res.status(400).json({ msg: "Book already exists" });


    const newBook = new BookModel({
        title: title,
        authorId: authorId,
        authorName: authorName
    })
    // {
    //     "name":"author1",
    //     "desc":"Very good author indeed.."
    // }

    let resBook = await newBook.save();
    if (!resBook) return res.status(400).send("Could not add author");
    let author = await AuthorModel.findByIdAndUpdate(authorId, {
        $push: { books: newBook._id }
    }, { new: true });

    return res.status(200).send({
        newBook: newBook,
        author: author
    })
});

// !List all authors "book/all"
router.get("/all", async (req, res) => {
    let allBooks = await BookModel.find();
    if (!allBooks) return res.status(400).send("Could not get Books")
    return res.status(200).send({
        allBooks: allBooks
    })

})

// !Get A Author "book/one"
router.get("/one", async (req, res) => {

    let { authorId } = req.body;
    if (!authorId) return res.status(400).send("Please provide author id");

    const author = await AuthorModel.findById(authorId + "");
    if (!author) return res.status(400).send("Author not found")

    return res.status(200).send({ author: author })

})

//! GET /books?status='available' : Get all books which are available
// !Get all available books


router.get("/available", async (req, res) => {
    let status = req.query.status;
    console.log(req.query.status)
    let allBooks = await BookModel.find({ status: "available" });
    if (!allBooks) return res.status(400).send("Could not get Books")
    return res.status(200).send({
        allBooks: allBooks
    })

})
router.get("/author", async (req, res) => {
    let status = req.query.status;
    let author = req.query.quthor;
    console.log(req.query.status)
    console.log(req.query.author)
    let allBooks = await BookModel.find({ status: status, author: author });
    console.log(allBooks)
    if (!allBooks) return res.status(400).send("Could not get Books")
    return res.status(200).send({
        allBooks: allBooks
    })

})






module.exports = router;
