import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-5 space-y-8">
        {/* === Top Cards === */}
        <div className="flex flex-wrap gap-5">
          <div className="flex items-center gap-3 bg-white p-5 min-w-[13rem] rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-transform">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-2xl font-semibold text-gray-700">{dashData.doctors}</p>
              <p className="text-gray-400 text-sm">Doctors</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-5 min-w-[13rem] rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-transform">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-2xl font-semibold text-gray-700">{dashData.appointments}</p>
              <p className="text-gray-400 text-sm">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-5 min-w-[13rem] rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-transform">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-2xl font-semibold text-gray-700">{dashData.patients}</p>
              <p className="text-gray-400 text-sm">Patients</p>
            </div>
          </div>
        </div>

        {/* === Latest Bookings === */}
        <div className="bg-white border rounded-lg shadow-sm">
          <div className="flex items-center gap-3 px-5 py-4 border-b bg-gray-50 rounded-t-lg">
            <img className="w-5" src={assets.list_icon} alt="list" />
            <p className="font-semibold text-gray-700">Latest Bookings</p>
          </div>

          <div className="divide-y">
            {dashData.latestAppointment?.length > 0 ? (
              dashData.latestAppointment.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-6 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* Doctor Info */}
                  <div className="flex items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={item.docData?.image}
                      alt="Doctor"
                    />
                    <div>
                      <p className="font-medium text-gray-700">{item.docData?.name}</p>
                      <p className="text-xs text-gray-400">{slotDateFormat(item.slotDate)} — {item.slotTime}</p>
                    </div>
                  </div>

                  {/* Status / Action */}
                  <div className="flex items-center gap-3">
                    {item.cancelled ? (
                      <p className="text-red-500 text-sm font-semibold">Cancelled</p>
                    ) : (
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
                        src={assets.cancel_icon}
                        alt="Cancel"
                        title="Cancel Appointment"
                      />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-6">No recent appointments</p>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
