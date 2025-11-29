import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, setProfileData, backendURL } = useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {

    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      }

      const { data } = await axios.post(backendURL + '/api/doctor/update-profile', updateData, { headers: { dToken } });

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false);
        getProfileData();
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error("Update Profile Error:", error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  if (!profileData) return null;

  return (
    <div className="m-5">
      <div className="flex flex-col gap-4">

        {/* Profile Image */}
        <div>
          <img
            className="bg-[#5F6FFF]/80 w-full sm:max-w-64 rounded-lg"
            src={profileData.image}
            alt={profileData.name}
          />
        </div>

        <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">

          {/* Name */}
          <p className="text-3xl font-medium text-gray-700">
            {profileData.name}
          </p>

          {/* Speciality + Experience */}
          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>{profileData.degree || "Doctor"} – {profileData.speciality}</p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {profileData.experience} yrs
            </button>
          </div>

          {/* About */}
          <div className="mt-3">
            <p className="text-sm font-medium text-neutral-800">About:</p>
            <p className="text-sm text-gray-600 mt-1 max-w-[700px]">
              {profileData.about}
            </p>
          </div>

          {/* Appointment Fee */}
          <p className="text-gray-600 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-800">
              {currency}{" "}
              {isEdit ? (
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-24"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          {/* Address */}
          <div className="flex gap-2 py-2">
            <p className="font-medium">Address:</p>
            <div className="text-sm text-gray-700">

              {/* Line 1 */}
              {isEdit ? (
                <input
                  type="text"
                  className="border px-2 py-1 rounded w-full mb-1"
                  value={profileData.address?.line1}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
              ) : (
                <p>{profileData.address?.line1}</p>
              )}

              {/* Line 2 */}
              {isEdit ? (
                <input
                  type="text"
                  className="border px-2 py-1 rounded w-full"
                  value={profileData.address?.line2}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              ) : (
                <p>{profileData.address?.line2}</p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="flex gap-1 pt-2 items-center">
            <input
              type="checkbox"
              checked={profileData.available}
              disabled={!isEdit}
              onChange={() =>
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
            />
            <label className="text-gray-700">Available</label>
          </div>

          {/* Edit / Save Buttons */}
          {isEdit ? (
            <button
              onClick={updateProfile}
              className="px-4 py-1 border border-[#5F6FFF] text-sm rounded-full mt-5 
                         hover:bg-[#5F6FFF] hover:text-white transition-all cursor-pointer"
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="px-4 py-1 border border-[#5F6FFF] text-sm rounded-full mt-5 
                         hover:bg-[#5F6FFF] hover:text-white transition-all cursor-pointer"
            >
              Edit
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
