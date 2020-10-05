const mongoose = require("mongoose");

//Schema represent the database's structure and it's contents.
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: false,
        }
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true,
        }
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date().toString(),
    },
}, {
    timestamps: true,
});

//inside mongoose.model('user')=>'user'represent the singular form of database.
//name(mongodb will search pular name of 'user' in db)
//Afterward we can use variable name (User) anytime when we update and compare user's login and register in db.
const User = mongoose.model("user", userSchema);

module.exports = User;