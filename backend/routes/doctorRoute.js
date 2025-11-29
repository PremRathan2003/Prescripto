import express from "express";
import {
    loginDoctor,
    doctorList,
    changeAvailability,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,

} from "../controllers/doctorcontroller.js";

import authDoctor from "../middlewares/authDoctor.js";

const router = express.Router();

// Doctor Login
router.post("/login", loginDoctor);

// Get doctor list (admin only, optional)
router.get("/list", doctorList);

// Doctor Appointments (GET)
router.get("/appointments", authDoctor, appointmentsDoctor);

// Change availability (protected)
router.post("/change-availability", authDoctor, changeAvailability);

router.post('/complete-appointment', authDoctor, appointmentComplete)

router.post('/cancel-appointment', authDoctor, appointmentCancel)

router.get('/dashboard', authDoctor, doctorDashboard)

router.get('/profile', authDoctor, doctorProfile)

router.post('/update-profile', authDoctor, updateDoctorProfile)


export default router;
