import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Minimal production-safe profile fields
                const user = {
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                };

                // 👉 Later you will:
                // - Find or create user in DB here
                // - Enforce email verification logic

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Required for OAuth session handling
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;
