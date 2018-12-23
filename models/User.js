const mongoose = require('mongoose');
const { Schema } = mongoose;

const meaningSchema = new Schema({});

const wordSchema = new Schema({
	word: String,
	lang: String,
	pronunciation: String,
	translation: String,
	meanings: [],
	examples: Array,
	success: Number,
	fail: Number,
	created: Date
});

const userSchema = new Schema({
	googleId: String,
	facebookId: String,
	email: String,
	fullName: String,
	firstName: String,
	lastName: String,
	photo: String,
	words: [wordSchema]
});

mongoose.model('users', userSchema);
