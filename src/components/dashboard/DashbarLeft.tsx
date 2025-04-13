import { SetStateAction } from "react";
import { UserData } from "../../types";
import { leavePartner } from "../../utils/PartnerService";
import { PartnershipInvitations } from "./PartnershipInvitations";
import { SidebarMenu } from "./SidebarMenu";
import { UserProfile } from "./UserProfile";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
interface DashbarLeftProps {
  logout: () => void;
  role: string;
  userData: UserData;
  userId: string | undefined;
  sidebar: boolean;
  setSidebar: React.Dispatch<SetStateAction<boolean>>;
}

const DashbarLeft: React.FC<DashbarLeftProps> = ({
  logout,
  role,
  userData,
  userId,
  sidebar,
  setSidebar,
}) => {
  const { t } = useTranslation();
  useLanguage();
  const handleLeave = () => {
    // Show confirmation dialog
    const confirmLeave = window.confirm(t("leaving_partner_warning"));
    if (confirmLeave && userId && userData?.partnerId) {
      leavePartner(userId, userData.partnerId);
    }
  };
  const isLeaveDisabled = !userId || !userData?.partnerId;
  return (
    <>
      <div //Container
        className={`-translate-x-[100%] ${
          sidebar
            ? "translate-x-0 z-40 border-r-2 border-calm-n-cool-5 "
            : "-translate-x-[110%] z-40"
        } absolute  lg:relative lg:translate-x-[0] transition-all ease-in-out duration-200 flex flex-col items-center shadow-2xl h-[calc(100vh-6px)]  w-[280px] lg:w-[16%] min-w-[250px] lg:max-w-[300px] bg-calm-n-cool-6  backdrop-blur-[9px] rounded-[4px] ml-[3px] overflow-y-auto scrollbar-transparent`}
      >
        <div
          className={`w-full h-full absolute top-0 left-0 opacity-5 ${
            role === "husband" ? "bg-man scale-x-[-1]" : "bg-woman"
          } bg-contain bg-no-repeat bg-center `}
        />
        <UserProfile setSidebar={setSidebar} />
        <SidebarMenu setSidebar={setSidebar} />
        <PartnershipInvitations userData={userData} />
        <div className="bg-calm-n-cool-6 w-full flex flex-col mt-auto pt-8 pb-2 rounded-b-md  ">
          <button //Leave Partner Button
            onClick={handleLeave}
            className={`group relative mb-2 z-40 bg-red-500 font-light  hover:bg-calm-n-cool-1 hover:text-red-600 hover:font-normal text-white p-2  rounded-md w-[calc(100%-12px)]  transition-all duration-100 disabled:bg-red-600 disabled:opacity-50 m-auto ${
              isLeaveDisabled ? "hidden" : ""
            }`}
          >
            <i className="fa-solid fa-heart-crack fa-xl absolute left-2 top-5 group-hover:rotate-[15deg]"></i>{" "}
            {t("leave_your_partner")}
          </button>
          <button // Logout Button
            onClick={logout}
            className="group relative z-40 bg-calm-n-cool-4 font-light hover:bg-calm-n-cool-1 hover:text-calm-n-cool-6 text-white p-2  rounded-md w-[calc(100%-12px)]  transition-all duration-100 disabled:opacity-50 m-auto"
          >
            <i className="fa-solid fa-right-from-bracket fa-xl absolute left-2 top-5 group-hover:translate-x-[2px]"></i>{" "}
            {t("logout")}
          </button>
        </div>
      </div>
    </>
  );
};
export default DashbarLeft;
