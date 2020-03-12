const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    login: String,
    password: String,
    about: String,
    tel: String,
    instagram: String,
    profileImg:  {type: String, default: 'avatar.png'},
    checkEmail: {type: Boolean, default: false},
    style: {type: String, default: 'Light'},
});

module.exports = mongoose.model('User', userSchema);
