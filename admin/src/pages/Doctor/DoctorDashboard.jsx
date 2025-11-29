import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  if (!dashData) return null;

  return (
    <div className='m-5'>
      {/* Summary Cards */}
      <div className="flex flex-wrap gap-5">

        <div className="flex items-center gap-3 bg-white p-5 min-w-[13rem] rounded-lg border shadow-sm cursor-pointer hover:scale-105 transition-transform">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="text-2xl font-semibold text-gray-700">
              {currency} {dashData.earnings}
            </p>
            <p className="text-gray-400 text-sm">Earnings</p>
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

      {/* Latest Bookings */}
      <div className="bg-white border rounded-lg shadow-sm mt-6">
        <div className="flex items-center gap-3 px-5 py-4 border-b bg-gray-50 rounded-t-lg">
          <img className="w-5" src={assets.list_icon} alt="list" />
          <p className="font-semibold text-gray-700">Latest Bookings</p>
        </div>

        <div className="divide-y">
          {dashData.latestAppointments?.length > 0 ? (
            dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center px-6 py-3 hover:bg-gray-50 transition-colors"
              >

                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={item.userData?.image}
                    alt="User"
                  />
                  <div>
                    <p className="font-medium text-gray-700">{item.userData?.name}</p>
                    <p className="text-xs text-gray-400">
                      {slotDateFormat(item.slotDate)} — {item.slotTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {
                    item.cancelled ?
                      <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                      :
                      item.isCompleted ?
                        <p className='text-green-500 text-xs font-medium'>Completed</p>
                        :
                        <div className='flex gap-3'>
                          <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                          <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                        </div>
                  }
                </div>

              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-6">No recent appointments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
