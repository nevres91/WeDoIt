import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";
import { useTranslation } from "react-i18next";

// Define the type for updatedData to align with UserData
interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  role?: "husband" | "wife"; // Match UserData's role type
  language: "en" | "bs";
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
    language: userData?.language || "",
    birthday: userData?.birthday || "",
    job: userData?.job || "",
    height: userData?.height || "",
    weight: userData?.weight || "",
  });

  const { t } = useTranslation();

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
        language: formData.language,
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
          <i className="fa-solid fa-user-pen"></i> {t("edit_profile")}
        </h2>
        <div className="w-full overflow-auto scrollbar-transparent">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm">{t("first_name")}</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm">{t("last_name")}</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm">{t("language")}</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              >
                <option value="en">English</option>
                <option value="bs">Bosanski</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">{t("sex")}</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
                disabled={userData?.partnerId ? true : false} // Simplified to userData?.partnerId
              >
                <option value="Male">{t("male")}</option>
                <option value="Female">{t("female")}</option>
              </select>
              {userData?.partnerId && (
                <span className="text-red-600 text-xs mt-1 block ml-1">
                  {t("sex_change")}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm">{t("birthday")}</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm">{t("job")}</label>
              <input
                type="text"
                name="job"
                value={formData.job}
                onChange={handleChange}
                maxLength={50}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70 "
              />
            </div>
            <div>
              <label className="block text-sm">{t("height")} (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-200 hover:bg-gray-100 transition-all ease-in-out duration-100 text-calm-n-cool-5 bg-opacity-70"
              />
            </div>
            <div>
              <label className="block text-sm">{t("weight")} (kg)</label>
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
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="w-[100px] bg-calm-n-cool-4 text-white px-4 py-2 rounded hover:bg-calm-n-cool-5 active:bg-calm-n-cool-6  transition-all ease-in-out duration-200"
              >
                {t("save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
