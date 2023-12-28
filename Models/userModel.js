const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    profileImage: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    }]
})

UserSchema.plugin(plm);

module.exports = mongoose.model("user", UserSchema);