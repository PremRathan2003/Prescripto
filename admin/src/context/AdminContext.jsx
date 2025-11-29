import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : "")
    const [doctorsList, setDoctorsList] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem("aToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } })
            if (data.success) {
                setDoctorsList(data.doctors)
                console.log(data.doctors);
            } else {
                toast.error(data.message || "Failed to fetch doctors")
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const changeAvailability = async (docId) => {
        try {
            // ✅ Optimistic update (instantly update UI)
            setDoctorsList((prevDoctors) => {
                const updated = prevDoctors.map((doc) =>
                    doc._id === docId ? { ...doc, available: !doc.available } : doc
                );
                return [...updated]; // return a new array (important!)
            });

            // ✅ API call to backend
            const { data } = await axios.post(
                backendUrl + "/api/admin/change-availability",
                { docId },
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message || "Failed to change availability");
                // Fallback reload
                getAllDoctors();
            }
        } catch (error) {
            toast.error(error.message);
            getAllDoctors();
        }
    };

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', {
                headers: { aToken },
            });

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message);

        }
    }

    const cancelAppointment = async (appointmentId) => {   // ✅ corrected parameter name
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/cancel-appointment',
                { appointmentId },   // ✅ corrected key
                { headers: { aToken } }
            );

            if (data.success) {
                toast.success(data.message);
                getAllAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    const value = {
        aToken, setAToken,
        backendUrl,
        doctorsList, setDoctorsList,
        getAllDoctors, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData, getDashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider
