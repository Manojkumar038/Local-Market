import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authurization = req.header("Authorization");
    const token = authurization.split(" ")[1];

    console.log("Token recieved at authMiddleware: \n" + token);
    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token" });
    }
};
