import { PartnerData, UserData } from "../types";
import Navbar from "./Navbar";
import Partner from "./Partner";
import clsx from "clsx";

interface DashboardMiddleProps {
  visible: boolean;
  userData: UserData;
  partnerData: PartnerData | null;
  partnerLink: boolean;
  setPartnerLink: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const DashboardMiddle: React.FC<DashboardMiddleProps> = ({
  partnerData,
  visible,
  userData,
  partnerLink,
  setPartnerLink,
  loading,
}) => {
  return (
    <>
      <div
        id="scrollable-content"
        className="flex shadow-2xl h-[calc(100%-6px)] w-[60%] bg-white bg-opacity-80 backdrop-blur-[9px] rounded-[4px] flex-col items-center overflow-auto relative"
      >
        <Navbar visible={visible} />
        {/* ROLE IMAGE */}
        <div
          className={clsx(
            "w-[150px]",
            "h-[150px]",
            "min-h-[150px]",
            "mt-10",
            "bg-contain",
            "bg-no-repeat",
            "bg-center",
            {
              "bg-couple": partnerData && !loading,
              "bg-husband":
                userData?.role === "husband" && !partnerData && !loading,
              "bg-wife":
                userData?.role !== "husband" && !partnerData && !loading,
            }
          )}
        />
        {/* NAMES */}
        <h2 className="text-2xl font-bold mt-4 text-button-hover">
          {!userData
            ? ""
            : userData.firstName.toUpperCase() +
              (partnerData
                ? " " + "& " + partnerData?.firstName.toUpperCase()
                : "")}
        </h2>
        {/* Partner data */}
        <div className="w-[45%]   p-10 mt-10 bg-login-button shadow-lg bg-opacity-15 rounded-md flex flex-col items-center">
          <p className="text-button-hover font-medium">
            Your role in this task application is a {userData?.role}
            {partnerData
              ? `, and ${partnerData?.firstName} is your ${
                  userData.role === "husband" ? "wife" : "husband"
                }`
              : " and you don't have a partner yet."}
          </p>
          {!partnerData && !partnerLink ? (
            <button
              onClick={() => setPartnerLink(true)}
              className="bg-login-button text-input-bg p-2  rounded-md w-full hover:bg-button-hover transition-all duration-100 disabled:opacity-50 mt-2"
            >
              Connect to your partner
            </button>
          ) : !partnerData && partnerLink ? (
            <Partner />
          ) : (
            ""
          )}
        </div>
        <div className="p-8 pt-20 space-y-6">
          {[...Array(50)].map((_, i) => (
            <p key={i} className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              sodales.
            </p>
          ))}
        </div>
      </div>
    </>
  );
};
