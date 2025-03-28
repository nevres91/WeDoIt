import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

// Define the type for updatedData to align with UserData
interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  role?: "husband" | "wife"; // Match UserData's role type
  job?: string;
  height?: string;
  weight?: string;
  bio?: string;
  location?: string;
  birthday?: string;
  [key: string]: any; // Keep index signature for flexibility
}

export const EditProfile = () => {
  const { userData, updateUserData } = useAuth();
  const { setActiveTab } = useDashboard();

  // Initialize formData with userData or defaults
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    sex: userData?.role === "wife" ? "Female" : "Male", // Infer sex from role initially
    birthday: userData?.birthday || "",
    job: userData?.job || "",
    height: userData?.height || "",
    weight: userData?.weight || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData: ProfileUpdateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,

        role: formData.sex === "Female" ? "wife" : "husband",

        job: formData.job,
        height: formData.height,
        weight: formData.weight,
        birthday: formData.birthday,
      };

      // Remove empty fields to avoid overwriting with empty strings
      Object.keys(updatedData).forEach((key) => {
        if (updatedData[key] === "" || updatedData[key] === undefined) {
          delete updatedData[key];
        }
      });

      await updateUserData(updatedData);
      setActiveTab("home"); // Return to home tab after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setActiveTab("home"); // Return to home tab on cancel
  };

  return (
    <div //Container
      className="w-full h-full  bg-gradient-to-t from-calm-n-cool-6 to-calm-n-cool-1-hover  flex justify-center  z-50"
    >
      <div //Content
        className="bg-calm-n-cool-1 bg-opacity-50 shadow-xl backdrop-blur-[3px] p-6 rounded-md w-[90%] max-w-[800px] text-calm-n-cool-6  mt-[50px] md:mt-20  mb-10 flex flex-col"
      >
        <h2
          className="text-xl font-semibold mb-4"
          style={{ fontFamily: "montserrat" }}
        >
          <i className="fa-solid fa-user-pen"></i> Edit Profile
        </h2>
        <div className="w-full overflow-auto scrollbar-transparent">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm">Sex</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
                disabled={userData?.partnerId ? true : false} // Simplified to userData?.partnerId
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {userData?.partnerId && (
                <span className="text-red-600 text-xs mt-1 block ml-1">
                  Sex change not allowed if linked with a partner.
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm">Job</label>
              <input
                type="text"
                name="job"
                value={formData.job}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70 "
              />
            </div>
            <div>
              <label className="block text-sm">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="w-[100px] bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 active:bg-gray-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-[100px] bg-calm-n-cool-4 text-white px-4 py-2 rounded hover:bg-calm-n-cool-5 active:bg-calm-n-cool-6  transition-all ease-in-out duration-200"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
