import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";

export const SidebarMenu = () => {
  const { setActiveTab } = useDashboard();
  const { userData } = useAuth();
  const buttonClassses =
    "mb-1 bg-calm-n-cool-1 w-full rounded-md p-1 text-calm-n-cool-6 hover:text-calm-n-cool-1 hover:bg-calm-n-cool-4 hover:cursor-pointer transition-all duration-100 ";
  return (
    <>
      <div className="  w-[calc(100%-12px)] min-w-[220px] z-[10] bg-calm-n-cool-6">
        <ul className="">
          <li>
            <button
              onClick={() => setActiveTab("partner")}
              className={`${buttonClassses}, ${
                !userData?.partnerId ? "hidden" : ""
              }`}
            >
              Partner
            </button>
            <button
              onClick={() => setActiveTab("find-partner")}
              className={`${buttonClassses}, ${
                userData?.partnerId ? "hidden" : ""
              }`}
            >
              Link a partner
            </button>
            <button
              onClick={() => setActiveTab("your-tasks")}
              className={buttonClassses}
            >
              Your Tasks
            </button>
            <button
              onClick={() => setActiveTab("partners-tasks")}
              className={`${buttonClassses}, ${
                !userData?.partnerId ? "hidden" : ""
              }`}
            >
              Partner's Tasks
            </button>
            <button
              onClick={() => setActiveTab("todo")}
              className={buttonClassses}
            >
              To Do
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={buttonClassses}
            >
              Calendar
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};
