const mongoose = require('mongoose');



const Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true


    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,

        required: true
    },
    issuedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },

    status: {
        type: String,
        default: "available",
        required: true
    }


},
    {
        timestamps: true,
    });

const BookModel = mongoose.model('Book', Schema);

module.exports = BookModel;

