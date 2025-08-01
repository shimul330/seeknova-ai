import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
        req.userId = decoded.id
        next()
    } catch (err) {
        console.error("Authorization error:", err);
        return res.status(403).json({ message: "Token is not valid" });
    }
}
export default verifyToken;