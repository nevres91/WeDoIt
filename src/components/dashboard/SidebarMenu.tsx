import { SetStateAction } from "react";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../context/DashboardContext";

export const SidebarMenu = ({
  setSidebar,
}: {
  setSidebar: React.Dispatch<SetStateAction<boolean>>;
}) => {
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
              onClick={() => {
                setActiveTab("home");
                setSidebar(false);
              }}
              className={`${buttonClassses}`}
            >
              Your tasks
            </button>
            <button
              onClick={() => {
                setActiveTab("partner");
                setSidebar(false);
              }}
              className={`${buttonClassses}, ${
                !userData?.partnerId ? "hidden" : ""
              }`}
            >
              Partner's tasks
            </button>
            <button
              onClick={() => {
                setActiveTab("find-partner");
                setSidebar(false);
              }}
              className={`${buttonClassses}, ${
                userData?.partnerId ? "hidden" : ""
              }`}
            >
              Link a partner
            </button>
            <button
              onClick={() => {
                setActiveTab("declined");
                setSidebar(false);
              }}
              className={buttonClassses}
            >
              Declined Tasks
            </button>
            <button
              onClick={() => {
                setActiveTab("todo");
                setSidebar(false);
              }}
              className={buttonClassses}
            >
              To Do
            </button>
            <button
              onClick={() => {
                setActiveTab("calendar");
                setSidebar(false);
              }}
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
