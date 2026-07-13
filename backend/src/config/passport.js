const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { findOrCreateGoogleUser } = require('../services/auth.service');

/**
 * Passport is used only as a transport layer for Google OAuth.
 * Sessions are kept minimal — we persist only the user id and immediately
 * exchange it for a JWT so no persistent session state is needed
 * beyond the single OAuth round-trip.
 */
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser((id, done) => {
  const User = require('../models/user.model');
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
});

const isGoogleOAuthConfigured =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

if (isGoogleOAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateGoogleUser(profile);
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      },
    ),
  );
} else if (process.env.NODE_ENV !== 'test') {
  console.warn('Google OAuth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL.');
}

module.exports = passport;
