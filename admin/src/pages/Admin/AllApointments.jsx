import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  // consistent column layout for both header and rows
  const gridCols = 'grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr]';

  return (
    <div className="w-full max-w-6xl mx-auto my-6 p-3">
      <p className="mb-4 text-xl font-semibold text-gray-800">All Appointments</p>

      <div className="bg-white border rounded-lg shadow-sm overflow-x-auto">
        {/* Header */}
        <div
          className={`hidden sm:grid ${gridCols} items-center px-6 py-3 border-b bg-gray-100 text-gray-700 font-medium text-sm`}
        >
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date &amp; Time</p>
          <p>Doctor</p>
          <p>Fee</p>
          <p>Action</p>
        </div>

        {/* Appointments */}
        <div className="max-h-[75vh] overflow-y-auto text-sm">
          {appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div
                key={index}
                className={`flex flex-wrap justify-between sm:grid ${gridCols} items-center px-6 py-4 border-b text-gray-600 hover:bg-gray-50 transition-colors`}
              >
                <p className="max-sm:hidden">{index + 1}</p>

                <div className="flex items-center gap-2 min-w-[140px]">
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={item.userData?.image}
                    alt="user"
                  />
                  <p className="truncate">{item.userData?.name}</p>
                </div>

                <p className="max-sm:hidden">{calculateAge(item.userData?.dob)}</p>

                <p className="whitespace-nowrap">
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                <div className="flex items-center gap-2 min-w-[140px]">
                  <img
                    className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                    src={item.docData?.image}
                    alt="doctor"
                  />
                  <p className="truncate">{item.docData?.name}</p>
                </div>

                <p className="font-medium">{currency}{item.amount}</p>

                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-semibold">Cancelled</p>
                ) : (
                  item.isCompleted ? <p className="text-green-500 text-xs font-semibold">Completed</p> :
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-8 h-8 cursor-pointer hover:scale-105 transition-transform"
                      src={assets.cancel_icon}
                      alt="Cancel"
                      title="Cancel Appointment"
                    />
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-10">No appointments found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
