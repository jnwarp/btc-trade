/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {



  /**
   * `UserController.login()`
   */
  login: function (req, res) {
    return res.json({
      email: req.param('email'),
			password: req.param('password')
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {
		// Forget the user from the session
		req.session.me = null;

		// Return response to non-HTML browser
		if (req.wantsJSON) {
			return res.ok('Logged out successfully!');
		}

		// Redirect user back to the login page
    return res.redirect('/login/');
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {
    return res.json({
      todo: 'signup() is not implemented yet!'
    });
  }
};
