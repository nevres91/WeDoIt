import { SetStateAction, useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../hooks/useTasks";
import { auth } from "../../services/firebase";
import { EditProfile } from "../EditProfile";

export const UserProfile = ({
  setSidebar,
}: {
  setSidebar: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const { userData } = useAuth();
  const { setActiveTab } = useDashboard();
  const { firstName, lastName, email, role, height, job, weight, birthday } =
    userData || {};
  const { inProgressTasks, doneTasks, expiredTasks } = useTasks(
    auth.currentUser?.uid
  );

  // Filter out expired tasks from inProgressTasks
  const activeInProgressTasks = inProgressTasks.filter((task) => {
    if (!task.dueDate) return true; // Keep tasks without dueDate
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    return dueDate >= now; // Keep only non-expired tasks
  });

  const profileData = {
    firstName: firstName || "",
    lastName: lastName || "",
    role: role || "",
    age: 0,
    job: job,
    height: height,
    weight: "Unknown",
  };
  return (
    <>
      <div // Container
        className={`relative w-[calc(100%-12px)] min-w-[220px] ${
          isExpanded ? "" : " "
        } flex flex-col items-center  gap-2 my-3 rounded-md mt-[6%] transition-all duration-200 z-40`}
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
        <div // Profile Picture
          className=" bg-profile bg-contain  rounded-full w-[100px] h-[100px] mt-3 absolute -top-6 border-4 border-calm-n-cool-6 z-50"
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
            <p className="ml-1 text-sm">Your Information</p>
            <ul className="text-calm-n-cool-1 text-sm font-semibold w-[97%] m-auto text-start">
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">First Name:</p>{" "}
                <span className="font-light ml-4">{firstName}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Last Name:</p>{" "}
                <span className="font-light ml-4">{lastName}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Sex:</p>{" "}
                <span className="font-light ml-4">
                  {role === "wife" ? "Female" : "Male"}
                </span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Age:</p>{" "}
                <span className="font-light ml-4">33</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Job:</p>{" "}
                <span className="font-light ml-4">{job ? job : "Unknown"}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Height:</p>{" "}
                <span className="font-light ml-4">
                  {height ? height + " cm" : "Unknown"}
                </span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Weight:</p>{" "}
                <span className="font-light ml-4">
                  {weight ? weight + " kg" : "Unknown"}
                </span>
              </li>
            </ul>
            <p className="ml-1 mt-2 text-sm">Task Overview</p>
            <ul className="text-calm-n-cool-1 text-sm font-semibold w-[97%] m-auto text-start">
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Completed:</p>{" "}
                <span className="font-light ml-4">{doneTasks.length}</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Ongoing:</p>{" "}
                <span className="font-light ml-4">
                  {activeInProgressTasks.length}
                </span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Expired:</p>{" "}
                <span className="font-light ml-4">{expiredTasks.length}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
