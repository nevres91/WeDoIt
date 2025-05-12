import { useDashboard } from "../../context/DashboardContext";
import { PartnerData, Task, UserData } from "../../types";
import { DashboardFindPartner } from "./DashboardFindPartner";
// import Navbar from "./Navbar";
import { ToDo } from "./ToDo";
import { YourTasks } from "./YourTasks";
import { Calendar } from "./Calendar";
import DashboardHome from "./DashboardHome";
import { auth } from "../../services/firebase";
import DashboardPartner from "./DashboardPartner";
import { useTasks } from "../../hooks/useTasks";
import DeclinedTasks from "./DeclinedTasks";
import { EditProfile } from "../EditProfile";
import { Notifications } from "./Notifications";
import PartnerProfile from "./PartnerProfile";

interface DashboardMiddleProps {
  visible: boolean;
  userData: UserData;
  partnerData: PartnerData | null;
  partnerLink: boolean;
  setPartnerLink: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const DashboardMiddle: React.FC<DashboardMiddleProps> = () => {
  const { activeTab } = useDashboard();
  const { tasks, setTasks } = useTasks(auth.currentUser?.uid);

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };
  return (
    <>
      <div
        id="scrollable-content"
        className="flex h-[calc(100%-6px)] transition-all ease-in-out duration-200 w-[calc(100%-6px)] mx-auto lg:w-[84%] mr-[3px] bg-calm-n-cool-1  backdrop-blur-[9px] rounded-[4px] flex-col items-center overflow-auto relative"
      >
        {/* <Navbar visible={visible} /> */}
        {/* TEST */}
        {/* <div className="relative z-10 flex items-center justify-center space-x-6 w-full p-5 bg-white">
          <p className="text-4xl md:text-5xl font-normal text-calm-n-cool-5 tracking-wide drop-shadow-xl animate-fadeInLeft">
            NEVRES
          </p>
          <div className="text-calm-n-cool-6 animate-pulse">
            <i className="fa-solid fa-heart text-4xl md:text-5xl drop-shadow-md"></i>
          </div>
          <p className="text-4xl md:text-5xl font-normal text-calm-n-cool-5 tracking-wide drop-shadow-md animate-fadeInRight">
            DŽENANA
          </p>
        </div> */}
        {activeTab === "find-partner" ? (
          <p className="text-calm-n-cool-5 -translate-y-[140px]">
            Please enter an e-mail adress of your desired partner
          </p>
        ) : (
          ""
        )}

        {activeTab === "home" ? (
          <DashboardHome onUpdateTask={handleUpdateTask} />
        ) : activeTab === "partner" ? (
          <DashboardPartner onUpdateTask={handleUpdateTask} />
        ) : activeTab === "your-tasks" ? (
          <YourTasks />
        ) : activeTab === "calendar" ? (
          <Calendar />
        ) : activeTab === "todo" ? (
          <ToDo />
        ) : activeTab === "find-partner" ? (
          <DashboardFindPartner />
        ) : activeTab === "declined" ? (
          <DeclinedTasks />
        ) : activeTab === "edit-profile" ? (
          <EditProfile />
        ) : activeTab === "notifications" ? (
          <Notifications />
        ) : activeTab === "partner-profile" ? (
          <PartnerProfile />
        ) : (
          ""
        )}
      </div>
    </>
  );
};
