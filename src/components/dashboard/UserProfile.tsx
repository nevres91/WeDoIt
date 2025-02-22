import { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";

export const UserProfile = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { setActiveTab } = useDashboard();
  return (
    <>
      <div // Container
        className={`relative w-[calc(100%-12px)] min-w-[220px] ${
          isExpanded ? "" : "h-[20%] min-h-[180px]"
        } flex flex-col items-center  gap-2   my-3 rounded-md mt-[6%] transition-all duration-200 z-40`}
      >
        <div
          className="mb-9" // BUTTONS
        >
          <div // Button-left
            className="flex items-center content-center text-center bg-calm-n-cool-1 h-[40px] absolute  left-0 w-[50%] rounded-md hover:bg-calm-n-cool-4 transition-all duration-150 cursor-pointer p-1 text-calm-n-cool-6 hover:text-calm-n-cool-1"
          >
            <i className=" fa-solid fa-user-pen fa-lg  ml-[calc(50%-25%)]"></i>
          </div>
          <div // Button-right
            onClick={() => setActiveTab("home")}
            className="flex items-center content-center text-center bg-calm-n-cool-1 h-[40px] absolute  right-0 w-[50%] rounded-md hover:bg-calm-n-cool-4 transition-all duration-150 cursor-pointer p-1 text-calm-n-cool-6 hover:text-calm-n-cool-1"
          >
            <i className=" fa-solid fa-house fa-lg  ml-[calc(50%+5%)]"></i>
          </div>
        </div>
        <div // Profile Picture
          className=" bg-profile bg-contain  rounded-full w-[100px] h-[100px] mt-3 absolute -top-6 border-4 border-calm-n-cool-6 z-50"
        />
        <div //TEXT container
          className={`pb-5 z-40 text-calm-n-cool-6 font-semibold text-xl text-center rounded-md bg-calm-n-cool-1 w-full h-[calc(100%-45px)]`}
          style={{ fontFamily: "montserrat" }}
        >
          <p className="mt-[40px]">Nevres Muratovic</p>
          <p className="text-sm font-light">nevres_muratovic@hotmail.com</p>
          <button // Expand Button
            className={`fa-solid border-1 ${
              isExpanded ? "fa-square-caret-up" : "fa-caret-down"
            } fa-lg absolute left-3 top-[150px]`}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <div // User Data
            className={` ${
              isExpanded ? "opacity-100" : "opacity-0 max-h-0 overflow-hidden"
            }  mt-[40px] flex flex-col transition-all duration-200 text-start z-[100]`}
          >
            <p className="ml-1 text-sm">Your Information</p>
            <ul className="text-calm-n-cool-1 text-sm font-semibold w-[97%] m-auto text-start">
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">First Name:</p>{" "}
                <span className="font-light ml-4">Nevres</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Last Name:</p>{" "}
                <span className="font-light ml-4">Muratovic</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Sex:</p>{" "}
                <span className="font-light ml-4">Male</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Age:</p>{" "}
                <span className="font-light ml-4">34</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Job:</p>{" "}
                <span className="font-light ml-4">Unemployed</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Height:</p>{" "}
                <span className="font-light ml-4">186 cm</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Weight:</p>{" "}
                <span className="font-light ml-4">94 kg</span>
              </li>
            </ul>
            <p className="ml-1 mt-2 text-sm">Task Overview</p>
            <ul className="text-calm-n-cool-1 text-sm font-semibold w-[97%] m-auto text-start">
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Completed:</p>{" "}
                <span className="font-light ml-4">23</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Ongoing:</p>{" "}
                <span className="font-light ml-4">15</span>
              </li>
              <li className="flex rounded-md bg-calm-n-cool-5 p-1 pl-3 my-1">
                <p className="w-[90px]">Expired:</p>{" "}
                <span className="font-light ml-4">3</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="bg-calm-n-cool-1 p-2 w-[calc(100%-12px)] text-sm text-calm-n-cool-6  min-w-[220px] rounded-md ">
        <p className=" font-bold">Partner Data:</p>
        <p>Sex: Male</p>
        <p>Height: 186cm</p>
        <p>Weight: 94kg</p>
      </div> */}
    </>
  );
};
