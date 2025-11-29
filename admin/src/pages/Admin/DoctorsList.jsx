import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctorsList, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h[-90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {Array.isArray(doctorsList) && doctorsList.length > 0 ? (
          doctorsList.map((item, index) => (
            <div className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group" key={index}>
              <img className="bg-indigo-50 group-hover:bg-[#24a0ed] transition-all duration-500" src={item.image} alt={item.name} />
              <div className="p-4 ">
                <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
                <p className="texxt-zinc-600 text-sm">Speciality: {item.speciality}</p>
                <div className="mt-2 flex items-center text-sm gap-1">
                  <input
                    type="checkbox"
                    checked={item.available}
                    onChange={() => changeAvailability(item._id)}
                  />
                  <p>Available</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No doctors found</p>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
