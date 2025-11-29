import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Validate admin using email stored in the token
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ success: false, message: "Not Authorized Login Again" });
        }

        req.admin = decoded;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Invalid or Expired Token" });
    }
};

export default authAdmin;
