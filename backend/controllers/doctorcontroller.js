import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {
    try {
        console.log("changeAvailability hit. Body received:", req.body);
        const { docId } = req.body;

        // Find doctor
        const docData = await doctorModel.findById(docId);
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        // Toggle availability properly
        const newAvailability = !docData.available;
        const updatedDoc = await doctorModel.findByIdAndUpdate(
            docId,
            { $set: { available: newAvailability } },
            { new: true, strict: false } // important!
        );

        if (!updatedDoc) {
            return res.json({ success: false, message: "Failed to update availability" });
        }

        res.json({
            success: true,
            message: `Doctor availability updated to ${newAvailability ? "Available" : "Unavailable"}`,
            updatedDoc,
        });
    } catch (error) {
        console.error("Error changing availability:", error);
        res.json({ success: false, message: error.message });
    }
};

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

//API for Doctor login

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find doctor by email ONLY
        const doctor = await doctorModel.findOne({ email });
        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { id: doctor._id, role: "doctor" },
            process.env.JWT_SECRET
        );

        res.json({ success: true, message: "Login successful", token });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Api to get list of doctors for doctor Panel 
const appointmentsDoctor = async (req, res) => {
    try {
        const doctorId = req.doctorId;   // coming from authDoctor middleware

        const appointments = await appointmentModel.find({ docId: doctorId });

        res.json({ success: true, appointments });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Mark appointment as completed
const appointmentComplete = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findOne({ _id: appointmentId });

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.docId.toString() !== doctorId) {
            return res.json({ success: false, message: "Not authorized for this appointment" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            isCompleted: true,
            cancelled: false
        });

        res.json({ success: true, message: "Appointment marked as completed" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Cancel appointment
const appointmentCancel = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findOne({ _id: appointmentId });

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        if (appointmentData.docId.toString() !== doctorId) {
            return res.json({ success: false, message: "Not authorized for this appointment" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {
            cancelled: true,
            isCompleted: false
        });

        res.json({ success: true, message: "Appointment cancelled" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

//Api to get Dashboard stats for doctor panel

const doctorDashboard = async (req, res) => {
    try {
        const docId = req.doctorId;   // get from JWT token

        const appointments = await appointmentModel.find({ docId });

        let earnings = 0;
        let patients = [];

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount;
            }

            if (!patients.includes(item.userId.toString())) {
                patients.push(item.userId.toString());
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.slice().reverse().slice(0, 5),
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

//API to get doctor Profile for Doctor Panel 
const doctorProfile = async (req, res) => {
    try {
        const docId = req.doctorId;   // get from JWT token
        const profileData = await doctorModel.findById(docId).select('-password');

        res.json({ success: true, profileData });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

//Api to update doctor Profile for Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.doctorId;   // get from JWT token
        const { fees, address, available } = req.body;

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })
        res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }

}

export {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
};
