import rateLimit from "express-rate-limit";

//Signup abuse protection

export const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 15 minutes
    max: 5,
    message: "Too many signup attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});


 // Login abuse protection (password + magic link)

export const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});


 // Magic link verification abuse protection
 
export const magicLinkLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: "Too many verification attempts. Please slow down.",
    standardHeaders: true,
    legacyHeaders: false,
});


 // Google OAuth abuse protection
 
export const googleLoginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15,
    message: "Too many Google login attempts. Please slow down.",
    standardHeaders: true,
    legacyHeaders: false,
});
