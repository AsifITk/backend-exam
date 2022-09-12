const mongoose = require('mongoose');



const Schema = new mongoose.Schema({

    issuedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },

    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',

    },





},
    {
        timestamps: true,
    });

const IssueModel = mongoose.model('Book', Schema);

module.exports = IssueModel;

