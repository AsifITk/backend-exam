const express = require("express");
const userModel = require("../models/userModel")

const AuthorModel = require("../models/authorModel");
const BookModel = require("../models/bookModel");
const IssueModel = require("../models/issueModel");
const router = express.Router();

//! Add a new user /issue/add"
router.post("/add", async (req, res) => {
    const { issuedTo, book } = req.body;
    if (!issuedTo || !book) return res.status(400).send("Fill all the fields");

    const newIssue = new IssueModel({
        issuedTo: issuedTo,
        book: book
    })
    let savedIssue = await newIssue.save();
    if (!savedIssue) return res.status(400).send("could not issue");

    let bookUpdate = await BookModel.findByIdAndUpdate(book, {
        status: "unavailable"
    })
    return res.status(200).send({
        savedIssue: savedIssue
    })

    console.log(bookUpdate);

});


// // !List a  issue "issue/:id"
router.get("/:id", async (req, res) => {
    let issueId = req.params.id;
    let foundIssue = IssueModel.findById(issueId);
    if (!foundIssue) return res.status(400).send("No issue found")
    return res.status(200).send({
        foundIssue: foundIssue
    })


})

// !Get A Author "issue/alll"
router.get("/all", async (req, res) => {

    let foundIssue = IssueModel.find();
    if (!foundIssue) return res.status(400).send("No issue found")
    return res.status(200).send({
        foundIssue: foundIssue
    }
    )


})


// !Get A Author "issue/overdue"

router.get("/overdue", async (req, res) => {
    const { dueDate } = req.body();
    const results = await IssueModel.find({
        startTime: { $lte: user_date },
        endTime: { $gte: user_date }
    });

    if (!foundIssue) return res.status(400).send("No issue found")
    return res.status(200).send({
        foundIssue: foundIssue
    })


})






module.exports = router;
