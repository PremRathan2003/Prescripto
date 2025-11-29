import validator from 'validator';
import bycrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from "cloudinary";
import doctorModel from '../models/doctorModel.js';
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay'

// API to Register a User
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check for missing fields
        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details" });
        }
        // Email format validation    
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid Email" });
        }
        // Password strength validation
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Hash the password
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword
        }
        // Save userData to database (pseudo code)
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, message: "User Registered Successfully", token });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.json({ success: false, message: error.message });
    }
}

//API to Login User
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        const isMatch = await bycrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, message: "Login Successful", token });
        }
        else {
            res.json({ success: false, message: "Invalid Credentials" });
        }


    } catch (error) {

        console.error("Error in loginUser:", error);
        res.json({ success: false, message: error.message });
    }
};

// Api to get user Profile data

const getProfile = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId).select("-password");

        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, userData });
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.json({ success: false, message: error.message });
    }
};

// Api to update user Profile data
// ✅ Update User Profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone, dob, gender, address } = req.body; // ✅ fixed names
        const imageFile = req.file;

        // ✅ Validate input
        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        // ✅ Build update object
        const updateData = {
            name,
            phone,
            dob,
            gender,
        };

        if (address) {
            try {
                updateData.address = JSON.parse(address);
            } catch (err) {
                updateData.address = address; // fallback if already an object
            }
        }

        // ✅ Handle image upload (optional)
        if (imageFile) {
            const uploaded = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            updateData.image = uploaded.secure_url;
        }

        // ✅ Update user using ID from middleware
        await userModel.findByIdAndUpdate(req.userId, updateData);

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.json({ success: false, message: error.message });
    }
};

// API to Book Appointment
// ✅ API to Book Appointment
const bookAppointment = async (req, res) => {
    try {
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.userId; // ✅ from middleware

        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor is not available" });
        }

        let slots_booked = docData.slots_booked || {};

        // ✅ Check if slot is already booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime]; // ✅ fixed double push
        }

        const userData = await userModel.findById(userId).select("-password");

        // ✅ Convert to plain object before deleting fields
        const docDataObj = docData.toObject();
        delete docDataObj.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: docDataObj,
            amount: docData.fees,
            slotDate,
            slotTime,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // ✅ Update doctor's booked slots
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Booked Successfully" });
    } catch (error) {
        console.error("Error in bookAppointment:", error);
        res.json({ success: false, message: error.message });
    }
};

//API to get user appointment for frontend my-appointment page

const listAppointment = async (req, res) => {
    try {
        const userId = req.userId; // ✅ from middleware
        const appointments = await appointmentModel.find({ userId }); // ✅ proper query
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Api to Cancel Appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId; // ✅ from middleware
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // ✅ Verify correct user
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        // ✅ Mark appointment as cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // ✅ Free up the doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;

        if (slots_booked && slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        }

        res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})
// API to make payment of Appointment using Razor Pay

const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" });
        }

        const options = {
            amount: appointmentData.amount * 100, // Razorpay accepts amount in paise
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId,
        };

        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        console.log("Error in paymentRazorpay:", error);
        res.json({ success: false, message: error.message });
    }
};

//API to verify payment of Razorpay
const verifyRazorPay = async (req, res) => {
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment: true})
            res.json({success: true, message: "Payment Successful"})
        }
        else{
            res.json({success: false, message: "Payment Failed"})
        }

    
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorPay };
