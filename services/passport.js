const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) =>
	done(null, await User.findById(id))
);

passport.use(
	new FacebookStrategy(
		{
			clientID: keys.facebookAppID,
			clientSecret: keys.facebookAppSecret,
			callbackURL: 'http://165.227.213.125:3000/facebook/callback',
			profileFields: [
				'id',
				'displayName',
				'photos',
				'emails',
				'first_name',
				'gender',
				'last_name'
			]
		},
		async (accessToken, refreshToken, profile, done) => {
			const existingUser = await User.findOneAndUpdate(
				{ email: profile.emails[0].value },
				{ photo: profile.photos[0].value }
			);

			if (existingUser) {
				return done(null, existingUser);
			}

			const user = await new User({
				facebookId: profile.id,
				email: profile.emails[0].value,
				firstName: profile._json.first_name,
				lastName: profile._json.last_name,
				photo: profile.photos[0].value,
				verbs: []
			}).save();
			done(null, user);
		}
	)
);
