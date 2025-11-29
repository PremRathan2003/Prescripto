import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import React from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(
        localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
    );

    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const [profileData, setProfileData] = useState(false);

    // ---------------------------------------------------
    // 🔥 1. Axios Interceptor (ONLY once)
    // ---------------------------------------------------
    useEffect(() => {
        const interceptor = axios.interceptors.request.use((config) => {
            const token = localStorage.getItem("dToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    // ---------------------------------------------------
    // 🔥 2. Fetch Doctor Appointments
    // ---------------------------------------------------
    const getAppointments = async () => {
        if (!dToken) {
            console.log("No doctor token yet, skipping request...");
            return;
        }

        try {
            const { data } = await axios.get(
                backendURL + "/api/doctor/appointments"
            );

            if (data.success) {
                setAppointments(data.appointments);
                console.log("Doctor Appointments:", data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error(error.message);
        }
    };


    // ---------------------------------------------------
    // 🔥 3. Complete Appointment
    // ---------------------------------------------------
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendURL + "/api/doctor/complete-appointment",
                { appointmentId }
            );

            if (data.success) {
                toast.success("Appointment marked as completed");
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    // ---------------------------------------------------
    // 🔥 4. Cancel Appointment
    // ---------------------------------------------------
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendURL + "/api/doctor/cancel-appointment",
                { appointmentId }
            );

            if (data.success) {
                toast.success("Appointment canceled");
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const getDashData = async () => {
        if (!dToken) return;

        try {
            const { data } = await axios.get(backendURL + "/api/doctor/dashboard");

            if (data.success) {
                setDashData(data.dashData);
                console.log("Doctor Dashboard Data:", data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Dashboard Error:", error);
            toast.error(error.message);
        }
    };

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendURL + "/api/doctor/profile", { headers: { dToken } });

            if (data.success) {
                setProfileData(data.profileData);
                console.log("Doctor Profile Data:", data.profileData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error("Dashboard Error:", error);
            toast.error(error.message);
        }
    }

    // ---------------------------------------------------
    // 🔥 5. Exported Context
    // ---------------------------------------------------
    const value = {
        backendURL,
        dToken,
        setDToken,
        appointments,
        setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData,
        setDashData,
        getDashData,
        profileData,
        getProfileData,
        setProfileData,
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
