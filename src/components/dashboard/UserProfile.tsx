import { SetStateAction, useRef, useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../hooks/useTasks";
import { auth } from "../../services/firebase";
import { useTranslation } from "react-i18next";
import imageCompression from "browser-image-compression";

export const UserProfile = ({
  setSidebar,
}: {
  setSidebar: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false); // Track upload state
  const { userData, updateUserData } = useAuth();
  const { setActiveTab } = useDashboard();
  const {
    firstName,
    lastName,
    email,
    role,
    height,
    job,
    weight,
    birthday,
    photoURL,
  } = userData || {};
  const { inProgressTasks, doneTasks, expiredTasks } = useTasks(
    auth.currentUser?.uid
  );
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter out expired tasks from inProgressTasks
  const activeInProgressTasks = inProgressTasks.filter((task) => {
    if (!task.dueDate) return true; // Keep tasks without dueDate
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate >= now;
  });

  //Age
  const age = birthday
    ? Math.floor(
        (new Date().getTime() - new Date(birthday).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25) // Account for leap years
      )
    : t("unknown");

  // Handle profile picture click to trigger file input
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!auth.currentUser) {
      alert(
        t("not_authenticated") || "You must be signed in to upload a picture."
      );
      return;
    }

    setUploading(true);
    try {
      // Compress image
      const options = {
        maxSizeMB: 0.2, // Target 200 KB
        maxWidthOrHeight: 400, // Decent resolution for profile pics
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(compressedFile);
      });
      const base64String = await base64Promise;

      // Validate size (Firestore limit ~1 MB)
      if (base64String.length > 1_000_000) {
        throw new Error(
          t("image_too_large") || "Image is too large (max 750 KB)"
        );
      }
      // Update user data
      await updateUserData({ photoURL: base64String });
    } catch (error: any) {
      console.error("Upload error:", {
        message: error.message,
        code: error.code,
        details: error,
      });
      alert(t("upload_error") || `Failed to upload: ${error.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  return (
    <>
      <div // Container
        className={`relative w-[calc(100%-12px)] min-w-[220px] flex flex-col items-center  gap-2 my-3 rounded-md mt-[6%] transition-all duration-200 z-40`}
      >
        <div
          className="mb-9" // BUTTONS
        >
          <div // Button-left
            onClick={() => {
              setActiveTab("edit-profile");
              setSidebar(false);
            }}
            className="flex items-center content-center text-center bg-calm-n-cool-1 h-[40px] absolute  left-0 w-[50%] rounded-md hover:bg-calm-n-cool-4 transition-all duration-150 cursor-pointer p-1 text-calm-n-cool-6 hover:text-calm-n-cool-1"
          >
            <i className=" fa-solid fa-user-pen fa-lg  ml-[calc(50%-25%)]"></i>
          </div>
          <div // Button-right
            onClick={() => {
              setActiveTab("home");
              setSidebar(false);
            }}
            className="flex items-center content-center text-center bg-calm-n-cool-1 h-[40px] absolute  right-0 w-[50%] rounded-md hover:bg-calm-n-cool-4 transition-all duration-150 cursor-pointer p-1 text-calm-n-cool-6 hover:text-calm-n-cool-1"
          >
            <i className=" fa-solid fa-house fa-lg  ml-[calc(50%+5%)]"></i>
          </div>
        </div>
        <div
          className={`rounded-full w-[100px] h-[100px] mt-3 absolute -top-6 border-4 border-calm-n-cool-6 z-50 cursor-pointer group transition-all duration-200 ${
            uploading ? "opacity-50" : "hover:opacity-80"
          }`}
          onClick={handleProfilePictureClick}
        >
          <div
            className={`w-full h-full rounded-full bg-cover bg-center ${
              photoURL ? "" : "bg-profile bg-contain"
            }`}
            style={{
              backgroundImage: photoURL ? `url(${photoURL})` : undefined,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <i className="fa-solid fa-camera text-white fa-lg"></i>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-t-transparent border-calm-n-cool-6 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <div //TEXT container
          className={`z-40 text-calm-n-cool-6 font-semibold text-xl text-center rounded-md bg-calm-n-cool-1 w-full h-full`}
          style={{ fontFamily: "montserrat" }}
        >
          <p className="mt-[40px]">{firstName + " " + lastName}</p>
          <p className="text-[13px] font-light px-2 break-all line-clamp-1">
            {email}
          </p>
          <button // Expand Button
            className={`fa-solid ${
              isExpanded ? "fa-square-caret-up" : "fa-caret-down"
            } fa-lg self-start flex mt-3 ml-1`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <div // User Data
            className={` ${
              isExpanded ? "opacity-100" : "opacity-0 max-h-0 overflow-hidden"
            }  mt-[20px] flex flex-col transition-all duration-200 text-start z-[100]`}
          >
            <p className="ml-1 text-sm">{t("your_information")}</p>
            <ul className="text-calm-n-cool-1 text-sm font-semibold w-[97%] m-auto text-start">
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("first_name_label")}</p>{" "}
                <span className="font-light ml-4">{firstName}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("last_name_label")}</p>{" "}
                <span className="font-light ml-4">{lastName}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("sex")}</p>{" "}
                <span className="font-light ml-4">
                  {role === "wife" ? t("female") : t("male")}
                </span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("age")}</p>{" "}
                <span className="font-light ml-4">{age}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("job")}</p>{" "}
                <span className="font-light ml-4">{job ? job : "Unknown"}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("height")}</p>{" "}
                <span className="font-light ml-4">
                  {height ? height + " cm" : "Unknown"}
                </span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("weight")}</p>{" "}
                <span className="font-light ml-4">
                  {weight ? weight + " kg" : "Unknown"}
                </span>
              </li>
            </ul>
            <p className="ml-1 mt-2 text-sm">{t("task_overview")}</p>
            <ul className="text-calm-n-cool-1 text-sm font-semibold w-[97%] m-auto text-start">
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("completed")}</p>{" "}
                <span className="font-light ml-4">{doneTasks.length}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("ongoing")}</p>{" "}
                <span className="font-light ml-4">
                  {activeInProgressTasks.length}
                </span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">{t("expired")}</p>{" "}
                <span className="font-light ml-4">{expiredTasks.length}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
