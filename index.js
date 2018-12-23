const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const querystring = require('querystring');
require('./models/User');
require('./services/passport');
const url = require('./config/env').url;

const User = mongoose.model('users');

mongoose.connect(
	keys.mongoURI,
	{ useNewUrlParser: true }
);

app.use(cors());
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey]
	})
);
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.get(`${url}/meaning_for/:lang/:word`, (req, res) => {
	const { lang, word } = req.params;
	console.log(
		`https://glosbe.com/gapi/translate?from=${
			lang === 'fra' ? 'eng' : 'fra'
		}&dest=${lang}&format=json&phrase=${querystring.escape(word)}`
	);
	axios
		.get(
			`https://glosbe.com/gapi/translate?from=${
				lang === 'fra' ? 'eng' : 'fra'
			}&dest=${lang}&format=json&phrase=${querystring.escape(word)}`
		)
		.then(response => {
			const { tuc } = response.data;
			res.send(tuc);
		})
		.catch(err => res.send(err));
});

app.post(`${url}/update_words/`, (req, res) => {
	console.log(req.body);
	User.findOneAndUpdate(
		{ email: req.user.email },
		{ words: req.body },
		(error, success) => {
			error
				? res.send('Word could not be saved')
				: res.send('Word has been saved');
		}
	);
});

require('./routes/authRoutes')(app);

app.listen(3000);
