const passport = require('passport');

module.exports = app => {
	app.get(
		'/auth/facebook',
		passport.authenticate('facebook', {
			display: 'popup',
			scope: ['email']
		})
	);

	app.get(
		'/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: 'https://www.facebook.com/dialog/return/close#_=_'
		})
	);

	// Logout Route
	app.get('/api/logout', (req, res) => {
		req.logout();
		res.send(req.user);
	});

	// Current User Route
	app.get('/api/current_user', (req, res) => res.send(req.user));
};
