import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers; // or you can use req.headers.authorization

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Instead of modifying req.body (which may not exist for GET), attach userId directly
        req.userId = decoded.id;

        next();
    } catch (error) {
        console.error("Error in authUser middleware:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export default authUser;
