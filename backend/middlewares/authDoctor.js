import jwt from "jsonwebtoken";

const authDoctor = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = header.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Token format incorrect" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.doctorId = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not authorized",
            error: error.message
        });
    }
};

export default authDoctor;
