import { useDashboard } from "../../context/DashboardContext";
import { PartnerData, UserData } from "../../types";
import { DashboardFindPartner } from "./DashboardFindPartner";
import { DashboardPartner } from "./DashboardPartner";
import Navbar from "./Navbar";
import Partner from "../Partner";
import clsx from "clsx";
import { ToDo } from "./ToDo";
import { YourTasks } from "./YourTasks";
import { Calendar } from "./Calendar";
import { DashboardPartnersTasks } from "./DashboardPartnersTasks";

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
  const { activeTab, setActiveTab } = useDashboard();
  return (
    <>
      <div
        id="scrollable-content"
        className="flex shadow-2xl h-[calc(100%-6px)] w-[84%] mr-[3px] bg-calm-n-cool-1  backdrop-blur-[9px] rounded-[4px] flex-col items-center overflow-auto relative"
      >
        {/* <Navbar visible={visible} /> */}
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
            "transiton-all",
            "duration-100",
            {
              "bg-couple": partnerData && !loading,
              "scale-[0] translate-y-[-50px]": activeTab !== "home",
              "bg-husband":
                userData?.role === "husband" && !partnerData && !loading,
              "bg-wife":
                userData?.role !== "husband" && !partnerData && !loading,
            }
          )}
        />
        {/* NAMES */}
        <h2
          className={`text-2xl font-bold mt-4 text-calm-n-cool-5 transition-all duration-300 ${
            activeTab !== "home" ? "translate-y-[-150px]" : ""
          }`}
        >
          {!userData
            ? ""
            : userData.firstName.toUpperCase() +
              (partnerData
                ? " " + "& " + partnerData?.firstName.toUpperCase()
                : "")}
        </h2>
        {activeTab === "find-partner" ? (
          <p className="text-calm-n-cool-5 -translate-y-[140px]">
            Please enter an e-mail adress of your desired partner
          </p>
        ) : (
          ""
        )}

        {activeTab === "home" ? (
          <div className="p-8 pt-20 space-y-6">
            {[...Array(50)].map((_, i) => (
              <p key={i} className="text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur sodales.
              </p>
            ))}
          </div>
        ) : activeTab === "partner" ? (
          <DashboardPartner />
        ) : activeTab === "your-tasks" ? (
          <YourTasks />
        ) : activeTab === "calendar" ? (
          <Calendar />
        ) : activeTab === "partners-tasks" ? (
          <DashboardPartnersTasks />
        ) : activeTab === "todo" ? (
          <ToDo />
        ) : activeTab === "find-partner" ? (
          <DashboardFindPartner />
        ) : (
          ""
        )}
      </div>
    </>
  );
};
