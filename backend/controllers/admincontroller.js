import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// ✅ Add Doctor Controller
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Check for all required fields
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.status(400).json({ success: false, message: "Missing details!" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        // Check if email already exists
        const existingDoctor = await doctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        // Prepare doctor data
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        };

        // Save to database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor added successfully" });

    } catch (error) {
        console.error("Add doctor error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Admin Login Controller
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing email or password" });
        }

        // You can replace this with your actual admin credentials or DB model
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@gmail.com";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: "Invalid admin credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            success: true,
            message: "Admin login successful",
            token,
        });

    } catch (error) {
        console.error("Login admin error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//API to get all doctors List for admin Panel 

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select("-password");
        res.json({ success: true, doctors });

    } catch (error) {
        console.error("Login admin error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error in appointmentsAdmin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API for Appointment Cancellation
const appointmentCancel = async (req, res) => {
    try {
        console.log("Cancel request body:", req.body); // <— This log helps confirm what's being received

        // Handle both possible field names
        const appointmentId = req.body.appointmentId || req.body._id;

        if (!appointmentId) {
            return res.json({ success: false, message: "No appointment ID provided" });
        }

        // Try to find appointment
        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // ✅ Mark appointment as cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // ✅ Free up the doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked || {};

        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: "Appointment cancelled successfully" });

    } catch (error) {
        console.error("Cancel appointment error:", error);
        res.json({ success: false, message: error.message });
    }
};

// ✅ Api to get Dashboard Data for Admin panel
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({}); // ✅ fixed name

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointment: appointments.reverse().slice(0, 5)
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.json({ success: false, message: error.message });
    }
};



export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }
