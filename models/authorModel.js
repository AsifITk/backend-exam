const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true

        },
        desc: {
            type: String,
        },

        books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
    },
    {
        timestamps: true,
    }
);

const AuthorModel = mongoose.model("Author", Schema);

module.exports = AuthorModel;
