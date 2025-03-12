import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHideOnScroll } from "../hooks/UseHideOnScroll";
import { usePartnerData } from "../hooks/usePartnerData";
import DashbarLeft from "../components/dashboard/DashbarLeft";
import { DashboardMiddle } from "../components/dashboard/DashboardMiddle";
import { DashboardProvider } from "../context/DashboardContext";

const Dashboard = () => {
  const [partnerLink, setPartnerLink] = useState<boolean>(false);
  const { userData, logout, user } = useAuth();
  const [role, setRole] = useState<string>("");
  // const { invitations, handleAccept, handleReject, invitationsMessage } =
  //   useInvitations();
  const { partnerData, loading } = usePartnerData() || {
    partnerData: null,
  };
  const { visible } = useHideOnScroll();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      const role = userData.role;
      setRole(role);
    }
  });

  return (
    <DashboardProvider>
      <div //BACKGROUND
        className="flex bg-calm-n-cool-3 bg-cover bg-center min-h-[100vh] "
      >
        <div // CONTAINER
          className="flex gap-[3px] rounded-md  w-[100vw] h-[100vh] items-center"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`absolute transition-all ease-in-out duration-200 text-calm-n-cool-5 ${
              sidebarOpen ? "left-[255px]" : "left-1"
            } top-4 left-4 z-40`}
          >
            {!sidebarOpen ? (
              <i className="fa-solid fa-bars fa-xl" />
            ) : (
              <i className="fa-solid fa-close fa-xl"></i>
            )}
          </button>
          {/* --------------------LEFT SIDE-------------------- */}
          <DashbarLeft
            logout={logout}
            role={role}
            userData={userData}
            userId={user?.uid}
            sidebar={sidebarOpen}
          />
          {/* --------------------MIDDLE-------------------- */}
          <DashboardMiddle
            partnerLink={partnerLink}
            partnerData={partnerData}
            setPartnerLink={setPartnerLink}
            userData={userData}
            visible={visible}
            loading={loading}
          />
          {/* --------------------RIGHT SIDE-------------------- */}
          {/* <DashboardRight
          handleAccept={handleAccept}
          handleReject={handleReject}
          invitations={invitations}
          partnerData={partnerData}
          userId={user?.uid}
          userData={userData}
          invitationsMessage={invitationsMessage}
          role={role}
        /> */}
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
